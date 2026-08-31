// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then(() => setAuthStatus("authenticated"))
      .catch(() => setAuthStatus("unauthenticated"));
  }, []);

  if (authStatus === "loading") {
    return <div>Loading...</div>; // replace with a real spinner/skeleton later
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};