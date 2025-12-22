import { apiClient } from "./client"
import type { AuditLog, PaginatedResponse } from "@/types"

export const auditApi = {
  getAll: (params?: {
    pageNumber?: number
    pageSize?: number
    userId?: string
    action?: string
    entityType?: string
    startDate?: string
    endDate?: string
  }) =>
    apiClient.get<PaginatedResponse<AuditLog>>(
      "/audit-logs",
      params as Record<string, string | number | boolean | undefined>,
    ),

  getById: (id: string) => apiClient.get<AuditLog>(`/audit-logs/${id}`),

  getByUser: (userId: string, params?: { pageNumber?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<AuditLog>>(
      `/audit-logs/user/${userId}`,
      params as Record<string, string | number | boolean | undefined>,
    ),

  getByEntity: (entityType: string, entityId: string) =>
    apiClient.get<AuditLog[]>(`/audit-logs/entity/${entityType}/${entityId}`),
}
