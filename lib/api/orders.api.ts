import { apiClient } from "./client"
import type { Order, CreateOrderRequest, PaginatedResponse, OrderStatus } from "@/types"

interface OrdersQueryParams {
  pageNumber?: number
  pageSize?: number
  status?: number
  fromDate?: string
  toDate?: string
}

interface UpdateStatusRequest {
  status: number
  notes?: string
}

export const ordersApi = {
  getAll: (params?: OrdersQueryParams) =>
    apiClient.get<PaginatedResponse<Order>>("/orders", params as Record<string, string | number | boolean | undefined>),

  // Admin endpoint to get all orders
  getAllOrders: (params?: OrdersQueryParams) =>
    apiClient.get<PaginatedResponse<Order>>("/orders/all", params as Record<string, string | number | boolean | undefined>),

  getById: (id: string) => apiClient.get<Order>(`/orders/${id}`),

  getByOrderNumber: (orderNumber: string) => apiClient.get<Order>(`/orders/by-number/${orderNumber}`),

  create: (data: CreateOrderRequest) => apiClient.post<Order>("/orders", data),

  createPrescriptionOrder: (data: {
    prescriptionImageUrl: string
    doctorName: string
    doctorPhone: string
    notes?: string
    shippingAddress: string
    shippingCity: string
    shippingState: string
    shippingZipCode: string
    shippingCountry: string
  }) => apiClient.post<Order>("/orders/prescription", data),

  cancel: (id: string, reason?: string) => apiClient.post(`/orders/${id}/cancel`, { reason }),

  updateStatus: (id: string, data: UpdateStatusRequest) => 
    apiClient.patch<Order>(`/orders/${id}/status`, data),

  getMyOrders: (params?: { pageNumber?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<Order>>(
      "/orders/my-orders",
      params as Record<string, string | number | boolean | undefined>,
    ),

  reorder: (orderId: string) => apiClient.post<Order>(`/orders/${orderId}/reorder`),

  // Prescription endpoints
  getPendingPrescriptions: () => 
    apiClient.get<PaginatedResponse<Order>>("/orders/prescriptions/pending"),

  reviewPrescription: (orderId: string, data: {
    isApproved: boolean
    notes?: string
    items?: { medicineId: string; quantity: number }[]
  }) => apiClient.post(`/orders/${orderId}/prescriptions/review`, data),
}
