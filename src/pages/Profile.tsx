import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useEffect, useMemo, useState } from "react";
import { ProfileSkill } from "@/components/skills/sample-data";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
// Removed auth import since auth is disabled

const Profile = () => {
  // Demo mode - use first profile or create new one
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<ProfileSkill[]>([]);
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState(50);
  const [earliestStart, setEarliestStart] = useState<string>("");
  const [openToMission, setOpenToMission] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: skillsData } = await supabase.from("skills").select("id,name").eq("is_active", true).order("name");
      setSkills(skillsData || []);
      
      // Demo mode: load first available profile or create template
      const { data: profiles } = await supabase.from("profiles").select("id,full_name,email,job_title,business_unit,location_city,location_country,languages,availability_percent,availability_earliest_start,open_to_mission,notes").limit(1);
      const p = profiles?.[0];
      
      if (p) {
        setProfileId(p.id);
        setFullName(p.full_name || "");
        setEmail(p.email || "");
        setJobTitle(p.job_title || "");
        setBusinessUnit(p.business_unit || "");
        setCity(p.location_city || "");
        setCountry(p.location_country || "");
        setLanguages((p.languages || []).join(", "));
        setAvailability(p.availability_percent ?? 50);
        setEarliestStart(p.availability_earliest_start || "");
        setOpenToMission(!!p.open_to_mission);
        setNotes(p.notes || "");
        const { data: ps } = await supabase.from("profile_skills").select("skill_id,proficiency_level,years_experience").eq("profile_id", p.id);
        setSelectedSkills((ps || []).map((x: any) => ({ skill_id: x.skill_id, proficiency_level: x.proficiency_level, years_experience: x.years_experience })));
      }
    };
    load();
  }, []);

  const filteredSkills = useMemo(
    () => skills.filter((s) => s.name.toLowerCase().includes((skillQuery||"").toLowerCase())),
    [skills, skillQuery]
  );
  const addSkill = (skill_id: string) => {
    setSelectedSkills((prev) => (prev.some((ps) => ps.skill_id === skill_id)
      ? prev
      : [...prev, { skill_id, proficiency_level: 3, years_experience: 1 }]));
  };
  const updateSkill = (skill_id: string, patch: Partial<ProfileSkill>) => {
    setSelectedSkills((prev) => prev.map((ps) => ps.skill_id === skill_id ? { ...ps, ...patch } : ps));
  };
  const removeSkill = (skill_id: string) => {
    setSelectedSkills((prev) => prev.filter((ps) => ps.skill_id !== skill_id));
  };
  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      user_id: null, // Demo mode - no user association
      full_name: fullName,
      email: email,
      job_title: jobTitle,
      business_unit: businessUnit,
      location_city: city,
      location_country: country,
      languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
      availability_percent: availability,
      availability_earliest_start: earliestStart || null,
      open_to_mission: openToMission,
      notes,
    };
    const { data: up, error } = await supabase
      .from("profiles")
      .upsert({ id: profileId || undefined, ...payload })
      .select("id")
      .maybeSingle();
    if (error) return toast({ title: "Error", description: error.message });
    const pid = up?.id || profileId;
    if (!pid) return toast({ title: "Error", description: "Could not save profile id" });

    // Replace skills for simplicity
    await supabase.from("profile_skills").delete().eq("profile_id", pid);
    if (selectedSkills.length > 0) {
      const insertRows = selectedSkills.map((s) => ({
        profile_id: pid,
        skill_id: s.skill_id,
        proficiency_level: s.proficiency_level,
        years_experience: s.years_experience ?? 0,
      }));
      const { error: err2 } = await supabase.from("profile_skills").insert(insertRows);
      if (err2) return toast({ title: "Error", description: err2.message });
    }
    setProfileId(pid);
    toast({ title: "Profile saved", description: `Saved ${selectedSkills.length} skills.` });
  };
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-4">My Profile</h1>
        <form onSubmit={onSave} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Personal</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input placeholder="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input placeholder="e.g., Senior Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
              <div>
                <Label>Business Unit</Label>
                <Input placeholder="e.g., Platform" value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Languages</Label>
                <Input placeholder="Comma separated, e.g., EN, FR" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Availability</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Availability %</Label>
                <Slider min={0} max={100} step={10} value={[availability]} onValueChange={(v) => setAvailability(v[0])} />
              </div>
              <div>
                <Label>Earliest Start</Label>
                <Input type="date" value={earliestStart || ""} onChange={(e) => setEarliestStart(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="otm">Open to mission</Label>
                <Switch id="otm" checked={openToMission} onCheckedChange={setOpenToMission} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Short context…" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Search skills</Label>
                <Input className="mt-2" placeholder="Search skills…" value={skillQuery} onChange={(e) => setSkillQuery(e.target.value)} />
                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border bg-popover text-popover-foreground">
                  {filteredSkills.slice(0, 20).map((s) => (
                    <button
                      key={s.id}
                      className="w-full text-left px-3 py-2 hover:bg-accent transition-colors"
                      onClick={() => addSkill(s.id)}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Selected skills</Label>
                <div className="mt-2 space-y-3">
                  {selectedSkills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No skills selected yet.</p>
                  )}
                  {selectedSkills.map((ps) => {
                    const sk = skills.find((x) => x.id === ps.skill_id);
                    return (
                      <div key={ps.skill_id} className="flex flex-col md:flex-row md:items-center gap-3 rounded-md border p-3">
                        <Badge variant="secondary" className="w-fit">{sk?.name}</Badge>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Level: {ps.proficiency_level}</Label>
                            <Slider min={1} max={5} step={1} value={[ps.proficiency_level]} onValueChange={(v) => updateSkill(ps.skill_id, { proficiency_level: v[0] })} />
                          </div>
                          <div>
                            <Label>Years</Label>
                            <Input type="number" min={0} value={ps.years_experience ?? 0} onChange={(e) => updateSkill(ps.skill_id, { years_experience: Number(e.target.value || 0) })} />
                          </div>
                          <div className="flex items-end">
                            <Button type="button" variant="outline" onClick={() => removeSkill(ps.skill_id)}>Remove</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Tip: Only active skills from Admin are shown.</p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex justify-end">
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Profile;
