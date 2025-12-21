import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET user's cart
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*, medicines(name, price, image_url, requires_prescription, stock_quantity)")
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Calculate totals
  const total = data.reduce((sum, item) => {
    const medicine = item.medicines as { price: number } | null
    return sum + (medicine?.price || 0) * item.quantity
  }, 0)

  return NextResponse.json({
    data,
    summary: {
      items_count: data.length,
      total,
    },
  })
}

// POST add item to cart
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select()
    .eq("user_id", user.id)
    .eq("medicine_id", body.medicine_id)
    .single()

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + (body.quantity || 1) })
      .eq("id", existing.id)
      .select("*, medicines(name, price)")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data, message: "Cart updated" })
  }

  // Add new item
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      medicine_id: body.medicine_id,
      quantity: body.quantity || 1,
    })
    .select("*, medicines(name, price)")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data }, { status: 201 })
}

// DELETE clear cart
export async function DELETE() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "Cart cleared" })
}
