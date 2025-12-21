"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Package, Filter } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/30",
  processing: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  shipped: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  delivered: "bg-success/20 text-success border-success/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
}

export function OrdersContent() {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [page, setPage] = useState(1)

  const { data: orders } = useSWR(
    `/api/orders?page=${page}&limit=10${statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : ""}`,
    fetcher,
  )

  const isUnauthorized = orders?.error === "Unauthorized"

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{orders?.pagination?.total || 0} orders found</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isUnauthorized ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Sign in to view orders</p>
            <p className="text-sm text-muted-foreground mb-4">You need to be logged in to see your orders</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      ) : orders?.data?.length > 0 ? (
        <div className="space-y-4">
          {orders.data.map((order: any) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base text-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[order.status] || ""} variant="outline">
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary/50" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.medicines?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} x ${item.price_at_time}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        ${(item.quantity * item.price_at_time).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-foreground">${order.total_amount?.toFixed(2) || "0.00"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-4">Your orders will appear here after checkout</p>
            <Button asChild>
              <a href="/medicines">Browse Medicines</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
