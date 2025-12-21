"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, Star, AlertCircle } from "lucide-react"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Medicine {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
  requires_prescription: boolean
  stock_quantity: number
  dosage: string | null
  manufacturer: string | null
  categories?: { name: string }
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/medicines/${id}`)
        const data = await res.json()
        setProduct(data.data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <StoreHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <StoreFooter />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <StoreHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => router.push("/shop")}>
              Back to Shop
            </Button>
          </div>
        </main>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-secondary/30">
                <img
                  src={
                    product.image_url ||
                    `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)} medicine`
                  }
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              {product.categories && <Badge variant="secondary">{product.categories.name}</Badge>}

              <h1 className="text-3xl font-bold">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(128 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</div>

              {product.requires_prescription && (
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-amber-800">
                  <AlertCircle className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">Prescription Required</p>
                    <p className="text-sm">
                      This medicine requires a valid prescription. Please upload your prescription to purchase.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground">{product.description || "No description available."}</p>

              {/* Dosage and manufacturer */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.dosage && (
                  <div>
                    <span className="text-muted-foreground">Dosage:</span>
                    <span className="ml-2 font-medium">{product.dosage}</span>
                  </div>
                )}
                {product.manufacturer && (
                  <div>
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="ml-2 font-medium">{product.manufacturer}</span>
                  </div>
                )}
              </div>

              {/* Stock status */}
              <div>
                {product.stock_quantity > 10 ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : product.stock_quantity > 0 ? (
                  <span className="text-sm text-amber-600">Only {product.stock_quantity} left in stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Quantity selector and Add to cart */}
              {!product.requires_prescription && product.stock_quantity > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-lg border">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="flex-1">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              )}

              {product.requires_prescription && (
                <Button size="lg" className="w-full" asChild>
                  <Link href="/prescriptions">Upload Prescription to Order</Link>
                </Button>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 border-t pt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">100% Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="usage">Usage Instructions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews (128)</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{product.description || "No detailed description available for this product."}</p>
                </div>
              </TabsContent>
              <TabsContent value="usage" className="mt-6">
                <div className="prose max-w-none">
                  <p>
                    Please follow the dosage instructions provided on the packaging or as prescribed by your healthcare
                    provider. Consult your doctor if symptoms persist.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Verified Buyer</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Great product! Works exactly as described. Fast delivery and good packaging.
                      </p>
                      <span className="mt-2 block text-xs text-muted-foreground">Posted 2 days ago</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
