import { create } from "zustand";
import * as authApi from "@/api/auth.api";
import type { User, LoginPayload, SignupPayload } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(payload);
      const { user, accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signup(payload);
      const { user, accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the API call fails, clear local state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
