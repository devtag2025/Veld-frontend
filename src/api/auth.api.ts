import http from "@/lib/httpClient";
import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  SignupPayload,
} from "@/types/auth";

export const login = async (payload: LoginPayload) => {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const signup = async (payload: SignupPayload) => {
  const { data } = await http.post<AuthResponse>("/auth/signup", payload);
  return data;
};

export const logout = async () => {
  const { data } = await http.post("/auth/logout");
  return data;
};

export const refreshToken = async () => {
  const { data } = await http.post("/auth/refresh-token");
  return data;
};

export const resetPassword = async (email: string) => {
  const { data } = await http.post("/auth/reset-password", { email });
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await http.post("/auth/change-password", payload);
  return data;
};
