import { useState } from "react";
import { skillsCatalog } from "@/components/skills/sample-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Admin = () => {
  const [rows, setRows] = useState(skillsCatalog.slice(0, 40));
  const [hrEmail, setHrEmail] = useState("");
  const [hrList, setHrList] = useState<string[]>(["hr@example.com"]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<"Data/AI"|"Cyber"|"Cloud/Infra"|"Web"|"Embedded"|"PM/BA"|"QA"|"Other">("Web");

  const toggleActive = (id: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)));
  };

  const rename = (id: string, name: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const addSkillRow = () => {
    const name = newSkillName.trim();
    if (!name) return;
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      category: newSkillCategory,
      is_active: true,
    } as any;
    setRows((r) => [newItem, ...r]);
    setNewSkillName("");
  };

  const addHr = () => {
    if (!hrEmail) return;
    setHrList((l) => Array.from(new Set([...l, hrEmail])));
    setHrEmail("");
  };
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-4">Admin</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Skill Catalog</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col md:flex-row gap-2 items-stretch">
                <Input placeholder="New skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
                <div className="min-w-[180px]">
                  <Label>Category</Label>
                  <Select value={newSkillCategory} onValueChange={(v) => setNewSkillCategory(v as any)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
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
                <Button onClick={addSkillRow}>Add Skill</Button>
              </div>
              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
                {rows.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <Switch checked={s.is_active} onCheckedChange={() => toggleActive(s.id)} />
                    <Input defaultValue={s.name} onBlur={(e) => rename(s.id, e.target.value)} />
                    <span className="text-xs text-muted-foreground">{s.category}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => { localStorage.setItem("admin_skills", JSON.stringify(rows)); toast({ title: "Skills saved", description: `${rows.length} skills in catalog (local demo).` }); }}>Save</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>HR Membership</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="email@company.com" value={hrEmail} onChange={(e) => setHrEmail(e.target.value)} />
                <Button onClick={addHr}>Add</Button>
              </div>
              <div className="space-y-2">
                {hrList.map((e) => (
                  <div key={e} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">{e}</span>
                    <Button variant="outline" size="sm" onClick={() => setHrList((l) => l.filter((x) => x !== e))}>Remove</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Admin;
