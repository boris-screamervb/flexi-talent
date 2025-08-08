import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" aria-hidden />
            <span className="font-semibold">Skills Directory</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/search"><Button variant="secondary">Search</Button></Link>
            <Link to="/profile"><Button variant="outline">My Profile</Button></Link>
            <Link to="/login"><Button>Login</Button></Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <section className="relative overflow-hidden rounded-2xl border bg-card p-10 shadow-sm">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-primary)" as any }} />
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Skills Directory — Find Internal Talent Fast
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search, filter, and match colleagues by skills, proficiency, and availability.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/search"><Button size="lg">Start Searching</Button></Link>
              <Link to="/profile"><Button size="lg" variant="secondary">Create My Profile</Button></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto py-8 text-sm text-muted-foreground">
        <p>Made with a clean design system. Optimized for mobile and desktop.</p>
      </footer>
    </div>
  );
};

export default Index;
