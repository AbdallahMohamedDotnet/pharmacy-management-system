import { apiClient } from "./client"
import type { Medicine, MedicineSearchParams, PaginatedResponse } from "@/types"

export const medicinesApi = {
  getAll: (params?: MedicineSearchParams) =>
    apiClient.get<PaginatedResponse<Medicine>>(
      "/medicines",
      params as Record<string, string | number | boolean | undefined>,
    ),

  getById: (id: string) => apiClient.get<Medicine>(`/medicines/${id}`),

  create: (data: Partial<Medicine>) => apiClient.post<Medicine>("/medicines", data),

  update: (id: string, data: Partial<Medicine>) => apiClient.put<Medicine>(`/medicines/${id}`, data),

  delete: (id: string) => apiClient.delete(`/medicines/${id}`),

  search: (searchTerm: string, params?: MedicineSearchParams) =>
    apiClient.get<PaginatedResponse<Medicine>>("/medicines/search", {
      searchTerm,
      ...params,
    } as Record<string, string | number | boolean | undefined>),

  getByCategory: (categoryId: string, params?: MedicineSearchParams) =>
    apiClient.get<PaginatedResponse<Medicine>>("/medicines", {
      categoryId,
      ...params,
    } as Record<string, string | number | boolean | undefined>),

  getLowStock: (threshold = 10) => apiClient.get<Medicine[]>("/medicines/low-stock", { threshold }),

  getExpiringSoon: (days = 30) => apiClient.get<Medicine[]>("/medicines/expiring-soon", { days }),
}
