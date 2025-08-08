import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Connect Supabase to enable Magic Links",
      description:
        "Click the green Supabase button (top-right) to connect. Then we’ll send magic links using Supabase Auth.",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <article className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Login with Magic Link</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your work email to receive a sign-in link.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Send Magic Link</Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Note: Azure AD SSO is out of scope for Phase-0. We’ll structure code to swap auth later.
        </p>
      </article>
    </main>
  );
};

export default Login;
