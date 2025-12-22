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
import { ImageUpload } from "@/components/ui/image-upload"
import { 
  Pill, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  AlertTriangle,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  categoryId?: string
  categoryName?: string
  requiresPrescription?: boolean
  isPrescriptionRequired?: boolean
  isActive?: boolean
  imageUrl?: string
}

interface CategoryData {
  id: string
  name: string
}

// Helper functions to safely get stock values
const getStock = (medicine: MedicineData): number => medicine.stockQuantity ?? medicine.stock ?? 0
const getMinStock = (medicine: MedicineData): number => medicine.minStockLevel ?? 10
const isLowStock = (medicine: MedicineData): boolean => getStock(medicine) < getMinStock(medicine)

export function AdminMedicinesContent() {
  const [medicines, setMedicines] = useState<MedicineData[]>([])
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [editingMedicine, setEditingMedicine] = useState<MedicineData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [medicineToDelete, setMedicineToDelete] = useState<MedicineData | null>(null)

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
    isActive: true,
    imageUrl: ""
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
      setTotalItems(response.totalCount || 0)
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
      stockQuantity: medicine.stockQuantity ?? medicine.stock ?? 0,
      minStockLevel: medicine.minStockLevel || 10,
      categoryId: medicine.categoryId || "",
      requiresPrescription: medicine.requiresPrescription ?? medicine.isPrescriptionRequired ?? false,
      isActive: medicine.isActive ?? true,
      imageUrl: medicine.imageUrl || ""
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
      isActive: true,
      imageUrl: ""
    })
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        await medicinesApi.create(formData)
        toast.success("Medicine created successfully")
      } else if (editingMedicine) {
        await medicinesApi.update(editingMedicine.id, formData)
        toast.success("Medicine updated successfully")
      }
      setIsDialogOpen(false)
      fetchMedicines()
    } catch (error) {
      console.error("Error saving medicine:", error)
      toast.error("Failed to save medicine")
    }
  }

  const handleDelete = async () => {
    if (!medicineToDelete) return
    try {
      await medicinesApi.delete(medicineToDelete.id)
      toast.success("Medicine deleted successfully")
      setIsDeleting(false)
      setMedicineToDelete(null)
      fetchMedicines()
    } catch (error) {
      console.error("Error deleting medicine:", error)
      toast.error("Failed to delete medicine")
    }
  }

  const toggleActive = async (medicine: MedicineData) => {
    try {
      await medicinesApi.update(medicine.id, { isActive: !(medicine.isActive ?? true) })
      toast.success(`Medicine ${(medicine.isActive ?? true) ? 'deactivated' : 'activated'}`)
      fetchMedicines()
    } catch (error) {
      console.error("Error toggling medicine status:", error)
      toast.error("Failed to update medicine status")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medicines Management</h1>
          <p className="text-muted-foreground">Manage all medicines in the system</p>
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {medicines.filter(m => m.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {medicines.filter(m => isLowStock(m)).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Prescription Only</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {medicines.filter(m => m.requiresPrescription ?? m.isPrescriptionRequired).length}
            </div>
          </CardContent>
        </Card>
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

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Medicines</CardTitle>
          <CardDescription>
            Showing {medicines.length} of {totalItems} medicines
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
                      {medicine.brand} • {medicine.genericName} • {medicine.categoryName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-primary">${medicine.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {isLowStock(medicine) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge 
                        variant={getStock(medicine) === 0 ? "destructive" : 
                                 isLowStock(medicine) ? "outline" : "secondary"}
                        className={isLowStock(medicine) && getStock(medicine) > 0 ? "border-red-300 text-red-600" : ""}
                      >
                        Stock: {getStock(medicine)}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(medicine)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(medicine)}>
                        {(medicine.isActive ?? true) ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => {
                          setMedicineToDelete(medicine)
                          setIsDeleting(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              {isCreating ? "Add a new medicine to the inventory" : "Update medicine details"}
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

            {/* Image Upload Section */}
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({...formData, imageUrl: url})}
            />

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{medicineToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
