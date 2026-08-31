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
                // First, try the existing access token
                await api.get("/auth/me");

                setAuthStatus("authenticated");
            } catch (error: any) {

                // Access token may be expired
                if (error.response?.status === 401) {
                    try {
                        // Use refresh token to get a new access token
                        await api.post("/auth/refresh");

                        // Verify the new access token
                        await api.get("/auth/me");

                        setAuthStatus("authenticated");
                        return;
                    } catch {
                        setAuthStatus("unauthenticated");
                        return;
                    }
                }

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