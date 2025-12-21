import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function HomePage() {
  return (
    <AppShell>
      <Header title="Dashboard" description="Overview of your pharmacy" />
      <DashboardContent />
    </AppShell>
  )
}
