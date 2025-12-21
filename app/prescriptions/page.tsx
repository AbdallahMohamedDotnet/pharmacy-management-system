import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { PrescriptionsContent } from "@/components/store/prescriptions-content"

export default function PrescriptionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <PrescriptionsContent />
      </main>
      <StoreFooter />
    </div>
  )
}
