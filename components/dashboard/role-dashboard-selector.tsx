"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ShieldCheck, 
  Beaker, 
  User, 
  ArrowRight,
  LayoutDashboard,
  Store
} from "lucide-react"
import Link from "next/link"

const roleConfig = {
  admin: {
    name: "Administrator",
    description: "Full system access with user management, analytics, and audit logs",
    icon: ShieldCheck,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    badgeColor: "bg-red-100 text-red-800",
    href: "/admin",
    features: ["User Management", "Analytics Dashboard", "Audit Logs", "Full Order Management", "System Settings"]
  },
  pharmacist: {
    name: "Pharmacist",
    description: "Manage medicines, process orders, and review prescriptions",
    icon: Beaker,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    badgeColor: "bg-blue-100 text-blue-800",
    href: "/pharmacist",
    features: ["Medicine Management", "Order Processing", "Prescription Review", "Stock Management", "Category View"]
  },
  customer: {
    name: "Customer",
    description: "Browse medicines, place orders, and manage your prescriptions",
    icon: User,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    badgeColor: "bg-green-100 text-green-800",
    href: "/shop",
    features: ["Browse Medicines", "Place Orders", "View Order History", "Submit Prescriptions", "Manage Cart"]
  }
}

export function RoleDashboardSelector() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Auto-redirect to role-specific dashboard if only one role
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.roles?.length === 1) {
      const role = user.roles[0].toLowerCase()
      const config = roleConfig[role as keyof typeof roleConfig]
      if (config) {
        router.push(config.href)
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>Welcome to PharmaCare</CardTitle>
            <CardDescription>Sign in to access your personalized dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/register">Create Account</Link>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/shop">
                <Store className="h-4 w-4 mr-2" />
                Browse as Guest
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRoles = user?.roles || ["Customer"]
  const availableRoles = userRoles.map(r => r.toLowerCase())

  // If user has multiple roles, show role selector
  if (availableRoles.length > 1) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName || "User"}!</h1>
          <p className="text-muted-foreground">Select a dashboard to get started</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableRoles.map((role) => {
            const config = roleConfig[role as keyof typeof roleConfig]
            if (!config) return null

            const Icon = config.icon
            return (
              <Card key={role} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <Badge className={config.badgeColor}>{role}</Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{config.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {config.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={config.href}>
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Single role - show that dashboard's quick info
  const primaryRole = availableRoles[0] || "customer"
  const config = roleConfig[primaryRole as keyof typeof roleConfig] || roleConfig.customer
  const Icon = config.icon

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-8 w-8 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-xl">Welcome, {user?.firstName || "User"}!</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                Logged in as <Badge className={config.badgeColor}>{config.name}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{config.description}</p>
          <Button asChild className="w-full" size="lg">
            <Link href={config.href}>
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
