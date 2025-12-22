"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, Star, AlertCircle } from "lucide-react"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { medicinesApi } from "@/lib/api"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import type { Medicine } from "@/types"
import { getMedicineImage } from "@/lib/medicine-images"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await medicinesApi.getById(id)
        setProduct(data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product || product.isPrescriptionRequired) return
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      router.push("/auth/login")
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart({ medicineId: product.id, quantity })
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
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
      <div className="flex min-h-screen flex-col bg-background">
        <StoreHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-2 text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist.</p>
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
    <div className="flex min-h-screen flex-col bg-background">
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
                <Image
                  src={getMedicineImage(product.name, product.categoryName, product.imageUrl)}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              {product.categoryName && <Badge variant="secondary">{product.categoryName}</Badge>}

              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.genericName && <p className="text-muted-foreground">Generic: {product.genericName}</p>}

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

              {product.isPrescriptionRequired && (
                <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">Prescription Required</p>
                    <p className="text-sm">
                      This medicine requires a valid prescription. Please upload your prescription to purchase.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground">{product.description || "No description available."}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.strength && (
                  <div>
                    <span className="text-muted-foreground">Strength:</span>
                    <span className="ml-2 font-medium">{product.strength}</span>
                  </div>
                )}
                {product.dosageForm && (
                  <div>
                    <span className="text-muted-foreground">Form:</span>
                    <span className="ml-2 font-medium">{product.dosageForm}</span>
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
                {product.stock > 10 ? (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    In Stock ({product.stock} available)
                  </span>
                ) : product.stock > 0 ? (
                  <span className="text-sm text-amber-600 dark:text-amber-400">Only {product.stock} left in stock</span>
                ) : (
                  <span className="text-sm text-red-600 dark:text-red-400">Out of Stock</span>
                )}
              </div>

              {/* Quantity selector and Add to cart */}
              {!product.isPrescriptionRequired && product.stock > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-lg border">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAddingToCart ? "Adding..." : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
                  </Button>
                </div>
              )}

              {product.isPrescriptionRequired && (
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
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>{product.description || "No detailed description available for this product."}</p>
                </div>
              </TabsContent>
              <TabsContent value="usage" className="mt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
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
