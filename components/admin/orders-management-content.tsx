"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  Eye, 
  Package, 
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"
import { ordersApi } from "@/lib/api"
import { toast } from "sonner"

interface OrderData {
  id: string
  orderNumber: string
  status: number
  totalAmount: number
  itemCount?: number
  hasPrescription?: boolean
  createdAt: string
  userId?: string
  userEmail?: string
  items?: any[]
  prescriptionImageUrl?: string
}

const ORDER_STATUSES = [
  { value: "all", label: "All Orders" },
  { value: "1", label: "Pending Payment" },
  { value: "2", label: "Paid" },
  { value: "4", label: "Processing" },
  { value: "8", label: "Shipped" },
  { value: "16", label: "Delivered" },
  { value: "32", label: "Cancelled" },
  { value: "64", label: "Refunded" },
  { value: "128", label: "Prescription Pending" },
  { value: "256", label: "Prescription Approved" },
  { value: "512", label: "Prescription Rejected" },
]

export function OrdersManagementContent() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getAllOrders({
        pageNumber: page,
        pageSize: 10,
        status: statusFilter !== "all" ? parseInt(statusFilter) : undefined
      })
      setOrders((response.items || []) as OrderData[])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await ordersApi.getById(orderId)
      setSelectedOrder(order)
      setIsDetailDialogOpen(true)
    } catch (error) {
      toast.error("Failed to load order details")
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: number) => {
    try {
      setIsUpdatingStatus(true)
      await ordersApi.updateStatus(orderId, { status: newStatus })
      toast.success("Order status updated successfully")
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: number) => {
    const statusConfig: Record<number, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      1: { label: "Pending Payment", variant: "outline" },
      2: { label: "Paid", variant: "secondary" },
      4: { label: "Processing", variant: "secondary" },
      8: { label: "Shipped", variant: "default" },
      16: { label: "Delivered", variant: "default" },
      32: { label: "Cancelled", variant: "destructive" },
      64: { label: "Refunded", variant: "destructive" },
      128: { label: "Prescription Pending", variant: "outline" },
      256: { label: "Prescription Approved", variant: "default" },
      512: { label: "Prescription Rejected", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: "Unknown", variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: number) => {
    if (status === 1 || status === 128) return <Clock className="h-4 w-4 text-amber-500" />
    if (status === 4) return <Package className="h-4 w-4 text-blue-500" />
    if (status === 8) return <Truck className="h-4 w-4 text-purple-500" />
    if (status === 16 || status === 256) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 32 || status === 512) return <XCircle className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage and track all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-6 gap-4 px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                <div>Order</div>
                <div>Date</div>
                <div>Items</div>
                <div>Total</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Rows */}
              {orders.map((order) => (
                <div key={order.id} className="grid md:grid-cols-6 gap-4 px-4 py-4 border rounded-lg items-center">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      {order.hasPrescription && (
                        <Badge variant="outline" className="text-xs">Rx</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm">{order.itemCount} items</div>
                  <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                  <div>{getStatusBadge(order.status)}</div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === 4 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 8)}
                      >
                        <Truck className="mr-1 h-4 w-4" />
                        Ship
                      </Button>
                    )}
                    {order.status === 8 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(order.id, 16)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Deliver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders found</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Order placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Shipping Info */}
              <div className="space-y-2">
                <h4 className="font-medium">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.shippingAddress}<br />
                  {selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZipCode}<br />
                  {selectedOrder.shippingCountry}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-medium">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.medicineName} x{item.quantity}</span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(selectedOrder.subTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(selectedOrder.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedOrder.status === 1 && (
                    <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 2)} disabled={isUpdatingStatus}>
                      Mark as Paid
                    </Button>
                  )}
                  {selectedOrder.status === 2 && (
                    <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 4)} disabled={isUpdatingStatus}>
                      Start Processing
                    </Button>
                  )}
                  {selectedOrder.status === 4 && (
                    <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 8)} disabled={isUpdatingStatus}>
                      Mark as Shipped
                    </Button>
                  )}
                  {selectedOrder.status === 8 && (
                    <Button size="sm" onClick={() => handleUpdateStatus(selectedOrder.id, 16)} disabled={isUpdatingStatus}>
                      Mark as Delivered
                    </Button>
                  )}
                  {selectedOrder.status !== 32 && selectedOrder.status !== 16 && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleUpdateStatus(selectedOrder.id, 32)} 
                      disabled={isUpdatingStatus}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
