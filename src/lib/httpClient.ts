import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://localhost:5000/api/v1`,
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
          console.log(
            `[Request] ${config.method?.toUpperCase()}-> ${config.url}}`,
          );
        } else {
          console.log("Token is not found in the localStorage");
        }
      }
    } catch (error) {
      console.warn("Error Attaching token", error);
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await http.get("/auth/refresh-token");
        const newAccessToken = data.data.accessToken;

        localStorage.setItem("token", newAccessToken);
        http.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return http(originalRequest); 
      } catch (refreshError) {
        console.warn("Refresh token failed:", refreshError);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default http;
