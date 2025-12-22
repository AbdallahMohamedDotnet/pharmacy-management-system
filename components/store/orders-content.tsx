"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ordersApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Order, OrderStatus } from "@/types"

const statusConfig: Record<number, { icon: React.ElementType; color: string; label: string }> = {
  1: { icon: CreditCard, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Pending Payment" },
  2: { icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", label: "Paid" },
  4: { icon: Package, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", label: "Processing" },
  8: { icon: Truck, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", label: "Shipped" },
  16: { icon: CheckCircle2, color: "bg-green-500/10 text-green-600 dark:text-green-400", label: "Delivered" },
  32: { icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400", label: "Cancelled" },
}

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const response = await ordersApi.getMyOrders({ pageSize: 50 })
        setOrders(response.items || [])
      } catch (err) {
        console.error("Failed to load orders:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isActiveOrder = (status: OrderStatus) => [1, 2, 4, 8].includes(status)
  const isCompletedOrder = (status: OrderStatus) => [16, 32].includes(status)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Sign in to view your orders</h2>
            <p className="mt-2 text-center text-muted-foreground">Track your orders and view order history</p>
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
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">My Orders</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-center text-muted-foreground">When you place an order, it will appear here</p>
            <Button className="mt-6" asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({orders.filter((o) => isActiveOrder(o.status)).length})</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({orders.filter((o) => isCompletedOrder(o.status)).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} formatDate={formatDate} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {orders
              .filter((o) => isActiveOrder(o.status))
              .map((order) => (
                <OrderCard key={order.id} order={order} formatDate={formatDate} />
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {orders
              .filter((o) => isCompletedOrder(o.status))
              .map((order) => (
                <OrderCard key={order.id} order={order} formatDate={formatDate} />
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function OrderCard({ order, formatDate }: { order: Order; formatDate: (date: string) => string }) {
  const status = statusConfig[order.status] || {
    icon: Clock,
    color: "bg-muted text-muted-foreground",
    label: "Unknown",
  }
  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Order placed</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Order #</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={status.color}>
              <StatusIcon className="mr-1 h-3.5 w-3.5" />
              {status.label}
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/orders/${order.id}`}>
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-3 overflow-x-auto">
            {order.items.slice(0, 4).map((item) => (
              <div key={item.id} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                <img
                  src={`/.jpg?height=64&width=64&query=${encodeURIComponent(item.medicineName)}`}
                  alt={item.medicineName}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                +{order.items.length - 4}
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
