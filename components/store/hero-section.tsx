import Link from "next/link"
import { ArrowRight, Shield, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Licensed & Verified Pharmacy
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Your Health, <span className="text-primary">Delivered</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Shop quality medicines, vitamins, and health essentials from the comfort of your home. Fast delivery,
              genuine products, expert care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/prescriptions">Upload Prescription</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/pharmacy-medicines-health-products-wellness.jpg"
              alt="Health and wellness products"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Free Delivery</h3>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">100% Genuine</h3>
              <p className="text-sm text-muted-foreground">Certified products</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Expert assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
