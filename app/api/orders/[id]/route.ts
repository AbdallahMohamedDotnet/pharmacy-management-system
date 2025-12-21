import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET single order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, medicines(name, price, image_url))")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data })
}

// PUT update order status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("orders")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

// DELETE cancel order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Instead of deleting, update status to cancelled
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data, message: "Order cancelled" })
}
