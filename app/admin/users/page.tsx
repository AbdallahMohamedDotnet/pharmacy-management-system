import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { UsersManagementContent } from "@/components/admin/users-management-content"

export default function UsersPage() {
  return (
    <AppShell>
      <Header title="User Management" description="Manage system users and permissions" />
      <UsersManagementContent />
    </AppShell>
  )
}
