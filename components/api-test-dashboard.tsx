"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Play,
  Database,
  Pill,
  ShoppingCart,
  ClipboardList,
  FileText,
  BarChart3,
} from "lucide-react"

interface TestResult {
  endpoint: string
  method: string
  status: "pending" | "success" | "error"
  statusCode?: number
  response?: unknown
  error?: string
  duration?: number
}

export function ApiTestDashboard() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const endpoints = [
    // Stats
    { method: "GET", path: "/api/stats", category: "stats", description: "Get dashboard statistics" },

    // Categories
    { method: "GET", path: "/api/categories", category: "categories", description: "List all categories" },
    {
      method: "GET",
      path: "/api/categories/11111111-1111-1111-1111-111111111111",
      category: "categories",
      description: "Get Pain Relief category",
    },

    // Medicines
    { method: "GET", path: "/api/medicines", category: "medicines", description: "List all medicines" },
    { method: "GET", path: "/api/medicines?page=1&limit=5", category: "medicines", description: "Paginated medicines" },
    {
      method: "GET",
      path: "/api/medicines?category_id=11111111-1111-1111-1111-111111111111",
      category: "medicines",
      description: "Medicines by category",
    },
    { method: "GET", path: "/api/medicines?search=vitamin", category: "medicines", description: "Search medicines" },
    {
      method: "GET",
      path: "/api/medicines?requires_prescription=true",
      category: "medicines",
      description: "Prescription medicines only",
    },
    {
      method: "GET",
      path: "/api/medicines/a1111111-1111-1111-1111-111111111111",
      category: "medicines",
      description: "Get Paracetamol details",
    },

    // Orders (requires auth)
    { method: "GET", path: "/api/orders", category: "orders", description: "List orders (auth required)" },

    // Cart (requires auth)
    { method: "GET", path: "/api/cart", category: "cart", description: "Get cart (auth required)" },

    // Prescriptions (requires auth)
    {
      method: "GET",
      path: "/api/prescriptions",
      category: "prescriptions",
      description: "List prescriptions (auth required)",
    },
  ]

  const runTest = async (endpoint: { method: string; path: string; description: string }) => {
    const startTime = Date.now()

    try {
      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      const duration = Date.now() - startTime

      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        response: data,
        duration,
      } as TestResult
    } catch (error) {
      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      } as TestResult
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])

    const testResults: TestResult[] = []

    for (const endpoint of endpoints) {
      const result = await runTest(endpoint)
      testResults.push(result)
      setResults([...testResults])
    }

    setIsRunning(false)
  }

  const runCategoryTests = async (category: string) => {
    setIsRunning(true)
    const categoryEndpoints = endpoints.filter((e) => e.category === category)

    const testResults: TestResult[] = []

    for (const endpoint of categoryEndpoints) {
      const result = await runTest(endpoint)
      testResults.push(result)
      setResults((prev) => [
        ...prev.filter((r) => !categoryEndpoints.some((e) => e.path === r.endpoint)),
        ...testResults,
      ])
    }

    setIsRunning(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "stats":
        return <BarChart3 className="h-4 w-4" />
      case "categories":
        return <Database className="h-4 w-4" />
      case "medicines":
        return <Pill className="h-4 w-4" />
      case "orders":
        return <ClipboardList className="h-4 w-4" />
      case "cart":
        return <ShoppingCart className="h-4 w-4" />
      case "prescriptions":
        return <FileText className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />
    }
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pharmacy API Test Dashboard</h1>
        <p className="text-muted-foreground">
          Test all API endpoints with seed data. Run the SQL scripts first to create tables and seed data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tests Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <Button onClick={runAllTests} disabled={isRunning} size="lg">
          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          Run All Tests
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("stats")} disabled={isRunning}>
          <BarChart3 className="mr-2 h-4 w-4" /> Stats
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("categories")} disabled={isRunning}>
          <Database className="mr-2 h-4 w-4" /> Categories
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("medicines")} disabled={isRunning}>
          <Pill className="mr-2 h-4 w-4" /> Medicines
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("orders")} disabled={isRunning}>
          <ClipboardList className="mr-2 h-4 w-4" /> Orders
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("cart")} disabled={isRunning}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Cart
        </Button>
        <Button variant="outline" onClick={() => runCategoryTests("prescriptions")} disabled={isRunning}>
          <FileText className="mr-2 h-4 w-4" /> Prescriptions
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Endpoints</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>All API endpoints available for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {endpoints.map((endpoint, index) => {
                  const result = results.find((r) => r.endpoint === endpoint.path)
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(endpoint.category)}
                        <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                        <code className="text-sm">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result && (
                          <>
                            {getStatusIcon(result.status)}
                            {result.statusCode && (
                              <Badge variant={result.statusCode < 400 ? "outline" : "destructive"}>
                                {result.statusCode}
                              </Badge>
                            )}
                            {result.duration && (
                              <span className="text-xs text-muted-foreground">{result.duration}ms</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Detailed responses from each endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {results.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No tests run yet. Click "Run All Tests" to start.
                    </p>
                  ) : (
                    results.map((result, index) => (
                      <Card key={index} className={result.status === "error" ? "border-red-200" : "border-green-200"}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <Badge>{result.method}</Badge>
                              <code className="text-sm">{result.endpoint}</code>
                            </div>
                            <div className="flex items-center gap-2">
                              {result.statusCode && (
                                <Badge variant={result.statusCode < 400 ? "outline" : "destructive"}>
                                  {result.statusCode}
                                </Badge>
                              )}
                              {result.duration && (
                                <span className="text-xs text-muted-foreground">{result.duration}ms</span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-48">
                            {JSON.stringify(result.response || result.error, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Run Database Scripts</h3>
            <p className="text-sm text-muted-foreground">
              Execute the SQL scripts in the <code className="bg-muted px-1 rounded">scripts/</code> folder to create
              tables and seed data:
            </p>
            <ul className="text-sm list-disc list-inside text-muted-foreground">
              <li>
                <code>001_create_tables.sql</code> - Creates all tables with RLS policies
              </li>
              <li>
                <code>002_seed_data.sql</code> - Adds sample categories and medicines
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">2. Test Public Endpoints</h3>
            <p className="text-sm text-muted-foreground">
              Categories, Medicines, and Stats endpoints work without authentication.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">3. Test Protected Endpoints</h3>
            <p className="text-sm text-muted-foreground">
              Cart, Orders, and Prescriptions require user authentication. Sign up first to test these.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
