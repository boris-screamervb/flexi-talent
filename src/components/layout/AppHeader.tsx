import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { useIsHr } from "@/hooks/useIsHr";

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm ${active ? "bg-accent" : "hover:bg-accent/60"}`}>
      {label}
    </Link>
  );
};

export const AppHeader = () => {
  const { signOut } = useAuth();
  const { data: isHr } = useIsHr();

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <NavLink to="/search" label="Search" />
          <NavLink to="/profile" label="My Profile" />
          {isHr ? <NavLink to="/admin" label="Admin" /> : null}
        </div>
        <div>
          <Button variant="outline" onClick={signOut}>Logout</Button>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
