import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { OrdersContent } from "@/components/store/orders-content"

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <OrdersContent />
      </main>
      <StoreFooter />
    </div>
  )
}
