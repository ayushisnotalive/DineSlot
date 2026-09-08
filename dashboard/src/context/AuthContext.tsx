import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import axios from "axios";

import api, {
  getCsrfTokenFromCookie,
  setApiAccessToken,
  registerTokenRefreshHandler,
} from "../api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;
  setAuth: (token: string | null, user?: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const setAuth = (token: string | null, nextUser: User | null = null) => {
    setAccessTokenState(token);
    setUser(nextUser);
  };

  // Keep api.ts's module-level token in sync with React state, so the
  // request interceptor (which runs outside React) always has the
  // current token available.
  useEffect(() => {
    setApiAccessToken(accessToken);
  }, [accessToken]);

  // If api.ts silently refreshes the token in the background (e.g. a
  // 401 on some unrelated request triggered a refresh), it calls this
  // to push the new token back into React state.
  useEffect(() => {
    registerTokenRefreshHandler((token) => {
      setAccessTokenState(token);
      if (!token) setUser(null);
    });
  }, []);

  // On first load there is nothing in memory (no localStorage, by design).
  // Try a silent refresh using the HttpOnly refresh cookie, if one exists,
  // so a page reload doesn't look like a logout.
  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const csrfToken = getCsrfTokenFromCookie();
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: csrfToken ? { "x-csrf-token": csrfToken } : {},
          }
        );

        const newToken: string = res.data.accessToken;
        setAccessTokenState(newToken);

        const me = await axios.get(`${api.defaults.baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setUser(me.data.user ?? me.data);
      } catch {
        // No valid refresh cookie, or refresh failed. Just logged out —
        // not an error state.
        setAccessTokenState(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    tryRestoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, isInitializing, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};