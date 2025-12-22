// Medicine category to image mapping
// These are placeholder images - replace with actual medicine images in production

export const medicineImages: Record<string, string> = {
  // Pain Relief
  "acetaminophen": "/images/medicines/acetaminophen.svg",
  "ibuprofen": "/images/medicines/ibuprofen.svg",
  "aspirin": "/images/medicines/aspirin.svg",
  "paracetamol": "/images/medicines/acetaminophen.svg",
  "tylenol": "/images/medicines/acetaminophen.svg",
  "advil": "/images/medicines/ibuprofen.svg",
  "motrin": "/images/medicines/ibuprofen.svg",
  
  // Antibiotics
  "amoxicillin": "/images/medicines/amoxicillin.svg",
  "azithromycin": "/images/medicines/azithromycin.svg",
  "antibiotic": "/images/medicines/amoxicillin.svg",
  "penicillin": "/images/medicines/amoxicillin.svg",
  
  // Cold & Flu
  "cold": "/images/medicines/cold-flu.svg",
  "flu": "/images/medicines/cold-flu.svg",
  "cough": "/images/medicines/cold-flu.svg",
  "decongestant": "/images/medicines/cold-flu.svg",
  
  // Vitamins
  "vitamin": "/images/medicines/vitamins.svg",
  "multivitamin": "/images/medicines/vitamins.svg",
  "supplement": "/images/medicines/vitamins.svg",
  
  // Allergy
  "allergy": "/images/medicines/allergy.svg",
  "antihistamine": "/images/medicines/allergy.svg",
  "claritin": "/images/medicines/allergy.svg",
  "zyrtec": "/images/medicines/allergy.svg",
  
  // Digestive
  "antacid": "/images/medicines/digestive.svg",
  "digestive": "/images/medicines/digestive.svg",
  "stomach": "/images/medicines/digestive.svg",
  
  // Default fallback
  "default": "/images/medicines/medicine-default.svg",
}

// Category-based images
export const categoryImages: Record<string, string> = {
  "pain relief": "/images/medicines/ibuprofen.svg",
  "antibiotics": "/images/medicines/amoxicillin.svg",
  "cold & flu": "/images/medicines/cold-flu.svg",
  "vitamins": "/images/medicines/vitamins.svg",
  "allergy": "/images/medicines/allergy.svg",
  "digestive": "/images/medicines/digestive.svg",
  "skin care": "/images/medicines/skincare.svg",
  "first aid": "/images/medicines/first-aid.svg",
  "supplements": "/images/medicines/vitamins.svg",
  "default": "/images/medicines/medicine-default.svg",
}

/**
 * Get image for a medicine based on its name or category
 */
export function getMedicineImage(medicineName?: string, categoryName?: string, fallbackUrl?: string | null): string {
  // If API provides an image URL, use it
  if (fallbackUrl) {
    return fallbackUrl
  }

  // Try to match medicine name
  if (medicineName) {
    const lowerName = medicineName.toLowerCase()
    
    // Check exact matches first
    for (const [key, imagePath] of Object.entries(medicineImages)) {
      if (lowerName.includes(key)) {
        return imagePath
      }
    }
  }

  // Try to match category
  if (categoryName) {
    const lowerCategory = categoryName.toLowerCase()
    const categoryImage = categoryImages[lowerCategory]
    if (categoryImage) {
      return categoryImage
    }
  }

  // Return default
  return medicineImages.default
}

/**
 * Generate a gradient placeholder for a specific medicine
 */
export function getMedicinePlaceholder(medicineId: string): string {
  // Generate a deterministic color based on medicine ID
  const colors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-red-400 to-red-600",
    "from-yellow-400 to-yellow-600",
    "from-teal-400 to-teal-600",
  ]
  
  // Use medicine ID to pick a consistent color
  const hash = medicineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
