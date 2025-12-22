import { AppShell } from "@/components/layout/app-shell"
import { RoleDashboardSelector } from "@/components/dashboard/role-dashboard-selector"

export default function DashboardPage() {
  return (
    <AppShell>
      <RoleDashboardSelector />
    </AppShell>
  )
}
