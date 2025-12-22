import { apiClient } from "./client"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types"

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) => apiClient.post<AuthResponse>("/auth/register", data),

  refreshToken: (refreshToken: string) => apiClient.post<AuthResponse>("/auth/refresh-token", { refreshToken }),

  getCurrentUser: () => apiClient.get<User>("/auth/me"),

  logout: () => apiClient.post("/auth/logout"),

  forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, newPassword: string) => apiClient.post("/auth/reset-password", { token, newPassword }),

  verifyEmail: (token: string) => apiClient.post("/auth/verify-email", { token }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post("/auth/change-password", { currentPassword, newPassword }),
}
