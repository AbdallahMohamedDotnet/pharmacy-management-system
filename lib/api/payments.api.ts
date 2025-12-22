import { apiClient } from "./client"
import type { Payment, PaymentMethod } from "@/types"

export const paymentsApi = {
  // Payment Methods
  getPaymentMethods: () => apiClient.get<PaymentMethod[]>("/payment-methods"),

  addPaymentMethod: (data: Partial<PaymentMethod>) => apiClient.post<PaymentMethod>("/payment-methods", data),

  removePaymentMethod: (id: string) => apiClient.delete(`/payment-methods/${id}`),

  setDefaultPaymentMethod: (id: string) => apiClient.patch(`/payment-methods/${id}/default`),

  // Payments
  processPayment: (orderId: string, paymentMethodId: string) =>
    apiClient.post<Payment>("/payments", { orderId, paymentMethodId }),

  getPaymentByOrder: (orderId: string) => apiClient.get<Payment>(`/payments/order/${orderId}`),

  refund: (paymentId: string, reason?: string) => apiClient.post(`/payments/${paymentId}/refund`, { reason }),
}
