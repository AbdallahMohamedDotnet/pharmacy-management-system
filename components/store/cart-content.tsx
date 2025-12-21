"use client"

import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, ShieldCheck, Truck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CartContent() {
  const { data: cart, mutate } = useSWR("/api/cart", fetcher)

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })
    mutate()
  }

  const removeItem = async (itemId: string) => {
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" })
    mutate()
  }

  const clearCart = async () => {
    await fetch("/api/cart", { method: "DELETE" })
    mutate()
  }

  const isUnauthorized = cart?.error === "Unauthorized"
  const hasItems = cart?.data?.length > 0
  const subtotal = cart?.summary?.total || 0
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Shopping Cart</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {isUnauthorized ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Sign in to view your cart</h2>
                <p className="mt-2 text-center text-muted-foreground">
                  You need to be logged in to add items to your cart
                </p>
                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/register">Create Account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : hasItems ? (
            <>
              <div className="rounded-xl border bg-card">
                <div className="border-b p-4">
                  <span className="font-medium">{cart?.summary?.items_count || 0} items in your cart</span>
                </div>
                <div className="divide-y">
                  {cart.data.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                        <img
                          src={
                            item.medicines?.image_url ||
                            `/placeholder.svg?height=96&width=96&query=${encodeURIComponent(item.medicines?.name || "medicine")}`
                          }
                          alt={item.medicines?.name || "Medicine"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.medicines?.name || "Unknown Medicine"}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">${item.medicines?.price || 0} each</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center rounded-lg border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 border-0 text-center focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-lg font-semibold">
                            ${((item.medicines?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                  <Link href="/shop">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-center text-muted-foreground">
                  Looks like you haven&apos;t added any items to your cart yet
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({cart?.summary?.items_count || 0} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {subtotal > 0 && subtotal < 50 && (
                <p className="text-xs text-primary">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full" size="lg" disabled={!hasItems}>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Fast Delivery
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
