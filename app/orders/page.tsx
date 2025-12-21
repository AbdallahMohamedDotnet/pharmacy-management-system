import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { OrdersContent } from "@/components/orders/orders-content"

export default function OrdersPage() {
  return (
    <AppShell>
      <Header title="Orders" description="View and manage your orders" />
      <OrdersContent />
    </AppShell>
  )
}
