import type React from "react"
import { Sidebar } from "./sidebar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  )
}
