"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, apiClient } from "@/lib/api"
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch {
      setUser(null)
      apiClient.logout()
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      if (token) {
        await refreshUser()
      }
      setIsLoading(false)
    }
    initAuth()
  }, [refreshUser])

  const login = async (data: LoginRequest) => {
    const response: AuthResponse = await authApi.login(data)
    apiClient.saveTokens(response.accessToken, response.refreshToken)
    setUser({
      id: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      isActive: true,
      roles: response.roles,
      createdAt: new Date().toISOString(),
    })
  }

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await authApi.register(data)
    apiClient.saveTokens(response.accessToken, response.refreshToken)
    setUser({
      id: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      isActive: true,
      roles: response.roles,
      createdAt: new Date().toISOString(),
    })
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
