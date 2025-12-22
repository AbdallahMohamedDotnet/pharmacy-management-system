import { apiClient } from "./client"
import type { User, PaginatedResponse } from "@/types"

export const usersApi = {
  getAll: (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }) =>
    apiClient.get<PaginatedResponse<User>>("/users", params as Record<string, string | number | boolean | undefined>),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  update: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),

  activate: (id: string) => apiClient.patch(`/users/${id}/activate`),

  deactivate: (id: string) => apiClient.patch(`/users/${id}/deactivate`),

  assignRole: (id: string, role: string) => apiClient.post(`/users/${id}/roles`, { role }),

  removeRole: (id: string, role: string) => apiClient.delete(`/users/${id}/roles/${role}`),

  getProfile: () => apiClient.get<User>("/users/profile"),

  updateProfile: (data: Partial<User>) => apiClient.put<User>("/users/profile", data),
}
