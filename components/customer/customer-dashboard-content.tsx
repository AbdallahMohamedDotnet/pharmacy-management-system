"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Pill, 
  Heart,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from "lucide-react"
import { ordersApi, cartApi, medicinesApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { getMedicineImage } from "@/lib/medicine-images"
import Image from "next/image"

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cartItems: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  status: number
  totalAmount: number
  createdAt: string
  itemCount: number
}

interface FeaturedMedicine {
  id: string
  name: string
  price: number
  categoryName: string
  imageUrl?: string
}

const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800" },
  2: { label: "Paid", color: "bg-green-100 text-green-800" },
  4: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  8: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  16: { label: "Delivered", color: "bg-green-100 text-green-800" },
  32: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  64: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
  128: { label: "Prescription Pending", color: "bg-yellow-100 text-yellow-800" },
  256: { label: "Prescription Approved", color: "bg-green-100 text-green-800" },
  512: { label: "Prescription Rejected", color: "bg-red-100 text-red-800" },
}

export function CustomerDashboardContent() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cartItems: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [featuredMedicines, setFeaturedMedicines] = useState<FeaturedMedicine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch orders
      const ordersResponse = await ordersApi.getMyOrders({ pageSize: 10 })
      const orders = ordersResponse.items || []
      
      // Calculate stats - Pending = not delivered/cancelled/refunded
      const pending = orders.filter((o: any) => [1, 2, 4, 8, 128, 256].includes(o.status)).length
      const completed = orders.filter((o: any) => o.status === 16).length
      
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        pendingOrders: pending,
        completedOrders: completed
      }))

      // Set recent orders
      setRecentOrders(orders.slice(0, 5).map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
        itemCount: o.items?.length || 0
      })))

      // Fetch cart
      try {
        const cartResponse = await cartApi.getCart()
        setStats(prev => ({
          ...prev,
          cartItems: cartResponse.items?.length || 0
        }))
      } catch {
        // Cart might be empty or not exist
      }

      // Fetch featured medicines
      const medicinesResponse = await medicinesApi.getAll({ pageSize: 6 })
      setFeaturedMedicines((medicinesResponse.items || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        categoryName: m.categoryName,
        imageUrl: m.imageUrl
      })))

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusInfo = (status: number) => {
    return statusMap[status] || statusMap[0]
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Welcome to PharmaCare</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to view your personalized dashboard
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>

        {/* Show featured products even when not logged in */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Medicines</CardTitle>
            <CardDescription>Popular medicines available in our store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMedicines.map((medicine) => (
                <Link 
                  key={medicine.id} 
                  href={`/product/${medicine.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={medicine.imageUrl || getMedicineImage(medicine.name, medicine.categoryName)}
                        alt={medicine.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {medicine.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{medicine.categoryName}</p>
                    </div>
                    <p className="font-semibold text-primary">${medicine.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/shop">
                  Browse All Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || 'Customer'}!
          </h1>
          <p className="text-muted-foreground">Here's an overview of your activity</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                <p className="text-2xl font-bold text-blue-600">{stats.cartItems}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest orders</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">View All</Link>
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
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  return (
                    <Link
                      key={order.id}
                      href={`/orders`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} • {order.itemCount} items
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        <p className="text-sm font-medium mt-1">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/shop">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span>Browse Shop</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/cart">
                  <Package className="h-6 w-6 text-blue-500" />
                  <span>View Cart</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/prescriptions">
                  <FileText className="h-6 w-6 text-orange-500" />
                  <span>Prescriptions</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/profile">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span>My Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Medicines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Medicines</CardTitle>
              <CardDescription>Popular products you might like</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/shop">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMedicines.map((medicine) => (
                <Link 
                  key={medicine.id} 
                  href={`/product/${medicine.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={medicine.imageUrl || getMedicineImage(medicine.name, medicine.categoryName)}
                        alt={medicine.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {medicine.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{medicine.categoryName}</p>
                    </div>
                    <p className="font-semibold text-primary">${medicine.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
