import { apiFetch } from "@/lib/api/client";
import { AuthUser } from "@/lib/stores/authStore";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function login(input: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "maker" | "manager" | "admin";
}

export function register(input: RegisterInput) {
  return apiFetch<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
