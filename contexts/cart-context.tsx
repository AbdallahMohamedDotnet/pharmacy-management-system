"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { cartApi } from "@/lib/api"
import type { Cart, AddToCartRequest } from "@/types"
import { useAuth } from "./auth-context"

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  addToCart: (data: AddToCartRequest) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    setIsLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const addToCart = async (data: AddToCartRequest) => {
    const updatedCart = await cartApi.addItem(data)
    setCart(updatedCart)
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    const updatedCart = await cartApi.updateItem(itemId, { quantity })
    setCart(updatedCart)
  }

  const removeFromCart = async (itemId: string) => {
    const updatedCart = await cartApi.removeItem(itemId)
    setCart(updatedCart)
  }

  const clearCart = async () => {
    await cartApi.clearCart()
    setCart(null)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems: cart?.totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
