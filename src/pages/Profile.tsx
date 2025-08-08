import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import { skillsCatalog, ProfileSkill } from "@/components/skills/sample-data";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<ProfileSkill[]>([]);
  const skills = useMemo(() => {
    try {
      const raw = localStorage.getItem("admin_skills");
      const list = raw ? JSON.parse(raw) : skillsCatalog;
      return (list as any[]).filter((s: any) => s.is_active);
    } catch {
      return skillsCatalog.filter((s) => s.is_active);
    }
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
  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Saved (demo)", description: `Profile saved with ${selectedSkills.length} skills. Connect Supabase to persist your profile.` });
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
                <Input placeholder="Full name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="name@company.com" required readOnly />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input placeholder="e.g., Senior Engineer" />
              </div>
              <div>
                <Label>Business Unit</Label>
                <Input placeholder="e.g., Platform" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input placeholder="City" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input placeholder="Country" />
                </div>
              </div>
              <div>
                <Label>Languages</Label>
                <Input placeholder="Comma separated, e.g., EN, FR" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Availability</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Availability %</Label>
                <Slider min={0} max={100} step={10} defaultValue={[50]} />
              </div>
              <div>
                <Label>Earliest Start</Label>
                <Input type="date" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="otm">Open to mission</Label>
                <Switch id="otm" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Short context…" />
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
