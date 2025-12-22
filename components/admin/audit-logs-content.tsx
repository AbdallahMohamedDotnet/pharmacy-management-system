"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  Eye, 
  Activity,
  User,
  Pill,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock
} from "lucide-react"
import { auditApi } from "@/lib/api"
import { toast } from "sonner"

interface AuditLogData {
  id: string
  userId: string
  userEmail: string
  action: string
  entityType: string
  entityId: string
  oldValues: string | Record<string, unknown> | null
  newValues: string | Record<string, unknown> | null
  ipAddress: string
  userAgent: string
  timestamp?: string
  createdAt?: string
}

const ENTITY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "User", label: "Users" },
  { value: "Medicine", label: "Medicines" },
  { value: "Order", label: "Orders" },
  { value: "Category", label: "Categories" },
  { value: "Cart", label: "Cart" },
]

const ACTIONS = [
  { value: "all", label: "All Actions" },
  { value: "Create", label: "Create" },
  { value: "Update", label: "Update" },
  { value: "Delete", label: "Delete" },
  { value: "Login", label: "Login" },
  { value: "Logout", label: "Logout" },
]

export function AuditLogsContent() {
  const [logs, setLogs] = useState<AuditLogData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [entityType, setEntityType] = useState("all")
  const [action, setAction] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedLog, setSelectedLog] = useState<AuditLogData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await auditApi.getAll({
        pageNumber: page,
        pageSize: 20,
        entityType: entityType !== "all" ? entityType : undefined,
        action: action !== "all" ? action : undefined,
        userId: search || undefined
      })
      setLogs((response.items || []) as AuditLogData[])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
      toast.error("Failed to load audit logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, entityType, action])

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "User": return <User className="h-4 w-4" />
      case "Medicine": return <Pill className="h-4 w-4" />
      case "Order": return <ShoppingCart className="h-4 w-4" />
      case "Category": return <Settings className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Create: "default",
      Update: "secondary",
      Delete: "destructive",
      Login: "outline",
      Logout: "outline",
    }
    return <Badge variant={variants[action] || "outline"}>{action}</Badge>
  }

  const viewLogDetails = (log: AuditLogData) => {
    setSelectedLog(log)
    setIsDetailDialogOpen(true)
  }

  const formatJson = (jsonString: string | null) => {
    if (!jsonString) return "N/A"
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2)
    } catch {
      return jsonString
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
            className="pl-9"
          />
        </div>
        <Select value={entityType} onValueChange={(v) => { setEntityType(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Entity Type" />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchLogs}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Audit Logs
          </CardTitle>
          <CardDescription>Track all system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="hidden lg:grid lg:grid-cols-7 gap-4 px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                <div>Timestamp</div>
                <div>User</div>
                <div>Action</div>
                <div>Entity Type</div>
                <div>Entity ID</div>
                <div>IP Address</div>
                <div className="text-right">Details</div>
              </div>

              {/* Table Rows */}
              {logs.map((log) => (
                <div key={log.id} className="grid lg:grid-cols-7 gap-4 px-4 py-3 border rounded-lg items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(log.timestamp || log.createdAt || '').toLocaleString()}</span>
                  </div>
                  <div className="truncate">{log.userEmail}</div>
                  <div>{getActionBadge(log.action)}</div>
                  <div className="flex items-center gap-2">
                    {getEntityIcon(log.entityType)}
                    <span>{log.entityType}</span>
                  </div>
                  <div className="font-mono text-xs truncate">{log.entityId?.substring(0, 8) || 'N/A'}...</div>
                  <div className="text-muted-foreground">{log.ipAddress}</div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => viewLogDetails(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit logs found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getEntityIcon(selectedLog.entityType)}
              Audit Log Details
            </DialogTitle>
            <DialogDescription>
              {selectedLog && new Date(selectedLog.timestamp || selectedLog.createdAt || '').toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-sm">{selectedLog.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action</p>
                  {getActionBadge(selectedLog.action)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
                  <p className="text-sm">{selectedLog.entityType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entity ID</p>
                  <p className="text-sm font-mono">{selectedLog.entityId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                  <p className="text-sm">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User Agent</p>
                  <p className="text-sm truncate">{selectedLog.userAgent}</p>
                </div>
              </div>

              {selectedLog.oldValues && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Old Values</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-40">
                    {formatJson(typeof selectedLog.oldValues === 'string' ? selectedLog.oldValues : JSON.stringify(selectedLog.oldValues, null, 2))}
                  </pre>
                </div>
              )}

              {selectedLog.newValues && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">New Values</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-auto max-h-40">
                    {formatJson(typeof selectedLog.newValues === 'string' ? selectedLog.newValues : JSON.stringify(selectedLog.newValues, null, 2))}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
