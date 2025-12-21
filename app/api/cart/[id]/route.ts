import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// PUT update cart item quantity
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity: body.quantity })
    .eq("id", id)
    .select("*, medicines(name, price)")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "Item removed from cart" })
}
