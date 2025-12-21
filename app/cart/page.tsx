import { AppShell } from "@/components/layout/app-shell"
import { Header } from "@/components/layout/header"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <AppShell>
      <Header title="Shopping Cart" description="Review and checkout your items" />
      <CartContent />
    </AppShell>
  )
}
