import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content"

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <Header title="Admin Dashboard" description="System overview and management" />
      <AdminDashboardContent />
    </AppShell>
  )
}
