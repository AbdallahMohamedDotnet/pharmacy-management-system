import { apiClient } from './client'

export interface PermissionMap {
  name: string
  displayName: string
  description: string
  module: string
  icon: string
}

export interface RoleMap {
  name: string
  displayName: string
  description: string
  icon: string
  color: string
  badgeColor: string
  priority: number
  permissions: PermissionMap[]
}

export interface ModuleMap {
  name: string
  displayName: string
  icon: string
  color: string
}

export interface OrderStatusMap {
  value: number
  name: string
  displayName: string
  icon: string
  color: string
  badgeColor: string
}

export interface PaymentStatusMap {
  value: number
  name: string
  displayName: string
  icon: string
  color: string
}

export interface PaymentProviderMap {
  value: number
  name: string
  displayName: string
  icon: string
}

export interface CompleteMap {
  roles: RoleMap[]
  modules: ModuleMap[]
  orderStatuses: OrderStatusMap[]
  paymentStatuses: PaymentStatusMap[]
  paymentProviders: PaymentProviderMap[]
}

// Default maps for fallback when API is unavailable
export const defaultOrderStatuses: OrderStatusMap[] = [
  { value: 1, name: 'PendingPayment', displayName: 'Pending Payment', icon: 'clock', color: '#F59E0B', badgeColor: 'yellow' },
  { value: 2, name: 'Paid', displayName: 'Paid', icon: 'check', color: '#10B981', badgeColor: 'green' },
  { value: 4, name: 'Processing', displayName: 'Processing', icon: 'refresh', color: '#3B82F6', badgeColor: 'blue' },
  { value: 8, name: 'Shipped', displayName: 'Shipped', icon: 'truck', color: '#8B5CF6', badgeColor: 'purple' },
  { value: 16, name: 'Delivered', displayName: 'Delivered', icon: 'check-circle', color: '#10B981', badgeColor: 'green' },
  { value: 32, name: 'Cancelled', displayName: 'Cancelled', icon: 'x-circle', color: '#EF4444', badgeColor: 'red' },
  { value: 64, name: 'Refunded', displayName: 'Refunded', icon: 'receipt-refund', color: '#6B7280', badgeColor: 'gray' },
  { value: 128, name: 'PrescriptionPending', displayName: 'Prescription Pending', icon: 'document-text', color: '#F59E0B', badgeColor: 'yellow' },
  { value: 256, name: 'PrescriptionApproved', displayName: 'Prescription Approved', icon: 'document-check', color: '#10B981', badgeColor: 'green' },
  { value: 512, name: 'PrescriptionRejected', displayName: 'Prescription Rejected', icon: 'document-remove', color: '#EF4444', badgeColor: 'red' },
]

export const defaultPaymentStatuses: PaymentStatusMap[] = [
  { value: 0, name: 'Pending', displayName: 'Pending', icon: 'clock', color: '#F59E0B' },
  { value: 1, name: 'Success', displayName: 'Successful', icon: 'check-circle', color: '#10B981' },
  { value: 2, name: 'Failed', displayName: 'Failed', icon: 'x-circle', color: '#EF4444' },
  { value: 3, name: 'Refunded', displayName: 'Refunded', icon: 'receipt-refund', color: '#6B7280' },
  { value: 4, name: 'Cancelled', displayName: 'Cancelled', icon: 'ban', color: '#6B7280' },
]

export const defaultRoles: RoleMap[] = [
  {
    name: 'Admin',
    displayName: 'Administrator',
    description: 'System administrator with full access to all features',
    icon: 'shield-check',
    color: '#DC2626',
    badgeColor: 'red',
    priority: 1,
    permissions: []
  },
  {
    name: 'Pharmacist',
    displayName: 'Pharmacist',
    description: 'Pharmacist with order management and medicine data entry',
    icon: 'beaker',
    color: '#2563EB',
    badgeColor: 'blue',
    priority: 2,
    permissions: []
  },
  {
    name: 'Customer',
    displayName: 'Customer',
    description: 'Regular customer who can browse and purchase medicines',
    icon: 'user',
    color: '#16A34A',
    badgeColor: 'green',
    priority: 3,
    permissions: []
  }
]

export const mapsApi = {
  // Get all maps at once
  getAll: async (): Promise<CompleteMap> => {
    try {
      const response = await apiClient.get<CompleteMap>('/maps')
      return response
    } catch (error) {
      // Return default maps if API fails
      return {
        roles: defaultRoles,
        modules: [],
        orderStatuses: defaultOrderStatuses,
        paymentStatuses: defaultPaymentStatuses,
        paymentProviders: []
      }
    }
  },

  // Get roles map
  getRoles: async (): Promise<RoleMap[]> => {
    try {
      const response = await apiClient.get<RoleMap[]>('/maps/roles')
      return response
    } catch (error) {
      return defaultRoles
    }
  },

  // Get order statuses map
  getOrderStatuses: async (): Promise<OrderStatusMap[]> => {
    try {
      const response = await apiClient.get<OrderStatusMap[]>('/maps/order-statuses')
      return response
    } catch (error) {
      return defaultOrderStatuses
    }
  },

  // Get payment statuses map
  getPaymentStatuses: async (): Promise<PaymentStatusMap[]> => {
    try {
      const response = await apiClient.get<PaymentStatusMap[]>('/maps/payment-statuses')
      return response
    } catch (error) {
      return defaultPaymentStatuses
    }
  },

  // Get modules map
  getModules: async (): Promise<ModuleMap[]> => {
    try {
      const response = await apiClient.get<ModuleMap[]>('/maps/modules')
      return response
    } catch (error) {
      return []
    }
  },

  // Get payment providers map
  getPaymentProviders: async (): Promise<PaymentProviderMap[]> => {
    try {
      const response = await apiClient.get<PaymentProviderMap[]>('/maps/payment-providers')
      return response
    } catch (error) {
      return []
    }
  }
}

// Helper function to get order status info by value
export const getOrderStatusInfo = (value: number, statuses: OrderStatusMap[] = defaultOrderStatuses) => {
  return statuses.find(s => s.value === value) || {
    value,
    name: 'Unknown',
    displayName: 'Unknown',
    icon: 'question-mark-circle',
    color: '#6B7280',
    badgeColor: 'gray'
  }
}

// Helper function to get payment status info by value
export const getPaymentStatusInfo = (value: number, statuses: PaymentStatusMap[] = defaultPaymentStatuses) => {
  return statuses.find(s => s.value === value) || {
    value,
    name: 'Unknown',
    displayName: 'Unknown',
    icon: 'question-mark-circle',
    color: '#6B7280'
  }
}

// Helper to check if user has permission
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(permission) || userPermissions.includes('*')
}

// Helper to get badge color class
export const getBadgeColorClass = (badgeColor: string): string => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border-red-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
  }
  return colorMap[badgeColor] || colorMap.gray
}
