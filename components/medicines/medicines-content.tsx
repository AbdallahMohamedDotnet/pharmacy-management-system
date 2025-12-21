"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Pill, ShoppingCart, Plus, ChevronLeft, ChevronRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MedicinesContent() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [page, setPage] = useState(1)

  const { data: categories } = useSWR("/api/categories", fetcher)
  const { data: medicines, mutate } = useSWR(
    `/api/medicines?page=${page}&limit=12${search ? `&search=${search}` : ""}${categoryFilter && categoryFilter !== "all" ? `&category_id=${categoryFilter}` : ""}`,
    fetcher,
  )

  const handleAddToCart = async (medicineId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine_id: medicineId, quantity: 1 }),
      })
      alert("Added to cart!")
    } catch {
      alert("Please sign in to add items to cart")
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.data?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {medicines?.data?.map((medicine: any) => (
          <Card key={medicine.id} className="overflow-hidden group">
            <div className="aspect-square bg-secondary/50 flex items-center justify-center relative">
              <Pill className="h-16 w-16 text-primary/30" />
              {medicine.requires_prescription && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Rx Required
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-foreground line-clamp-1">{medicine.name}</h3>
                  <p className="text-xs text-muted-foreground">{medicine.categories?.name || "Uncategorized"}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {medicine.description || "No description available"}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-lg font-bold text-foreground">${medicine.price}</p>
                    <p className="text-xs text-muted-foreground">Stock: {medicine.stock_quantity}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(medicine.id)}
                    disabled={medicine.stock_quantity === 0}
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {medicines?.data?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No medicines found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or run the seed script</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {medicines?.pagination && medicines.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {medicines.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(medicines.pagination.totalPages, p + 1))}
            disabled={page === medicines.pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
