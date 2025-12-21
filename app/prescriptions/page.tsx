import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { PrescriptionsContent } from "@/components/prescriptions/prescriptions-content"

export default function PrescriptionsPage() {
  return (
    <AppShell>
      <Header title="Prescriptions" description="Upload and manage your prescriptions" />
      <PrescriptionsContent />
    </AppShell>
  )
}
