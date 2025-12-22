"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Grid3X3, List, X } from "lucide-react"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { medicinesApi, categoriesApi } from "@/lib/api"
import type { Medicine, Category } from "@/types"

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Medicine[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [noPrescriptionOnly, setNoPrescriptionOnly] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoriesApi.getAll({ pageSize: 20 })
        setCategories(response.value || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const response = await medicinesApi.getAll({
          pageNumber: currentPage,
          pageSize: 12,
          searchTerm: search || undefined,
          categoryId: selectedCategory || undefined,
          inStock: inStockOnly || undefined,
          isPrescriptionRequired: noPrescriptionOnly ? false : undefined,
          sortBy:
            sortBy === "price-asc"
              ? "price"
              : sortBy === "price-desc"
                ? "price"
                : sortBy === "name"
                  ? "name"
                  : undefined,
          sortOrder: sortBy === "price-desc" ? "desc" : "asc",
        })
        setProducts(response.items || [])
        setTotalPages(response.totalPages || 1)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentPage, search, selectedCategory, sortBy, inStockOnly, noPrescriptionOnly])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("")
    setInStockOnly(false)
    setNoPrescriptionOnly(false)
    setCurrentPage(1)
  }

  const hasFilters = search || selectedCategory || inStockOnly || noPrescriptionOnly

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Shop</span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar filters - Desktop */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="mb-3 font-semibold">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`block w-full text-left text-sm ${!selectedCategory ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`block w-full text-left text-sm ${selectedCategory === cat.id ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-3 font-semibold">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(v as boolean)} />
                      <span>In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={noPrescriptionOnly}
                        onCheckedChange={(v) => setNoPrescriptionOnly(v as boolean)}
                      />
                      <span>No Prescription Required</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Mobile filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div>
                          <h3 className="mb-3 font-semibold">Categories</h3>
                          <div className="space-y-2">
                            <button
                              onClick={() => handleCategoryChange("all")}
                              className={`block w-full text-left text-sm ${!selectedCategory ? "font-medium text-primary" : "text-muted-foreground"}`}
                            >
                              All Products
                            </button>
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`block w-full text-left text-sm ${selectedCategory === cat.id ? "font-medium text-primary" : "text-muted-foreground"}`}
                              >
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="border-t pt-6">
                          <h3 className="mb-3 font-semibold">Availability</h3>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(v as boolean)} />
                              <span>In Stock Only</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={noPrescriptionOnly}
                                onCheckedChange={(v) => setNoPrescriptionOnly(v as boolean)}
                              />
                              <span>No Prescription Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View mode */}
                  <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {hasFilters && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {search}
                      <button onClick={() => setSearch("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {inStockOnly && (
                    <Badge variant="secondary" className="gap-1">
                      In Stock
                      <button onClick={() => setInStockOnly(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {noPrescriptionOnly && (
                    <Badge variant="secondary" className="gap-1">
                      No Rx
                      <button onClick={() => setNoPrescriptionOnly(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Clear all
                  </button>
                </div>
              )}

              {/* Products grid */}
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No products found</h3>
                  <p className="mt-1 text-muted-foreground">Try adjusting your search or filters</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
