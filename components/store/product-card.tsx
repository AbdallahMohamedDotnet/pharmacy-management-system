"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Medicine } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { getMedicineImage } from "@/lib/medicine-images"

interface ProductCardProps {
  product: Medicine
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async () => {
    if (product.isPrescriptionRequired) return
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    setIsAdding(true)
    try {
      await addToCart({ medicineId: product.id, quantity: 1 })
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md">
      {/* Wishlist button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground",
          )}
        />
      </button>

      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {product.isPrescriptionRequired && (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Rx Required
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
            Low Stock
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="aspect-square overflow-hidden bg-secondary/30">
        <Image
          src={getMedicineImage(product.name, product.categoryName, product.imageUrl)}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.categoryName && <span className="mb-1 text-xs font-medium text-primary">{product.categoryName}</span>}
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold hover:text-primary">{product.name}</h3>
        </Link>

        {/* Rating (placeholder) */}
        <div className="mt-1 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">(128)</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.isPrescriptionRequired ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/prescriptions" className="gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Rx
                </Link>
              </Button>
            ) : (
              <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0 || isAdding}>
                <ShoppingCart className="mr-1 h-4 w-4" />
                {isAdding ? "Adding..." : "Add"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
