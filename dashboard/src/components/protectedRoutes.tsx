import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.PROD
  ? "https://dineslot-production-5dfd.up.railway.app"
  : "http://localhost:5000";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Browser automatically sends the httpOnly accessToken cookie
        const response = await axios.get(
          `${API_URL}/api/auth/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setAuthStatus("authenticated");
        } else {
          setAuthStatus("unauthenticated");
        }

      } catch (error) {
        setAuthStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

