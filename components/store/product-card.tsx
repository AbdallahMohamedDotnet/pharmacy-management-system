"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Medicine {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
  requires_prescription: boolean
  stock_quantity: number
  categories?: { name: string }
}

interface ProductCardProps {
  product: Medicine
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (product.requires_prescription) return
    setIsAdding(true)
    onAddToCart?.(product.id)
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md">
      {/* Wishlist button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-colors hover:bg-white"
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
        {product.requires_prescription && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            Rx Required
          </Badge>
        )}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            Low Stock
          </Badge>
        )}
        {product.stock_quantity === 0 && (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={
            product.image_url ||
            `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)} medicine`
          }
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.categories && <span className="mb-1 text-xs font-medium text-primary">{product.categories.name}</span>}
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
            {product.requires_prescription ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/prescriptions" className="gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Rx
                </Link>
              </Button>
            ) : (
              <Button size="sm" onClick={handleAddToCart} disabled={product.stock_quantity === 0 || isAdding}>
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
