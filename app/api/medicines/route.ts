import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all medicines with pagination and filters
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const categoryId = searchParams.get("category_id")
  const search = searchParams.get("search")
  const requiresPrescription = searchParams.get("requires_prescription")
  const isActive = searchParams.get("is_active")

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from("medicines").select("*, categories(name)", { count: "exact" })

  // Apply filters
  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }
  if (search) {
    query = query.ilike("name", `%${search}%`)
  }
  if (requiresPrescription !== null && requiresPrescription !== undefined) {
    query = query.eq("requires_prescription", requiresPrescription === "true")
  }
  if (isActive !== null && isActive !== undefined) {
    query = query.eq("is_active", isActive === "true")
  }

  const { data, error, count } = await query.order("name").range(from, to)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

// POST create medicine (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("medicines").insert(body).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
