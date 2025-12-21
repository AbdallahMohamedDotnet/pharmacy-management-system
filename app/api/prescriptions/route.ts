import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all prescriptions
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("prescriptions")
    .select("*, profiles!prescriptions_user_id_fkey(full_name, email)", { count: "exact" })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

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

// POST upload prescription
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("prescriptions")
    .insert({
      user_id: user.id,
      image_url: body.image_url,
      order_id: body.order_id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
