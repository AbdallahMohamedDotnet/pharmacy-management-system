"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  shipping_address: string
  order_items?: {
    id: string
    quantity: number
    unit_price: number
    medicines: { name: string; image_url: string | null }
  }[]
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-amber-100 text-amber-700", label: "Pending" },
  confirmed: { icon: CheckCircle2, color: "bg-blue-100 text-blue-700", label: "Confirmed" },
  processing: { icon: Package, color: "bg-purple-100 text-purple-700", label: "Processing" },
  shipped: { icon: Truck, color: "bg-cyan-100 text-cyan-700", label: "Shipped" },
  delivered: { icon: CheckCircle2, color: "bg-green-100 text-green-700", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-red-100 text-red-700", label: "Cancelled" },
}

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        if (data.error) {
          setError(data.error)
        } else {
          setOrders(data.data || [])
        }
      } catch (err) {
        setError("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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

  if (error === "Unauthorized") {
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
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} formatDate={formatDate} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {orders
              .filter((o) => ["pending", "confirmed", "processing", "shipped"].includes(o.status))
              .map((order) => (
                <OrderCard key={order.id} order={order} formatDate={formatDate} />
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {orders
              .filter((o) => ["delivered", "cancelled"].includes(o.status))
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
  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order placed</p>
              <p className="font-medium">{formatDate(order.created_at)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">${order.total_amount.toFixed(2)}</p>
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
          <p className="mb-4 text-sm text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <div className="flex gap-3 overflow-x-auto">
            {order.order_items?.slice(0, 4).map((item) => (
              <div key={item.id} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                <img
                  src={
                    item.medicines?.image_url ||
                    `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.medicines?.name || "medicine")}`
                  }
                  alt={item.medicines?.name || "Product"}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {(order.order_items?.length || 0) > 4 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                +{(order.order_items?.length || 0) - 4}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
