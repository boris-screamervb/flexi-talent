import { useMemo, useState, useEffect, useRef } from "react";
import { computeMatchScore, Filters, RequestedSkill } from "@/components/skills/MatchUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

function exportCsv(rows: any[], filename: string) {
  const replacer = (key: string, value: any) => (value === null ? "" : value);
  const header = Object.keys(rows[0] || {});
  const csv = [
    header.join(","),
    ...rows.map((row) => header.map((f) => JSON.stringify(row[f], replacer)).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Search = () => {
  const [filters, setFilters] = useState<Filters>({ skills: [], sort_by: "match" });
  const [skillQuery, setSkillQuery] = useState("");
  const [minLevel, setMinLevel] = useState(3);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (skillsRef.current && !skillsRef.current.contains(e.target as Node)) setSkillsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: skillsData } = await supabase.from("skills").select("id,name").eq("is_active", true).order("name");
      setSkills(skillsData || []);
      const { data: profs } = await supabase.from("profiles").select("id,full_name,job_title,business_unit,city,country,availability_pct,earliest_start,open_to_mission,updated_at,profile_skills(skill_id,proficiency)");
      const mapped = (profs || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        job_title: p.job_title,
        business_unit: p.business_unit,
        location_city: p.city,
        location_country: p.country,
        availability_percent: p.availability_pct,
        availability_earliest_start: p.earliest_start,
        open_to_mission: p.open_to_mission,
        last_updated: p.updated_at,
        skills: (p.profile_skills || []).map((s: any) => ({ skill_id: s.skill_id, proficiency_level: s.proficiency, years_experience: 0 })),
      }));
      setProfiles(mapped);
    };
    load();
  }, []);

  const filteredSkills = useMemo(
    () => skills.filter((s) => s.name.toLowerCase().includes((skillQuery||"").toLowerCase())),
    [skills, skillQuery]
  );

  const results = useMemo(() => {
    const rows = profiles
      .map((p) => ({ profile: p, match: computeMatchScore(p as any, filters) }))
      .filter((r) => r.match.qualifies)
      .sort((a, b) => {
        switch (filters.sort_by) {
          case "availability":
            return (b.profile.availability_percent || 0) - (a.profile.availability_percent || 0);
          case "updated":
            return new Date(b.profile.last_updated||0).getTime() - new Date(a.profile.last_updated||0).getTime();
          default:
            return b.match.score - a.match.score;
        }
      });
    return rows;
  }, [filters, profiles]);

  const addSkill = (skill_id: string) => {
    const exists = filters.skills.some((s) => s.skill_id === skill_id);
    if (exists) return;
    const next: RequestedSkill = { skill_id, min_level: minLevel };
    setFilters((f) => ({ ...f, skills: [...f.skills, next] }));
  };

  const removeSkill = (skill_id: string) => {
    setFilters((f) => ({ ...f, skills: f.skills.filter((s) => s.skill_id !== skill_id) }));
  };

  const onExport = () => {
    const rows = results.map((r) => ({
      name: r.profile.full_name,
      title: r.profile.job_title || "",
      bu: r.profile.business_unit || "",
      location: `${r.profile.location_city||""}, ${r.profile.location_country||""}`,
      availability_percent: r.profile.availability_percent ?? 0,
      last_updated: r.profile.last_updated || "",
      score: r.match.score,
    }));
    exportCsv(rows, "skills-directory-results.csv");
    toast({ title: "Export started", description: `Exported ${rows.length} rows.` });
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-4">Search Talent Directory</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div ref={skillsRef} className="relative">
                <Label>Skills</Label>
                <Input
                  placeholder="Search skills…"
                  value={skillQuery}
                  onFocus={() => setSkillsOpen(true)}
                  onChange={(e) => {
                    setSkillQuery(e.target.value);
                    setSkillsOpen(true);
                  }}
                  className="mt-2"
                />
                {skillsOpen && skillQuery && (
                  <div className="absolute mt-2 z-50 max-h-60 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow">
                    {filteredSkills.slice(0, 20).map((s) => (
                      <button
                        key={s.id}
                        className="w-full text-left px-3 py-2 hover:bg-accent transition-colors"
                        onClick={() => {
                          addSkill(s.id);
                          setSkillsOpen(false);
                          setSkillQuery("");
                        }}
                      >
                        {s.name}
                      </button>
                    ))}
                    {filteredSkills.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <Label>Min Level: {minLevel}</Label>
                  <Slider value={[minLevel]} min={1} max={5} step={1} onValueChange={(v) => setMinLevel(v[0])} />
                </div>
                <div className="mt-3">
                  <Label>Selected</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filters.skills.map((s) => {
                      const sk = skills.find((x) => x.id === s.skill_id);
                      return (
                        <Badge key={s.skill_id} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(s.skill_id)}>
                          {sk?.name} · ≥{s.min_level}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={filters.category ?? "any"} onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "any" ? undefined : v }))}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Data/AI">Data/AI</SelectItem>
                    <SelectItem value="Cyber">Cyber</SelectItem>
                    <SelectItem value="Cloud/Infra">Cloud/Infra</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Embedded">Embedded</SelectItem>
                    <SelectItem value="PM/BA">PM/BA</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Location</Label>
                <Input className="mt-2" placeholder="City or Country" onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))} />
              </div>

              <div>
                <Label>Business Unit</Label>
                <Input className="mt-2" placeholder="e.g., Platform" onChange={(e) => setFilters((f) => ({ ...f, business_unit: e.target.value }))} />
              </div>

              <div>
                <Label>Availability ≥ {filters.min_availability ?? 0}%</Label>
                <Slider min={0} max={100} step={10} value={[filters.min_availability ?? 0]} onValueChange={(v) => setFilters((f) => ({ ...f, min_availability: v[0] }))} />
              </div>

              <div>
                <Label>Earliest Start ≤</Label>
                <Input type="date" className="mt-2" onChange={(e) => setFilters((f) => ({ ...f, earliest_start_by: e.target.value }))} />
              </div>

              <div>
                <Label>Updated within</Label>
                <Select value={filters.updated_within_days !== undefined ? String(filters.updated_within_days) : "any"} onValueChange={(v) => setFilters((f) => ({ ...f, updated_within_days: v === "any" ? undefined : Number(v) }))}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="otm">Open to mission</Label>
                <Switch id="otm" checked={!!filters.open_to_mission} onCheckedChange={(v) => setFilters((f) => ({ ...f, open_to_mission: v }))} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="relaxed">Relaxed (OR)</Label>
                <Switch id="relaxed" checked={!!filters.relaxed} onCheckedChange={(v) => setFilters((f) => ({ ...f, relaxed: v }))} />
              </div>

              <div>
                <Label>Sort by</Label>
                <Select value={filters.sort_by} onValueChange={(v) => setFilters((f) => ({ ...f, sort_by: v as Filters["sort_by"] }))}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{results.length} profiles</p>
              <Button onClick={onExport}>Export CSV</Button>
            </div>
            {results.map(({ profile, match }) => (
              <Card key={profile.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{profile.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.job_title} · {profile.business_unit}</p>
                    <p className="text-xs text-muted-foreground">{profile.location_city}, {profile.location_country}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{profile.availability_percent ?? 0}% available</Badge>
                    <Badge variant="secondary">Updated {profile.last_updated ? new Date(profile.last_updated).toLocaleDateString() : "—"}</Badge>
                    <Badge>Score {match.score}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills
                      .slice()
                      .sort((a,b)=>b.proficiency_level-a.proficiency_level)
                      .slice(0,6)
                      .map((s) => {
                        const sk = skills.find((x) => x.id === s.skill_id);
                        return (
                          <Badge key={s.skill_id} variant="outline">
                            {sk?.name} · {"".padEnd(s.proficiency_level, "•")}
                          </Badge>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Search;
