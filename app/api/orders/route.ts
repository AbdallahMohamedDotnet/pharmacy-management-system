import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all orders (user gets their own, admin/pharmacist gets all)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from("orders").select("*, order_items(*, medicines(name, price))", { count: "exact" })

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

// POST create order
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { items, shipping_address, payment_method, notes } = body

  // Calculate total from items
  let totalAmount = 0
  for (const item of items) {
    const { data: medicine } = await supabase.from("medicines").select("price").eq("id", item.medicine_id).single()

    if (medicine) {
      totalAmount += medicine.price * item.quantity
    }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      shipping_address,
      payment_method: payment_method || "cash_on_delivery",
      notes,
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 400 })
  }

  // Create order items
  const orderItems = items.map((item: { medicine_id: string; quantity: number; price: number }) => ({
    order_id: order.id,
    medicine_id: item.medicine_id,
    quantity: item.quantity,
    price_at_time: item.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 })
  }

  return NextResponse.json({ data: order }, { status: 201 })
}
