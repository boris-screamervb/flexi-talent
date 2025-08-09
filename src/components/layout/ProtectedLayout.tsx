import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
