"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  Pill, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Package,
  ClipboardList,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"
import { medicinesApi, ordersApi, usersApi } from "@/lib/api"

interface DashboardStats {
  totalUsers: number
  totalMedicines: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockItems: number
  pendingPrescriptions: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: "order" | "user" | "medicine" | "prescription"
  action: string
  description: string
  timestamp: string
}

export function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockMedicines, setLowStockMedicines] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch medicines
        const medicinesRes = await medicinesApi.getAll({ pageSize: 100 })
        const medicines = medicinesRes.items || []
        
        // Fetch orders
        let orders: any[] = []
        try {
          const ordersRes = await ordersApi.getAll({ pageSize: 100 })
          orders = ordersRes.items || []
        } catch (e) {
          console.log("Orders fetch failed, user might not have permission")
        }

        // Fetch users (admin only)
        let users: any[] = []
        try {
          const usersRes = await usersApi.getAll({ pageSize: 100 })
          users = usersRes.items || []
        } catch (e) {
          console.log("Users fetch failed, user might not have permission")
        }

        // Calculate low stock items
        const lowStock = medicines.filter((m: any) => m.stock < (m.lowStockThreshold || 20))

        // Calculate revenue from orders
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)

        // Pending orders (status 1 = PendingPayment)
        const pendingOrders = orders.filter((o: any) => o.status === 1 || o.status === 4).length

        // Pending prescriptions (status 128 = PrescriptionPending)
        const pendingPrescriptions = orders.filter((o: any) => o.status === 128).length

        setStats({
          totalUsers: users.length,
          totalMedicines: medicines.length,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          lowStockItems: lowStock.length,
          pendingPrescriptions,
          recentActivity: []
        })

        setRecentOrders(orders.slice(0, 5))
        setLowStockMedicines(lowStock.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Total Medicines",
      value: stats?.totalMedicines || 0,
      change: "+3",
      trend: "up",
      icon: Pill,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ]

  const alertCards = [
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: ClipboardList,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      href: "/admin/orders?status=pending"
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockItems || 0,
      icon: Package,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      href: "/admin/inventory"
    },
    {
      title: "Pending Prescriptions",
      value: stats?.pendingPrescriptions || 0,
      icon: FileText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      href: "/admin/prescriptions"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/reports">View Reports</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className={`flex items-center text-xs mt-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {alertCards.map((alert, index) => (
          <Link key={index} href={alert.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg ${alert.bgColor} flex items-center justify-center`}>
                      <alert.icon className={`h-5 w-5 ${alert.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{alert.title}</p>
                      <p className="text-xl font-bold">{alert.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.itemCount || 0} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(order.totalAmount || 0).toFixed(2)}</p>
                      <Badge variant={order.status === 16 ? "default" : order.status === 32 ? "destructive" : "secondary"}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/inventory">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockMedicines.length > 0 ? (
              <div className="space-y-4">
                {lowStockMedicines.map((medicine: any) => (
                  <div key={medicine.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Pill className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.categoryName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">{medicine.stock} left</p>
                      <p className="text-xs text-muted-foreground">Min: {medicine.lowStockThreshold || 20}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">All items are well-stocked</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/admin/users/new">
                <Users className="h-5 w-5" />
                <span>Add User</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/admin/medicines/new">
                <Pill className="h-5 w-5" />
                <span>Add Medicine</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/admin/categories/new">
                <Package className="h-5 w-5" />
                <span>Add Category</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/admin/audit-logs">
                <Activity className="h-5 w-5" />
                <span>View Audit Logs</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getOrderStatusLabel(status: number): string {
  const statusMap: Record<number, string> = {
    1: "Pending Payment",
    2: "Paid",
    4: "Processing",
    8: "Shipped",
    16: "Delivered",
    32: "Cancelled",
    64: "Refunded",
    128: "Prescription Pending",
    256: "Prescription Approved",
    512: "Prescription Rejected"
  }
  return statusMap[status] || "Unknown"
}
