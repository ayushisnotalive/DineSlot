// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.PROD
  ? "https://dineslot-production-5dfd.up.railway.app"
  : "http://localhost:5000"; // Adjust local backend port if needed

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    if (!accessToken) {
      setAuthStatus("unauthenticated");
      return;
    }
    axios
      .get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => setAuthStatus("authenticated"))
      .catch(() => setAuthStatus("unauthenticated"));
  }, [accessToken]);


  if (authStatus === "loading") {
    return <div>Loading...</div>; // replace with a real spinner/skeleton later
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};