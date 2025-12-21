"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Package, ClipboardList, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AnalyticsContent() {
  const { data: stats } = useSWR("/api/stats", fetcher)
  const { data: medicines } = useSWR("/api/medicines?limit=100", fetcher)

  // Calculate low stock items
  const lowStockItems = medicines?.data?.filter((m: any) => m.stock_quantity < 20) || []

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stats?.data?.total_revenue?.toFixed(2) || "0.00"}
                </p>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12.5% from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats?.data?.total_orders || 0}</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8.2% from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">{stats?.data?.total_medicines || 0}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +3 new this month
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Pill className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-foreground">{lowStockItems.length}</p>
                <div className="flex items-center text-xs text-warning mt-1">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Needs attention
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>These items need to be restocked soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((medicine: any) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Pill className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{medicine.name}</p>
                      <p className="text-xs text-muted-foreground">{medicine.categories?.name || "Uncategorized"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-warning">{medicine.stock_quantity} left</p>
                    <p className="text-xs text-muted-foreground">Min: 20</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Inventory Overview</CardTitle>
          <CardDescription>Current stock levels for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicines?.data?.slice(0, 10).map((medicine: any) => (
              <div key={medicine.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">{medicine.stock_quantity} units</p>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        medicine.stock_quantity < 20
                          ? "bg-warning"
                          : medicine.stock_quantity < 50
                            ? "bg-chart-4"
                            : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(100, (medicine.stock_quantity / 200) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
