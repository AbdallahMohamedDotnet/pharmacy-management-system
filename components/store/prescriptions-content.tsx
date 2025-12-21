"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Upload, Clock, CheckCircle2, XCircle, AlertCircle, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Prescription {
  id: string
  status: string
  notes: string | null
  created_at: string
  image_url: string | null
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-amber-100 text-amber-700", label: "Pending Review" },
  approved: { icon: CheckCircle2, color: "bg-green-100 text-green-700", label: "Approved" },
  rejected: { icon: XCircle, color: "bg-red-100 text-red-700", label: "Rejected" },
  expired: { icon: AlertCircle, color: "bg-gray-100 text-gray-700", label: "Expired" },
}

export function PrescriptionsContent() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  async function fetchPrescriptions() {
    try {
      const res = await fetch("/api/prescriptions")
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setPrescriptions(data.data || [])
      }
    } catch (err) {
      setError("Failed to load prescriptions")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error === "Unauthorized") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">My Prescriptions</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Sign in to manage prescriptions</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Upload and track your prescriptions to order prescription medicines
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">My Prescriptions</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Prescriptions</h1>
          <p className="mt-1 text-muted-foreground">Upload and manage your medical prescriptions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
              <DialogDescription>
                Upload a clear photo of your prescription. Our pharmacist will review it within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="prescription-file">Prescription Image</Label>
                <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed p-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    <Input id="prescription-file" type="file" accept="image/*" className="mt-4" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Any additional information for the pharmacist..." className="mt-2" />
              </div>
              <Button type="submit" className="w-full">
                Submit Prescription
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info banner */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">How it works</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a clear photo of your valid prescription. Our licensed pharmacist will review it within 24 hours.
              Once approved, you can order the prescribed medicines directly from your account.
            </p>
          </div>
        </CardContent>
      </Card>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No prescriptions uploaded</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Upload your first prescription to order prescription medicines
            </p>
            <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription) => {
            const status = statusConfig[prescription.status] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <Card key={prescription.id} className="overflow-hidden">
                <div className="aspect-[4/3] bg-secondary/30">
                  {prescription.image_url ? (
                    <img
                      src={prescription.image_url || "/placeholder.svg"}
                      alt="Prescription"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Prescription #{prescription.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <Badge variant="secondary" className={status.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Uploaded on {formatDate(prescription.created_at)}</p>
                  {prescription.notes && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Notes:</span> {prescription.notes}
                    </p>
                  )}
                  {prescription.status === "approved" && (
                    <Button className="mt-4 w-full" size="sm" asChild>
                      <Link href="/shop?prescription=true">Order Medicines</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
