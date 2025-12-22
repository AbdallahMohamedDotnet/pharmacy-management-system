// ============================================
// Auth Types
// ============================================
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface AuthResponse {
  userId: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  roles: string[]
  permissions: string[]
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  isActive: boolean
  roles: string[]
  createdAt: string
}

// ============================================
// Medicine Types
// ============================================
export interface Medicine {
  id: string
  name: string
  genericName: string
  description: string
  manufacturer: string
  price: number
  stock: number
  isPrescriptionRequired: boolean
  imageUrl: string | null
  categoryId: string
  categoryName: string
  dosageForm: string
  strength: string
  expiryDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MedicineSearchParams {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  isPrescriptionRequired?: boolean
  inStock?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// ============================================
// Category Types
// ============================================
export interface Category {
  id: string
  name: string
  description: string
  imageUrl: string | null
  parentCategoryId: string | null
  displayOrder: number
  isActive: boolean
  medicineCount?: number
  createdAt: string
}

// ============================================
// Cart Types
// ============================================
export interface CartItem {
  id: string
  medicineId: string
  medicineName: string
  medicineImage: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  availableStock: number
  isPrescriptionRequired: boolean
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  totalItems: number
  hasPrescriptionItems: boolean
}

export interface AddToCartRequest {
  medicineId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// ============================================
// Order Types
// ============================================
export enum OrderStatus {
  PendingPayment = 1,
  Paid = 2,
  Processing = 4,
  Shipped = 8,
  Delivered = 16,
  Cancelled = 32,
}

export interface OrderItem {
  id: string
  medicineId: string
  medicineName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  isPrescriptionRequired: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  totalAmount: number
  shippingAddress: ShippingAddress
  items: OrderItem[]
  prescriptionId?: string
  paymentId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ShippingAddress {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress
  paymentMethodId?: string
  prescriptionId?: string
  notes?: string
}

// ============================================
// Payment Types
// ============================================
export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "bank"
  cardLast4?: string
  cardBrand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  transactionId?: string
  createdAt: string
}

// ============================================
// Audit Log Types
// ============================================
export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress: string
  userAgent: string
  createdAt: string
}

// ============================================
// Pagination Types
// ============================================
export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
