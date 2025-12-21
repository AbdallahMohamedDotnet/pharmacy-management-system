import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { ApiTestDashboard } from "@/components/api-test-dashboard"

export default function TestPage() {
  return (
    <AppShell>
      <Header title="API Testing" description="Test all API endpoints" />
      <div className="p-4 lg:p-6">
        <ApiTestDashboard />
      </div>
    </AppShell>
  )
}
