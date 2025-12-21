"use client"

import useSWR from "swr"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, Pill, CreditCard } from "lucide-react"

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

  return (
    <div className="p-4 lg:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {isUnauthorized ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Sign in to view your cart</p>
                <p className="text-sm text-muted-foreground mb-4">You need to be logged in to add items to your cart</p>
                <Button>Sign In</Button>
              </CardContent>
            </Card>
          ) : hasItems ? (
            <>
              {cart.data.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Pill className="h-8 w-8 text-primary/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {item.medicines?.name || "Unknown Medicine"}
                            </h3>
                            <p className="text-sm text-muted-foreground">${item.medicines?.price || 0} per unit</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-medium text-foreground">
                            ${((item.medicines?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-4">Add some medicines to get started</p>
                <Button asChild>
                  <a href="/medicines">Browse Medicines</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items ({cart?.summary?.items_count || 0})</span>
                <span className="text-foreground">${(cart?.summary?.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${(cart?.summary?.total || 0).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!hasItems}>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
