"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Plus, Upload, Eye, CheckCircle, Clock, XCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/30",
  approved: "bg-success/20 text-success border-success/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
}

export function PrescriptionsContent() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: prescriptions, mutate } = useSWR("/api/prescriptions", fetcher)

  const isUnauthorized = prescriptions?.error === "Unauthorized"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: formData.get("image_url"),
          notes: formData.get("notes"),
        }),
      })
      setIsOpen(false)
      mutate()
    } catch {
      alert("Failed to upload prescription")
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{prescriptions?.data?.length || 0} prescriptions</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
              <DialogDescription>Upload your prescription image for verification</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Prescription Image URL</Label>
                  <Input id="image_url" name="image_url" placeholder="https://example.com/prescription.jpg" required />
                  <p className="text-xs text-muted-foreground">Enter the URL of your prescription image</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" placeholder="Any additional notes for the pharmacist..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prescriptions List */}
      {isUnauthorized ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">Sign in to view prescriptions</p>
            <p className="text-sm text-muted-foreground mb-4">You need to be logged in to manage prescriptions</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      ) : prescriptions?.data?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.data.map((prescription: any) => {
            const StatusIcon = statusIcons[prescription.status] || Clock
            return (
              <Card key={prescription.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className={statusColors[prescription.status] || ""} variant="outline">
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {prescription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-sm text-foreground mb-1">
                    Prescription #{prescription.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <CardDescription className="text-xs mb-3">
                    Uploaded {new Date(prescription.created_at).toLocaleDateString()}
                  </CardDescription>
                  {prescription.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{prescription.notes}</p>
                  )}
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <a href={prescription.image_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      View Image
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No prescriptions yet</p>
            <p className="text-sm text-muted-foreground mb-4">Upload a prescription to order restricted medicines</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
