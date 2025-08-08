import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Saved (demo)", description: "Connect Supabase to persist your profile." });
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
            <CardContent>
              <p className="text-sm text-muted-foreground">Add skills in the Admin page (demo) or connect Supabase to manage the catalog.</p>
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
