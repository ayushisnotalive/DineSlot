import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

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
                await api.post("/auth/refresh");
                await api.get("/auth/me");

                setAuthStatus("authenticated");
            } catch {
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