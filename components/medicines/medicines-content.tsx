"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Pill, ShoppingCart, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { medicinesApi } from "@/lib/api/medicines.api"
import { categoriesApi } from "@/lib/api/categories.api"
import { getMedicineImage } from "@/lib/medicine-images"
import type { Medicine, Category } from "@/types"
import Image from "next/image"

export function MedicinesContent() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [page, setPage] = useState(1)
  const pageSize = 12

  // Fetch categories
  const { data: categoriesResponse } = useSWR(
    "categories",
    () => categoriesApi.getAll()
  )

  // Fetch medicines with filters
  const { data: medicinesResponse, error } = useSWR(
    ["medicines", page, search, categoryFilter],
    () => medicinesApi.getAll({
      pageNumber: page,
      pageSize,
      searchTerm: search || undefined,
      categoryId: categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
    })
  )

  const handleAddToCart = async (medicineId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineId, quantity: 1 }),
      })
      alert("Added to cart!")
    } catch {
      alert("Please sign in to add items to cart")
    }
  }

  const categories = categoriesResponse?.value || []
  const medicines = medicinesResponse?.items || []
  const isLoading = !medicinesResponse && !error

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
                  {categories.map((cat: Category) => (
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
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Loading medicines...</div>
        ) : (
          medicines.map((medicine: Medicine) => (
            <Card key={medicine.id} className="overflow-hidden group">
              <div className="aspect-square bg-secondary/50 flex items-center justify-center relative overflow-hidden">
                <Image 
                  src={getMedicineImage(medicine.name, medicine.categoryName, medicine.imageUrl)} 
                  alt={medicine.name} 
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                {medicine.isPrescriptionRequired && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Rx Required
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">{medicine.name}</h3>
                    <p className="text-xs text-muted-foreground">{medicine.categoryName || "Uncategorized"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {medicine.description || medicine.genericName || "No description available"}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-lg font-bold text-foreground">${medicine.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {medicine.stock}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(medicine.id)}
                      disabled={medicine.stock === 0}
                    >
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && medicines.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No medicines found</p>
            <p className="text-sm text-muted-foreground">
              {error ? "Failed to load medicines. Please try again." : "Try adjusting your search or filters"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {medicinesResponse && medicinesResponse.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage((p) => Math.max(1, p - 1))} 
            disabled={!medicinesResponse.hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {medicinesResponse.pageNumber} of {medicinesResponse.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!medicinesResponse.hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
