import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { OrdersManagementContent } from "@/components/admin/orders-management-content"

export default function AdminOrdersPage() {
  return (
    <AppShell>
      <Header title="Orders Management" description="View and manage all customer orders" />
      <OrdersManagementContent />
    </AppShell>
  )
}
