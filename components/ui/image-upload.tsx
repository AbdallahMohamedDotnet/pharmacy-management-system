"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Link as LinkIcon, 
  X, 
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onFileSelect?: (file: File) => void
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  value, 
  onChange, 
  onFileSelect,
  className,
  disabled = false 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(value)
  const [activeTab, setActiveTab] = useState<string>(value ? "preview" : "upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setActiveTab("preview")

    // If we have an upload handler, use it
    if (onFileSelect) {
      setIsUploading(true)
      onFileSelect(file)
      // Note: The parent component should call onChange with the uploaded URL
      setIsUploading(false)
    } else {
      // For now, just use the object URL as a preview
      // In a real app, you'd upload to a server and get back a URL
      onChange(objectUrl)
    }
  }, [onChange, onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    handleFileChange(file)
  }, [disabled, handleFileChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFileChange(file || null)
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
    setPreviewUrl(url)
    if (url) setActiveTab("preview")
  }

  const handleRemove = () => {
    onChange("")
    setPreviewUrl("")
    setActiveTab("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label>Medicine Image</Label>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" disabled={disabled}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" disabled={disabled}>
            <LinkIcon className="h-4 w-4 mr-2" />
            URL
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!previewUrl}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-3 space-y-3">
          <div className="space-y-2">
            <Input
              placeholder="https://example.com/medicine-image.png"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct link to an image
            </p>
          </div>
          
          {/* Quick URL suggestions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Pill", url: "/images/medicines/medicine-default.svg" },
                { label: "Vitamins", url: "/images/medicines/vitamins.svg" },
                { label: "First Aid", url: "/images/medicines/first-aid.svg" },
                { label: "Skincare", url: "/images/medicines/skincare.svg" },
              ].map((suggestion) => (
                <Button
                  key={suggestion.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUrlChange(suggestion.url)}
                  disabled={disabled}
                  className="text-xs"
                >
                  {suggestion.label}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          {previewUrl ? (
            <div className="relative">
              <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={previewUrl}
                  alt="Medicine preview"
                  fill
                  className="object-contain"
                  onError={() => {
                    setPreviewUrl("/images/medicines/medicine-default.svg")
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2 truncate max-w-full">
                {previewUrl.startsWith("blob:") ? "Uploaded file" : previewUrl}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image selected</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Compact inline version for smaller spaces
export function ImageUploadInline({ 
  value, 
  onChange,
  className,
  disabled = false 
}: Omit<ImageUploadProps, "onFileSelect">) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(value)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    onChange(objectUrl)
  }

  const handleRemove = () => {
    onChange("")
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {previewUrl ? (
        <div className="relative h-16 w-16 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain"
            onError={() => setPreviewUrl("/images/medicines/medicine-default.svg")}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-colors"
          disabled={disabled}
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
      
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Or enter image URL"
          value={value.startsWith("blob:") ? "" : value}
          onChange={(e) => {
            onChange(e.target.value)
            setPreviewUrl(e.target.value)
          }}
          disabled={disabled}
          className="text-sm"
        />
      </div>
    </div>
  )
}
