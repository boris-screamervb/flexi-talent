import { useState } from "react";
import { skillsCatalog } from "@/components/skills/sample-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const [rows, setRows] = useState(skillsCatalog.slice(0, 40));
  const [hrEmail, setHrEmail] = useState("");
  const [hrList, setHrList] = useState<string[]>(["hr@example.com"]);

  const toggleActive = (id: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)));
  };

  const rename = (id: string, name: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, name } : x)));
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
              {rows.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <Switch checked={s.is_active} onCheckedChange={() => toggleActive(s.id)} />
                  <Input defaultValue={s.name} onBlur={(e) => rename(s.id, e.target.value)} />
                  <span className="text-xs text-muted-foreground">{s.category}</span>
                </div>
              ))}
              <Button onClick={() => toast({ title: "Saved (demo)", description: "Connect Supabase to persist changes." })}>Save</Button>
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
