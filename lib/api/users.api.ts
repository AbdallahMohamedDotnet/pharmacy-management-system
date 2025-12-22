import { apiClient } from "./client"
import type { User, PaginatedResponse } from "@/types"

interface UserQueryParams {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
  role?: string
  isActive?: boolean
}

interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role?: string
}

interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
}

export const usersApi = {
  getAll: (params?: UserQueryParams) =>
    apiClient.get<PaginatedResponse<User>>("/users", params as Record<string, string | number | boolean | undefined>),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (data: CreateUserRequest) => 
    apiClient.post<User>("/users", data),

  update: (id: string, data: UpdateUserRequest) => apiClient.put<User>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),

  activate: (id: string) => apiClient.patch(`/users/${id}/activate`),

  deactivate: (id: string) => apiClient.patch(`/users/${id}/deactivate`),

  assignRole: (id: string, role: string) => apiClient.post(`/users/${id}/roles`, { role }),

  removeRole: (id: string, role: string) => apiClient.delete(`/users/${id}/roles/${role}`),

  getProfile: () => apiClient.get<User>("/users/profile"),

  updateProfile: (data: Partial<User>) => apiClient.put<User>("/users/profile", data),
}
