"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CategoriesContent() {
  const { data: categories } = useSWR("/api/categories", fetcher)

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{categories?.count || 0} categories available</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories?.data?.map((category: any) => (
          <Card key={category.id} className="group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg text-foreground mb-1">{category.name}</CardTitle>
              <CardDescription className="line-clamp-2 mb-4">
                {category.description || "No description available"}
              </CardDescription>
              <Link
                href={`/medicines?category=${category.id}`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                View medicines
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories?.data?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No categories found</p>
            <p className="text-sm text-muted-foreground">Run the seed script to add sample categories</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
