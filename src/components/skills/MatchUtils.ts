import { Profile } from "./sample-data";

export interface RequestedSkill {
  skill_id: string;
  min_level: number; // 1-5
}

export interface Filters {
  skills: RequestedSkill[];
  category?: string;
  location?: string; // city or country contains
  business_unit?: string;
  min_availability?: number; // percent
  earliest_start_by?: string; // ISO date
  updated_within_days?: number; // 30 | 90
  open_to_mission?: boolean;
  relaxed?: boolean; // OR vs AND
  sort_by?: "match" | "availability" | "updated";
}

export function computeMatchScore(
  profile: Profile,
  filters: Filters
): { qualifies: boolean; score: number } {
  const selected = filters.skills;
  const relaxed = !!filters.relaxed;

  // Helper map of profile skills
  const pskills = new Map(profile.skills.map((s) => [s.skill_id, s.proficiency_level]));

  if (!relaxed) {
    // AND: all required skills must be present >= min level
    for (const rs of selected) {
      const lvl = pskills.get(rs.skill_id) ?? 0;
      if (lvl < rs.min_level) return { qualifies: false, score: 0 };
    }
  } else {
    // OR: at least one matches
    if (selected.length > 0) {
      const any = selected.some((rs) => (pskills.get(rs.skill_id) ?? 0) >= rs.min_level);
      if (!any) return { qualifies: false, score: 0 };
    }
  }

  // Additional filters
  if (filters.category) {
    const hasCategory = profile.skills.some((s) => s.skill_id.includes("-"));
    // Note: category check is approximated in demo by skill_id grouping in catalog page
  }

  if (filters.location) {
    const q = filters.location.toLowerCase();
    const hit =
      profile.location_city?.toLowerCase().includes(q) ||
      profile.location_country?.toLowerCase().includes(q);
    if (!hit) return { qualifies: false, score: 0 };
  }

  if (filters.business_unit) {
    const q = filters.business_unit.toLowerCase();
    if (!(profile.business_unit || "").toLowerCase().includes(q)) {
      return { qualifies: false, score: 0 };
    }
  }

  if (typeof filters.min_availability === "number") {
    const avail = profile.availability_percent ?? 0;
    if (avail < filters.min_availability) return { qualifies: false, score: 0 };
  }

  if (filters.earliest_start_by) {
    const p = profile.availability_earliest_start
      ? new Date(profile.availability_earliest_start)
      : undefined;
    const by = new Date(filters.earliest_start_by);
    if (!p || p > by) return { qualifies: false, score: 0 };
  }

  if (filters.updated_within_days) {
    const days = filters.updated_within_days;
    const lu = profile.last_updated ? new Date(profile.last_updated) : undefined;
    if (!lu) return { qualifies: false, score: 0 };
    const ms = Date.now() - lu.getTime();
    const within = ms <= days * 24 * 3600 * 1000;
    if (!within) return { qualifies: false, score: 0 };
  }

  if (typeof filters.open_to_mission === "boolean") {
    if ((profile.open_to_mission ?? false) !== filters.open_to_mission) {
      return { qualifies: false, score: 0 };
    }
  }

  // Score calculation
  let score = 0;
  const considered = selected.length > 0 ? selected : profile.skills.map((s) => ({ skill_id: s.skill_id, min_level: 1 }));
  for (const rs of considered) {
    const lvl = pskills.get(rs.skill_id) ?? 0;
    if (lvl >= rs.min_level) {
      score += (lvl / 5) * 20;
    }
  }

  // Freshness bonus
  const lu = profile.last_updated ? new Date(profile.last_updated) : undefined;
  if (lu && Date.now() - lu.getTime() <= 90 * 24 * 3600 * 1000) {
    score += 10;
  }

  // Availability bonus
  const avail = profile.availability_percent ?? 0;
  score += avail / 10;

  score = Math.min(100, Math.round(score));

  return { qualifies: true, score };
}
