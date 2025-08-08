import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Auth = () => {
  const { session, loading, signInWithPassword, signUpWithPassword, sendMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/search";

  useEffect(() => {
    document.title = "Login | Skills Directory";
  }, []);

  useEffect(() => {
    if (!loading && session) {
      navigate(from, { replace: true });
    }
  }, [loading, session, from, navigate]);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithPassword(email, password);
    setSubmitting(false);
    if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    toast({ title: "Signed in", description: "Welcome back!" });
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      return toast({ title: "Passwords do not match", variant: "destructive" });
    }
    setSubmitting(true);
    const { error } = await signUpWithPassword(email, password);
    setSubmitting(false);
    if (error) return toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    toast({ title: "Check your email", description: "Confirm your email to complete sign up." });
  };

  const onMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await sendMagicLink(email);
    setSubmitting(false);
    if (error) return toast({ title: "Magic link failed", description: error.message, variant: "destructive" });
    toast({ title: "Magic link sent", description: "Check your inbox to sign in." });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <article className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Sign in to Skills Directory</h1>
        <p className="text-sm text-muted-foreground mb-6">Use your email and password, or request a magic link.</p>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-4">
            <form onSubmit={onSignIn} className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>Sign In</Button>
              <Button type="button" variant="outline" className="w-full" onClick={onMagic} disabled={submitting || !email}>
                Send Magic Link
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={onSignUp} className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>Create Account</Button>
            </form>
            <p className="text-xs text-muted-foreground">After sign up, check your inbox and click the confirmation link.</p>
          </TabsContent>
        </Tabs>
      </article>
    </main>
  );
};

export default Auth;
