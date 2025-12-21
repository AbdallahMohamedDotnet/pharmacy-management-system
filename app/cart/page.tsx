import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { CartContent } from "@/components/store/cart-content"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <CartContent />
      </main>
      <StoreFooter />
    </div>
  )
}
