"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mapsApi, defaultOrderStatuses, defaultPaymentStatuses, defaultRoles } from "@/lib/api"
import type { CompleteMap, RoleMap, OrderStatusMap, PaymentStatusMap, ModuleMap, PaymentProviderMap } from "@/lib/api"

interface MapsContextType {
  maps: CompleteMap | null
  isLoading: boolean
  roles: RoleMap[]
  orderStatuses: OrderStatusMap[]
  paymentStatuses: PaymentStatusMap[]
  modules: ModuleMap[]
  paymentProviders: PaymentProviderMap[]
  getOrderStatusLabel: (status: number) => string
  getOrderStatusColor: (status: number) => string
  getOrderStatusBadgeColor: (status: number) => string
  getPaymentStatusLabel: (status: number) => string
  refreshMaps: () => Promise<void>
}

const MapsContext = createContext<MapsContextType | undefined>(undefined)

export function MapsProvider({ children }: { children: ReactNode }) {
  const [maps, setMaps] = useState<CompleteMap | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshMaps = async () => {
    try {
      setIsLoading(true)
      const data = await mapsApi.getAll()
      setMaps(data)
    } catch (error) {
      console.error("Failed to load maps:", error)
      // Use defaults on error
      setMaps({
        roles: defaultRoles,
        modules: [],
        orderStatuses: defaultOrderStatuses,
        paymentStatuses: defaultPaymentStatuses,
        paymentProviders: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshMaps()
  }, [])

  const roles = maps?.roles || defaultRoles
  const orderStatuses = maps?.orderStatuses || defaultOrderStatuses
  const paymentStatuses = maps?.paymentStatuses || defaultPaymentStatuses
  const modules = maps?.modules || []
  const paymentProviders = maps?.paymentProviders || []

  const getOrderStatusLabel = (status: number): string => {
    const found = orderStatuses.find(s => s.value === status)
    return found?.displayName || "Unknown"
  }

  const getOrderStatusColor = (status: number): string => {
    const found = orderStatuses.find(s => s.value === status)
    return found?.color || "#6B7280"
  }

  const getOrderStatusBadgeColor = (status: number): string => {
    const found = orderStatuses.find(s => s.value === status)
    return found?.badgeColor || "gray"
  }

  const getPaymentStatusLabel = (status: number): string => {
    const found = paymentStatuses.find(s => s.value === status)
    return found?.displayName || "Unknown"
  }

  return (
    <MapsContext.Provider
      value={{
        maps,
        isLoading,
        roles,
        orderStatuses,
        paymentStatuses,
        modules,
        paymentProviders,
        getOrderStatusLabel,
        getOrderStatusColor,
        getOrderStatusBadgeColor,
        getPaymentStatusLabel,
        refreshMaps
      }}
    >
      {children}
    </MapsContext.Provider>
  )
}

export function useMaps() {
  const context = useContext(MapsContext)
  if (context === undefined) {
    throw new Error("useMaps must be used within a MapsProvider")
  }
  return context
}

// Hook for role-based permissions
export function usePermissions() {
  const { roles } = useMaps()
  
  const getRolePermissions = (roleName: string): string[] => {
    const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase())
    return role?.permissions.map(p => p.name) || []
  }

  const hasPermission = (userRoles: string[], permission: string): boolean => {
    for (const roleName of userRoles) {
      const permissions = getRolePermissions(roleName)
      if (permissions.includes(permission) || permissions.includes('*')) {
        return true
      }
    }
    return false
  }

  const canView = (userRoles: string[], module: string): boolean => {
    return hasPermission(userRoles, `${module}.view`) || hasPermission(userRoles, `${module}.view.own`)
  }

  const canCreate = (userRoles: string[], module: string): boolean => {
    return hasPermission(userRoles, `${module}.create`)
  }

  const canEdit = (userRoles: string[], module: string): boolean => {
    return hasPermission(userRoles, `${module}.edit`)
  }

  const canDelete = (userRoles: string[], module: string): boolean => {
    return hasPermission(userRoles, `${module}.delete`)
  }

  return {
    getRolePermissions,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete
  }
}
