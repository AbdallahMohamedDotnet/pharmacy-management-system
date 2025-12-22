import { apiClient } from "./client"
import type { Category, PaginatedResponse } from "@/types"

export const categoriesApi = {
  getAll: (params?: { pageNumber?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<Category>>(
      "/categories",
      params as Record<string, string | number | boolean | undefined>,
    ),

  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: Partial<Category>) => apiClient.post<Category>("/categories", data),

  update: (id: string, data: Partial<Category>) => apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: string) => apiClient.delete(`/categories/${id}`),

  getWithMedicines: (id: string) => apiClient.get<Category & { medicines: unknown[] }>(`/categories/${id}/medicines`),
}
