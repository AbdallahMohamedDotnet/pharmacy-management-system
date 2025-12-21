import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all categories
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count: data.length })
}

// POST create category (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("categories").insert(body).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
