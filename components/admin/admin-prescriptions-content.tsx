"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  FileText, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User,
  Calendar,
  Phone,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ordersApi } from "@/lib/api"
import { toast } from "sonner"

interface PrescriptionOrderData {
  id: string
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  prescriptionImageUrl?: string
  doctorName?: string
  doctorPhone?: string
  notes?: string
  status: number
  createdAt: string
  shippingAddress?: string
  shippingCity?: string
  totalAmount?: number
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

const statusMap: Record<number, { label: string; color: string; icon: any }> = {
  0: { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: Clock },
  1: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  2: { label: "Paid", color: "bg-green-100 text-green-800", icon: CheckCircle },
  4: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: RefreshCw },
  8: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: FileText },
  16: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  32: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
  64: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: RefreshCw },
  128: { label: "Prescription Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  256: { label: "Prescription Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  512: { label: "Prescription Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
}

const defaultStatusInfo = { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: Clock }

export function AdminPrescriptionsContent() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrderData[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionOrderData | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [isApproving, setIsApproving] = useState(false)

  const fetchPrescriptions = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        pageNumber: currentPage,
        pageSize: 20
      }
      if (statusFilter !== "all") {
        params.status = parseInt(statusFilter)
      }

      // Try admin endpoint first, fall back to regular endpoint
      let response
      try {
        response = await ordersApi.getAllOrders(params)
      } catch {
        response = await ordersApi.getAll(params)
      }
      
      setAllOrders(response.items || [])
      
      // Filter only prescription orders (orders with prescriptionImageUrl)
      const prescriptionOrders = ((response.items || []) as any[]).filter(
        (order: any) => order.prescriptionImageUrl
      ) as PrescriptionOrderData[]
      setPrescriptions(prescriptionOrders)
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Error fetching prescriptions:", error)
      toast.error("Failed to load prescriptions")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [currentPage, statusFilter])

  const openReviewDialog = (prescription: PrescriptionOrderData) => {
    setSelectedPrescription(prescription)
    setReviewNotes("")
    setIsReviewDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedPrescription) return
    setIsApproving(true)
    try {
      await ordersApi.updateStatus(selectedPrescription.id, {
        status: 256, // PrescriptionApproved
        notes: reviewNotes || "Prescription approved by admin"
      })
      toast.success("Prescription approved successfully")
      setIsReviewDialogOpen(false)
      fetchPrescriptions()
    } catch (error) {
      console.error("Error approving prescription:", error)
      toast.error("Failed to approve prescription")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedPrescription) return
    if (!reviewNotes.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    setIsApproving(true)
    try {
      await ordersApi.updateStatus(selectedPrescription.id, {
        status: 512, // PrescriptionRejected
        notes: reviewNotes
      })
      toast.success("Prescription rejected")
      setIsReviewDialogOpen(false)
      fetchPrescriptions()
    } catch (error) {
      console.error("Error rejecting prescription:", error)
      toast.error("Failed to reject prescription")
    } finally {
      setIsApproving(false)
    }
  }

  const handleStatusChange = async (prescriptionId: string, newStatus: number) => {
    try {
      await ordersApi.updateStatus(prescriptionId, { status: newStatus })
      toast.success("Status updated successfully")
      fetchPrescriptions()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
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

  // Stats
  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === 0).length,
    approved: prescriptions.filter(p => p.status >= 1 && p.status <= 4).length,
    rejected: prescriptions.filter(p => p.status === 5 || p.status === 6).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions Management</h1>
          <p className="text-muted-foreground">Review and manage all prescription orders</p>
        </div>
        <Button onClick={fetchPrescriptions} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or customer..."
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
                <SelectItem value="0">Pending</SelectItem>
                <SelectItem value="1">Approved</SelectItem>
                <SelectItem value="2">Processing</SelectItem>
                <SelectItem value="3">Shipped</SelectItem>
                <SelectItem value="4">Delivered</SelectItem>
                <SelectItem value="5">Cancelled</SelectItem>
                <SelectItem value="6">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Prescription Orders</CardTitle>
          <CardDescription>
            {prescriptions.length} prescription orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions
                .filter(p => 
                  p.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((prescription) => {
                const statusInfo = getStatusInfo(prescription.status)
                const StatusIcon = statusInfo.icon
                return (
                  <div
                    key={prescription.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">#{prescription.orderNumber}</span>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {prescription.status === 0 && (
                          <Badge variant="outline" className="border-orange-300 text-orange-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Needs Review
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-4 w-4" />
                          {prescription.customerName || prescription.customerEmail || "Unknown"}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          Dr. {prescription.doctorName || "Not specified"}
                        </div>
                        {prescription.doctorPhone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {prescription.doctorPhone}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(prescription.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {prescription.prescriptionImageUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a 
                            href={prescription.prescriptionImageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Rx
                          </a>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {prescription.status === 0 && (
                            <DropdownMenuItem onClick={() => openReviewDialog(prescription)}>
                              Review Prescription
                            </DropdownMenuItem>
                          )}
                          {prescription.status < 4 && prescription.status !== 5 && prescription.status !== 6 && (
                            <>
                              {prescription.status < 1 && (
                                <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, 1)}>
                                  Mark Approved
                                </DropdownMenuItem>
                              )}
                              {prescription.status < 2 && prescription.status >= 1 && (
                                <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, 2)}>
                                  Mark Processing
                                </DropdownMenuItem>
                              )}
                              {prescription.status < 3 && prescription.status >= 2 && (
                                <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, 3)}>
                                  Mark Shipped
                                </DropdownMenuItem>
                              )}
                              {prescription.status === 3 && (
                                <DropdownMenuItem onClick={() => handleStatusChange(prescription.id, 4)}>
                                  Mark Delivered
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          {prescription.status < 4 && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleStatusChange(prescription.id, 5)}
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No prescription orders found</p>
              <p className="text-sm">Prescription orders will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Prescription</DialogTitle>
            <DialogDescription>
              Review the prescription details and approve or reject the order
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Order Number</Label>
                  <p className="font-medium">#{selectedPrescription.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedPrescription.customerName || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Doctor</Label>
                  <p className="font-medium">Dr. {selectedPrescription.doctorName || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Doctor Phone</Label>
                  <p className="font-medium">{selectedPrescription.doctorPhone || "Not provided"}</p>
                </div>
              </div>

              {selectedPrescription.prescriptionImageUrl && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Prescription Image</Label>
                  <a 
                    href={selectedPrescription.prescriptionImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selectedPrescription.prescriptionImageUrl}
                      alt="Prescription"
                      className="max-h-64 rounded-lg border object-contain mx-auto"
                    />
                  </a>
                </div>
              )}

              {selectedPrescription.notes && (
                <div>
                  <Label className="text-muted-foreground">Patient Notes</Label>
                  <p className="text-sm p-2 bg-muted rounded-lg">{selectedPrescription.notes}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="text-sm">
                  {selectedPrescription.shippingAddress}, {selectedPrescription.shippingCity}
                </p>
              </div>

              <div>
                <Label htmlFor="reviewNotes">Review Notes</Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your review (required for rejection)"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isApproving}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
