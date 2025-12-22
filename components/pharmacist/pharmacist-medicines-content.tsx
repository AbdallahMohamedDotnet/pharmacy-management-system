"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Pill, 
  Search, 
  Plus, 
  Edit, 
  AlertTriangle,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { medicinesApi, categoriesApi } from "@/lib/api"
import { toast } from "sonner"
import { getMedicineImage } from "@/lib/medicine-images"
import Image from "next/image"

interface MedicineData {
  id: string
  name: string
  genericName?: string
  brand?: string
  description?: string
  price: number
  stockQuantity?: number
  stock?: number
  minStockLevel?: number
  categoryId: string
  categoryName?: string
  requiresPrescription?: boolean
  isPrescriptionRequired?: boolean
  isActive: boolean
  imageUrl?: string | null
}

interface CategoryData {
  id: string
  name: string
}

// Helper functions to safely get stock values
const getStock = (medicine: MedicineData): number => medicine.stockQuantity ?? medicine.stock ?? 0
const getMinStock = (medicine: MedicineData): number => medicine.minStockLevel ?? 10
const isLowStock = (medicine: MedicineData): boolean => getStock(medicine) < getMinStock(medicine)

export function PharmacistMedicinesContent() {
  const [medicines, setMedicines] = useState<MedicineData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingMedicine, setEditingMedicine] = useState<MedicineData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brand: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    minStockLevel: 10,
    categoryId: "",
    requiresPrescription: false,
    isActive: true
  })

  const fetchMedicines = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        pageNumber: currentPage,
        pageSize: 10
      }
      if (searchTerm) params.search = searchTerm
      if (selectedCategory && selectedCategory !== "all") params.categoryId = selectedCategory

      const response = await medicinesApi.getAll(params)
      setMedicines((response.items || []) as MedicineData[])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Error fetching medicines:", error)
      toast.error("Failed to load medicines")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories((response.value || []) as CategoryData[])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMedicines()
  }, [currentPage, selectedCategory])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchMedicines()
  }

  const openEditDialog = (medicine: MedicineData) => {
    setEditingMedicine(medicine)
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName || "",
      brand: medicine.brand || "",
      description: medicine.description || "",
      price: medicine.price,
      stockQuantity: medicine.stockQuantity || medicine.stock || 0,
      minStockLevel: medicine.minStockLevel || 10,
      categoryId: medicine.categoryId,
      requiresPrescription: medicine.requiresPrescription || medicine.isPrescriptionRequired || false,
      isActive: medicine.isActive
    })
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingMedicine(null)
    setFormData({
      name: "",
      genericName: "",
      brand: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      minStockLevel: 10,
      categoryId: "",
      requiresPrescription: false,
      isActive: true
    })
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        await medicinesApi.create(formData as any)
        toast.success("Medicine created successfully")
      } else if (editingMedicine) {
        await medicinesApi.update(editingMedicine.id, formData as any)
        toast.success("Medicine updated successfully")
      }
      setIsDialogOpen(false)
      fetchMedicines()
    } catch (error) {
      console.error("Error saving medicine:", error)
      toast.error("Failed to save medicine")
    }
  }

  const handleUpdateStock = async (medicineId: string, newStock: number) => {
    try {
      await medicinesApi.update(medicineId, { stock: newStock } as any)
      toast.success("Stock updated successfully")
      fetchMedicines()
    } catch (error) {
      console.error("Error updating stock:", error)
      toast.error("Failed to update stock")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medicines Management</h1>
          <p className="text-muted-foreground">Manage medicine inventory and details</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchMedicines} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicines List */}
      <Card>
        <CardHeader>
          <CardTitle>Medicines Inventory</CardTitle>
          <CardDescription>
            {medicines.length} medicines found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={medicine.imageUrl || getMedicineImage(medicine.name, medicine.categoryName)}
                      alt={medicine.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{medicine.name}</h3>
                      {medicine.requiresPrescription && (
                        <Badge variant="outline" className="text-orange-600">Rx</Badge>
                      )}
                      {!medicine.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {medicine.brand} • {medicine.categoryName}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      ${medicine.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {isLowStock(medicine) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge 
                          variant={getStock(medicine) === 0 ? "destructive" : 
                                   isLowStock(medicine) ? "outline" : "secondary"}
                          className={isLowStock(medicine) ? "border-red-300 text-red-600" : ""}
                        >
                          Stock: {getStock(medicine)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {getMinStock(medicine)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(medicine)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No medicines found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Add New Medicine" : "Edit Medicine"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Add a new medicine to the inventory" : "Update medicine details and stock"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Medicine name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genericName">Generic Name</Label>
                <Input
                  id="genericName"
                  value={formData.genericName}
                  onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                  placeholder="Generic name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Brand name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData({...formData, categoryId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Medicine description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Min Stock Level</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  min="0"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({...formData, minStockLevel: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={(e) => setFormData({...formData, requiresPrescription: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Requires Prescription</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? "Create Medicine" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
