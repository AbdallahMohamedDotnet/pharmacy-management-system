"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Package, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Truck,
  MapPin,
  Calendar
} from "lucide-react"
import { ordersApi } from "@/lib/api"
import { toast } from "sonner"

interface OrderItemData {
  id: string
  medicineName?: string
  quantity: number
  unitPrice: number
  totalPrice?: number
}

interface OrderData {
  id: string
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  status: number
  totalAmount: number
  createdAt: string
  shippingAddress?: string
  shippingCity?: string
  shippingState?: string
  shippingZipCode?: string
  items?: OrderItemData[]
  prescriptionImageUrl?: string
}

const statusMap: Record<number, { label: string; color: string; icon: any }> = {
  0: { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: Clock },
  1: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  2: { label: "Paid", color: "bg-green-100 text-green-800", icon: CheckCircle },
  4: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  8: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  16: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  32: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
  64: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: RefreshCw },
  128: { label: "Prescription Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  256: { label: "Prescription Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  512: { label: "Prescription Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
}

const defaultStatusInfo = { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: Clock }

export function PharmacistOrdersContent() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        pageNumber: currentPage,
        pageSize: 10
      }
      if (statusFilter !== "all") {
        params.status = parseInt(statusFilter)
      }

      const response = await ordersApi.getAll(params)
      setOrders((response.items || []) as unknown as OrderData[])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  const handleStatusUpdate = async (orderId: string, newStatus: number) => {
    try {
      await ordersApi.updateStatus(orderId, { status: newStatus })
      toast.success("Order status updated")
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const openDetailDialog = (order: OrderData) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: number) => {
    return statusMap[status] || defaultStatusInfo
  }

  const getNextStatus = (currentStatus: number): number | null => {
    const flow: Record<number, number> = {
      0: 1, // Pending -> Confirmed
      1: 2, // Confirmed -> Processing
      2: 3, // Processing -> Shipped
      3: 4, // Shipped -> Delivered
    }
    return flow[currentStatus] ?? null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Process and track customer orders</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {[1, 2, 4, 8, 16].map((status) => {
          const info = getStatusInfo(status)
          const count = orders.filter(o => o.status === status).length
          const Icon = info.icon
          return (
            <Card key={status} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter(String(status))}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {info.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            {orders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon
                const nextStatus = getNextStatus(order.status)
                return (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">#{order.orderNumber}</span>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {order.prescriptionImageUrl && (
                          <Badge variant="outline" className="border-purple-300 text-purple-600">
                            Prescription
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <span>{order.customerName || "Unknown Customer"}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.shippingCity || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="font-medium text-foreground">
                          ${order.totalAmount?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailDialog(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {nextStatus !== null && order.status !== 5 && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                        >
                          {getStatusInfo(nextStatus).label}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Orders will appear here when customers place them</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusInfo(selectedOrder.status).color}>
                  {getStatusInfo(selectedOrder.status).label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedOrder.customerName || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Amount</Label>
                  <p className="text-xl font-bold text-primary">
                    ${selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="text-sm">
                  {selectedOrder.shippingAddress}<br/>
                  {selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZipCode}
                </p>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Order Items</Label>
                  <div className="border rounded-lg divide-y">
                    {(selectedOrder.items || []).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3">
                        <div>
                          <p className="font-medium">{item.medicineName || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">${(item.totalPrice ?? item.quantity * item.unitPrice).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.prescriptionImageUrl && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Prescription</Label>
                  <a 
                    href={selectedOrder.prescriptionImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Prescription Image
                  </a>
                </div>
              )}

              {/* Status Update */}
              {selectedOrder.status < 4 && selectedOrder.status !== 5 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Update Status</Label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].filter(s => s > selectedOrder.status).map((status) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      >
                        Mark as {getStatusInfo(status).label}
                      </Button>
                    ))}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedOrder.id, 5)}
                    >
                      Cancel Order
                    </Button>
                  </div>
                </div>
              )}
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
