import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Error attaching token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ── Refresh Token Queue ─────────────────────────────────
// Ensures only ONE refresh happens at a time.
// All other 401'd requests wait for the single refresh to finish,
// then retry with the new token.

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh-token",
  "/auth/reset-password",
  "/auth/change-password",
];

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      requestUrl.includes(route),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(http(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await http.post("/auth/refresh-token");
        const newAccessToken = data.data.accessToken;

        localStorage.setItem("token", newAccessToken);
        http.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Resolve all queued requests with the new token
        processQueue(null, newAccessToken);

        return http(originalRequest);
      } catch (refreshError) {
        // Refresh failed — reject all queued requests and redirect
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default http;
