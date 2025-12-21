import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { HeroSection } from "@/components/store/hero-section"
import { CategoryGrid } from "@/components/store/category-grid"
import { FeaturedProducts } from "@/components/store/featured-products"
import { PromoBanner } from "@/components/store/promo-banner"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
      </main>
      <StoreFooter />
    </div>
  )
}
