import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD
    ? "https://dineslot-production-5dfd.up.railway.app/api"
    : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
  withCredentials: true, // sends the HttpOnly refresh cookie on /auth/* calls
});

// In-memory only — set by AuthContext after login/signup/refresh.
// Kept outside React state so the interceptor (a plain module-level
// function) can read/write it without needing a hook.
let currentAccessToken: string | null = null;
let onTokenRefreshed: ((token: string | null) => void) | null = null;

export const setApiAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

// Lets AuthContext register itself so a background refresh here can
// also update React state, keeping both in sync.
export const registerTokenRefreshHandler = (fn: (token: string | null) => void) => {
  onTokenRefreshed = fn;
};

export const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const doRefresh = async (): Promise<string | null> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const res = await axios.post(
      `${baseURL}/auth/refresh`,
      {},
      { withCredentials: true, headers: csrfToken ? { "x-csrf-token": csrfToken } : {} }
    );
    const newToken = res.data.accessToken as string;
    currentAccessToken = newToken;
    onTokenRefreshed?.(newToken);
    return newToken;
  } catch {
    currentAccessToken = null;
    onTokenRefreshed?.(null);
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // Coalesce concurrent 401s into one refresh call, not one per request.
      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export default api;