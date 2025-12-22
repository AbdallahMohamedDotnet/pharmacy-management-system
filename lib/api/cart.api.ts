import { apiClient } from "./client"
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "@/types"

export const cartApi = {
  getCart: () => apiClient.get<Cart>("/cart"),

  addItem: (data: AddToCartRequest) => apiClient.post<Cart>("/cart/items", data),

  updateItem: (itemId: string, data: UpdateCartItemRequest) => apiClient.put<Cart>(`/cart/items/${itemId}`, data),

  removeItem: (itemId: string) => apiClient.delete<Cart>(`/cart/items/${itemId}`),

  clearCart: () => apiClient.delete<void>("/cart"),

  applyCoupon: (code: string) => apiClient.post<Cart>("/cart/apply-coupon", { code }),

  removeCoupon: () => apiClient.delete<Cart>("/cart/coupon"),
}
