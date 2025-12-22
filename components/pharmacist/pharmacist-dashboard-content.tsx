"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Pill, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Package,
  TrendingUp,
  RefreshCw,
  Eye
} from "lucide-react"
import { ordersApi, medicinesApi } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

interface DashboardStats {
  pendingPrescriptions: number
  todayOrders: number
  lowStockMedicines: number
  approvedToday: number
}

interface PendingPrescription {
  id: string
  orderNumber: string
  customerName: string
  doctorName: string
  submittedAt: string
  status: string
}

interface LowStockMedicine {
  id: string
  name: string
  stock: number
  minStock: number
  category: string
}

export function PharmacistDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingPrescriptions: 0,
    todayOrders: 0,
    lowStockMedicines: 0,
    approvedToday: 0
  })
  const [pendingPrescriptions, setPendingPrescriptions] = useState<PendingPrescription[]>([])
  const [lowStockMedicines, setLowStockMedicines] = useState<LowStockMedicine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch medicines with low stock
      const medicinesResponse = await medicinesApi.getAll({ pageSize: 100 })
      const medicines = medicinesResponse.items || []
      
      const lowStock = medicines
        .filter((m: any) => m.stockQuantity < (m.minStockLevel || 10))
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          stock: m.stockQuantity,
          minStock: m.minStockLevel || 10,
          category: m.categoryName || 'General'
        }))
      
      setLowStockMedicines(lowStock.slice(0, 5))

      // Fetch orders to get prescription orders
      const ordersResponse = await ordersApi.getAll({ pageSize: 50 })
      const orders = ordersResponse.items || []
      
      const prescriptionOrders = orders
        .filter((o: any) => o.prescriptionImageUrl && o.status === 128) // 128 = PrescriptionPending
        .map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName || 'Unknown',
          doctorName: o.doctorName || 'Not specified',
          submittedAt: o.createdAt,
          status: 'Pending Review'
        }))
      
      setPendingPrescriptions(prescriptionOrders.slice(0, 5))

      // Calculate stats
      const today = new Date().toDateString()
      const todayOrders = orders.filter((o: any) => 
        new Date(o.createdAt).toDateString() === today
      ).length

      setStats({
        pendingPrescriptions: prescriptionOrders.length,
        todayOrders,
        lowStockMedicines: lowStock.length,
        approvedToday: orders.filter((o: any) => 
          new Date(o.createdAt).toDateString() === today && o.status >= 1
        ).length
      })

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pharmacist Dashboard</h1>
          <p className="text-muted-foreground">Manage prescriptions, inventory, and orders</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">Orders received today</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockMedicines}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
            <p className="text-xs text-muted-foreground">Prescriptions approved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Prescriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Pending Prescriptions
                </CardTitle>
                <CardDescription>Review and approve prescription orders</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pharmacist/prescriptions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : pendingPrescriptions.length > 0 ? (
              <div className="space-y-3">
                {pendingPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{prescription.orderNumber}</span>
                        <Badge variant="outline" className="text-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dr. {prescription.doctorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(prescription.submittedAt)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/pharmacist/prescriptions/${prescription.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No pending prescriptions</p>
                <p className="text-sm">All prescriptions have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Medicines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Medicines that need restocking</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pharmacist/medicines">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : lowStockMedicines.length > 0 ? (
              <div className="space-y-3">
                {lowStockMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Pill className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={medicine.stock === 0 ? "destructive" : "outline"} className="text-red-600">
                        {medicine.stock} left
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {medicine.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All medicines are well stocked</p>
                <p className="text-sm">No restocking needed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/pharmacist/prescriptions">
                <FileText className="h-6 w-6 text-orange-500" />
                <span>Review Prescriptions</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/pharmacist/medicines">
                <Pill className="h-6 w-6 text-blue-500" />
                <span>Manage Medicines</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/pharmacist/orders">
                <Package className="h-6 w-6 text-green-500" />
                <span>Process Orders</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/pharmacist/categories">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                <span>View Categories</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
