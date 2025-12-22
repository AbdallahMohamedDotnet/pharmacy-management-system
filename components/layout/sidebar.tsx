"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  ClipboardList,
  FileText,
  Settings,
  Package,
  Users,
  BarChart3,
  Menu,
  X,
  ScrollText,
  ShieldCheck,
  Stethoscope,
  LogOut,
  ChevronUp,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const customerNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Shop", href: "/shop", icon: ShoppingCart },
  { name: "Medicines", href: "/medicines", icon: Pill },
  { name: "Categories", href: "/categories", icon: Package },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "My Orders", href: "/orders", icon: ClipboardList },
  { name: "Prescriptions", href: "/prescriptions", icon: FileText },
]

const pharmacistNav = [
  { name: "Dashboard", href: "/pharmacist", icon: LayoutDashboard },
  { name: "Medicines", href: "/pharmacist/medicines", icon: Pill },
  { name: "Categories", href: "/pharmacist/categories", icon: Package },
  { name: "Prescriptions", href: "/pharmacist/prescriptions", icon: FileText },
  { name: "Orders", href: "/pharmacist/orders", icon: ClipboardList },
]

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ClipboardList },
  { name: "Medicines", href: "/admin/medicines", icon: Pill },
  { name: "Categories", href: "/admin/categories", icon: Package },
  { name: "Prescriptions", href: "/admin/prescriptions", icon: FileText },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Determine user role
  const userRole = user?.roles?.[0]?.toLowerCase() || "customer"
  const isAdmin = userRole === "admin"
  const isPharmacist = userRole === "pharmacist"

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">PharmaCare</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {/* Customer Navigation - Always show for customers */}
            {!isAdmin && !isPharmacist && (
              <>
                <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Main Menu</p>
                <div className="mt-2 space-y-1">
                  {customerNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            {/* Pharmacist Navigation */}
            {isPharmacist && (
              <>
                <div className="flex items-center gap-2 px-3 mb-2">
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pharmacist</p>
                </div>
                <div className="mt-2 space-y-1">
                  {pharmacistNav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
              <>
                <div className="flex items-center gap-2 px-3 mb-2">
                  <ShieldCheck className="h-4 w-4 text-red-500" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin Panel</p>
                </div>
                <div className="mt-2 space-y-1">
                  {adminNav.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}

            {/* Quick Links for Admin/Pharmacist to access customer view */}
            {(isAdmin || isPharmacist) && (
              <div className="mt-6 pt-4 border-t border-sidebar-border">
                <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Access</p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Store Front
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg p-1 hover:bg-sidebar-accent/50 transition-colors">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
                    isAdmin ? "bg-red-500" : isPharmacist ? "bg-blue-500" : "bg-primary"
                  )}>
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "G"}
                  </div>
                  <div className="flex-1 text-left text-sm">
                    <p className="font-medium text-sidebar-foreground">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.email || "Guest User"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {isAuthenticated ? userRole : "Not logged in"}
                    </p>
                  </div>
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  )
}
