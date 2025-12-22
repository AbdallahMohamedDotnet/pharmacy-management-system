import { apiClient } from "./client"
import type { Order, CreateOrderRequest, PaginatedResponse, OrderStatus } from "@/types"

export const ordersApi = {
  getAll: (params?: { pageNumber?: number; pageSize?: number; status?: OrderStatus }) =>
    apiClient.get<PaginatedResponse<Order>>("/orders", params as Record<string, string | number | boolean | undefined>),

  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),

  getByOrderNumber: (orderNumber: string) => apiClient.get<Order>(`/orders/by-number/${orderNumber}`),

  create: (data: CreateOrderRequest) => apiClient.post<Order>("/orders", data),

  cancel: (id: string, reason?: string) => apiClient.post(`/orders/${id}/cancel`, { reason }),

  updateStatus: (id: string, status: OrderStatus) => apiClient.patch<Order>(`/orders/${id}/status`, { status }),

  getMyOrders: (params?: { pageNumber?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<Order>>(
      "/orders/my-orders",
      params as Record<string, string | number | boolean | undefined>,
    ),

  reorder: (orderId: string) => apiClient.post<Order>(`/orders/${orderId}/reorder`),
}
