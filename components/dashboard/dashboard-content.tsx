"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, ClipboardList, Pill, Users, AlertCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DashboardContent() {
  const { data: stats } = useSWR("/api/stats", fetcher)
  const { data: medicines } = useSWR("/api/medicines?limit=5", fetcher)
  const { data: categories } = useSWR("/api/categories", fetcher)

  const statsCards = [
    {
      title: "Total Medicines",
      value: stats?.data?.total_medicines || 0,
      change: "+12%",
      icon: Pill,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Categories",
      value: categories?.count || 0,
      change: "+2",
      icon: Package,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Low Stock Items",
      value: stats?.data?.low_stock_count || 0,
      change: "-3",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Total Orders",
      value: stats?.data?.total_orders || 0,
      change: "+18%",
      icon: ClipboardList,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-primary">{stat.change}</span> from last month
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Medicines & Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Medicines</CardTitle>
            <CardDescription>Latest added medicines in the inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicines?.data?.map((medicine: any) => (
                <div key={medicine.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{medicine.name}</p>
                      <p className="text-xs text-muted-foreground">{medicine.categories?.name || "Uncategorized"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${medicine.price}</p>
                    <p className="text-xs text-muted-foreground">Stock: {medicine.stock_quantity}</p>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No medicines found. Run the seed script first.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Categories</CardTitle>
            <CardDescription>Medicine categories overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories?.data?.map((category: any) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Package className="h-5 w-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {category.description || "No description"}
                      </p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No categories found. Run the seed script first.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <QuickActionCard
              icon={Pill}
              title="Add Medicine"
              description="Add new medicine to inventory"
              href="/medicines"
            />
            <QuickActionCard
              icon={ShoppingCart}
              title="View Cart"
              description="Check items in your cart"
              href="/cart"
            />
            <QuickActionCard icon={ClipboardList} title="Orders" description="View all orders" href="/orders" />
            <QuickActionCard
              icon={Users}
              title="Prescriptions"
              description="Manage prescriptions"
              href="/prescriptions"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: any
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-secondary"
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </a>
  )
}
