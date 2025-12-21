import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { AnalyticsContent } from "@/components/admin/analytics-content"

export default function AnalyticsPage() {
  return (
    <AppShell>
      <Header title="Analytics" description="View business metrics and insights" />
      <AnalyticsContent />
    </AppShell>
  )
}
