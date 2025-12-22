"use client"

import { Bell, Search, ShoppingCart, ShieldCheck, Beaker, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggleCompact } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface HeaderProps {
  title: string
  description?: string
}

const roleIcons = {
  admin: ShieldCheck,
  pharmacist: Beaker,
  customer: User
}

const roleColors = {
  admin: "bg-red-100 text-red-800 hover:bg-red-100",
  pharmacist: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  customer: "bg-green-100 text-green-800 hover:bg-green-100"
}

export function Header({ title, description }: HeaderProps) {
  const { user, isAuthenticated } = useAuth()
  const userRole = user?.roles?.[0]?.toLowerCase() || "customer"
  const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User
  const roleColor = roleColors[userRole as keyof typeof roleColors] || roleColors.customer

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="lg:pl-0 pl-12">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Role Badge */}
          {isAuthenticated && (
            <Link href="/dashboard">
              <Badge className={`${roleColor} cursor-pointer`}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </Link>
          )}

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search medicines..." className="w-64 pl-9" />
          </div>

          {/* Theme Toggle - Neumorphic Style */}
          <ThemeToggleCompact />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
