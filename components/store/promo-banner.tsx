import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12">
        <div className="relative z-10 max-w-xl">
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
            Limited Time Offer
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">20% Off on First Order</h2>
          <p className="mt-3 text-white/80">Use code FIRST20 at checkout. Valid for new customers only.</p>
          <Button size="lg" variant="secondary" className="mt-6" asChild>
            <Link href="/shop">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
      </div>
    </section>
  )
}
