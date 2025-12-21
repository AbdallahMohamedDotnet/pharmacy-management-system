import Link from "next/link"
import { Pill, Heart, Stethoscope, Sparkles, Baby, Eye, Leaf, Badge as Bandage } from "lucide-react"

const categories = [
  { name: "Pain Relief", icon: Pill, href: "/shop?category=1", color: "bg-red-100 text-red-600" },
  { name: "Vitamins", icon: Sparkles, href: "/shop?category=2", color: "bg-amber-100 text-amber-600" },
  { name: "Cold & Flu", icon: Stethoscope, href: "/shop?category=3", color: "bg-blue-100 text-blue-600" },
  { name: "Digestive", icon: Leaf, href: "/shop?category=4", color: "bg-green-100 text-green-600" },
  { name: "First Aid", icon: Bandage, href: "/shop?category=5", color: "bg-pink-100 text-pink-600" },
  { name: "Skin Care", icon: Heart, href: "/shop?category=6", color: "bg-purple-100 text-purple-600" },
  { name: "Eye Care", icon: Eye, href: "/shop?category=7", color: "bg-cyan-100 text-cyan-600" },
  { name: "Baby Care", icon: Baby, href: "/shop?category=8", color: "bg-orange-100 text-orange-600" },
]

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${category.color}`}>
              <category.icon className="h-7 w-7" />
            </div>
            <span className="text-center text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
