import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return null; // or a spinner
  if (!session) return <Navigate to="/auth" replace state={{ from: location }} />;
  return children ? <>{children}</> : <Outlet />;
};

export const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (session) return <Navigate to={(location.state?.from?.pathname || "/search") as string} replace />;
  return children ? <>{children}</> : <Outlet />;
};
