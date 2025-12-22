import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { AuditLogsContent } from "@/components/admin/audit-logs-content"

export default function AuditLogsPage() {
  return (
    <AppShell>
      <Header title="Audit Logs" description="Track all system activities and changes" />
      <AuditLogsContent />
    </AppShell>
  )
}
