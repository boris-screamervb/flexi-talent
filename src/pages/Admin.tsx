import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIsHr } from "@/hooks/useIsHr";

const CATEGORIES = ["Data/AI","Cyber","Cloud/Infra","Web","Embedded","PM/BA","QA","Other"] as const;

type Skill = { id: string; name: string; category: typeof CATEGORIES[number]; is_active: boolean };

const Admin = () => {
  const { data: isHr } = useIsHr();
  const [rows, setRows] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [hrEmail, setHrEmail] = useState("");
  const [hrList, setHrList] = useState<string[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<typeof CATEGORIES[number]>("Web");

  useEffect(() => {
    const load = async () => {
      const { data: skills } = await supabase.from("skills").select("id,name,category,is_active").order("name");
      setRows((skills as any) || []);
      const { data: hr } = await supabase.from("hr_emails").select("email").order("email");
      setHrList((hr || []).map((x: any) => x.email));
      setLoading(false);
    };
    load();
  }, []);

  const toggleActive = async (id: string) => {
    if (!isHr) return;
    const current = rows.find((r) => r.id === id);
    if (!current) return;
    const next = !current.is_active;
    const { error } = await supabase.from("skills").update({ is_active: next }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, is_active: next } : x)));
  };

  const rename = async (id: string, name: string) => {
    if (!isHr) return;
    const { error } = await supabase.from("skills").update({ name }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const addSkillRow = async () => {
    if (!isHr) return;
    const name = newSkillName.trim();
    if (!name) return;
    const { data, error } = await supabase.from("skills").insert({ name, category: newSkillCategory, is_active: true }).select("id,name,category,is_active").single();
    if (error) return toast({ title: "Error", description: error.message });
    setRows((r) => data ? [data as any, ...r] : r);
    setNewSkillName("");
  };

  const addHr = async () => {
    if (!isHr) return;
    const email = hrEmail.trim().toLowerCase();
    if (!email) return;
    const { error } = await supabase.from("hr_emails").upsert({ email });
    if (error) return toast({ title: "Error", description: error.message });
    setHrList((l) => Array.from(new Set([...l, email])));
    setHrEmail("");
  };

  const removeHr = async (email: string) => {
    if (!isHr) return;
    const { error } = await supabase.from("hr_emails").delete().eq("email", email);
    if (error) return toast({ title: "Error", description: error.message });
    setHrList((l) => l.filter((x) => x !== email));
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-4">Admin</h1>
        {!isHr && (
          <p className="text-sm text-muted-foreground mb-4">You have read-only access. Ask an HR to add your email in the HR section.</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Skill Catalog</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col md:flex-row gap-2 items-stretch">
                <Input placeholder="New skill name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} disabled={!isHr} />
                <div className="min-w-[180px]">
                  <Label>Category</Label>
                  <Select value={newSkillCategory} onValueChange={(v) => setNewSkillCategory(v as any)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addSkillRow} disabled={!isHr}>Add Skill</Button>
              </div>
              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : rows.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <Switch checked={s.is_active} onCheckedChange={() => toggleActive(s.id)} disabled={!isHr} />
                    <Input defaultValue={s.name} onBlur={(e) => rename(s.id, e.target.value)} disabled={!isHr} />
                    <span className="text-xs text-muted-foreground">{s.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>HR Membership</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="email@company.com" value={hrEmail} onChange={(e) => setHrEmail(e.target.value)} disabled={!isHr} />
                <Button onClick={addHr} disabled={!isHr}>Add</Button>
              </div>
              <div className="space-y-2">
                {hrList.map((e) => (
                  <div key={e} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">{e}</span>
                    <Button variant="outline" size="sm" onClick={() => removeHr(e)} disabled={!isHr}>Remove</Button>
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
