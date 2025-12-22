"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pill, Heart, Stethoscope, Sparkles, Baby, Eye, Leaf, Badge as Bandage } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { categoriesApi } from "@/lib/api"
import type { Category } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  "Pain Relief": Pill,
  Vitamins: Sparkles,
  "Cold & Flu": Stethoscope,
  Digestive: Leaf,
  "First Aid": Bandage,
  "Skin Care": Heart,
  "Eye Care": Eye,
  "Baby Care": Baby,
}

const colorMap: Record<string, string> = {
  "Pain Relief": "bg-red-500/10 text-red-500 dark:bg-red-500/20",
  Vitamins: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
  "Cold & Flu": "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  Digestive: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
  "First Aid": "bg-pink-500/10 text-pink-500 dark:bg-pink-500/20",
  "Skin Care": "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
  "Eye Care": "bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20",
  "Baby Care": "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoriesApi.getAll({ pageSize: 8 })
        setCategories(response.value || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 rounded-xl bg-card p-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = iconMap[category.name] || Pill
            const color = colorMap[category.name] || "bg-primary/10 text-primary"
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-medium">{category.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
