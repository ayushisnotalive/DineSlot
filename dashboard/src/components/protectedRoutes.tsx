// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g. ["owner"], ["admin"] — omit to just require login
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { accessToken, user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <div>Loading...</div>; // replace with a real spinner/skeleton later
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role ?? "")) {
    return <Navigate to="/browse" replace />;
  }

  return <>{children}</>;
};