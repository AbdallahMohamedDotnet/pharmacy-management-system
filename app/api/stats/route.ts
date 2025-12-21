import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET dashboard statistics
export async function GET() {
  const supabase = await createClient()

  // Get counts
  const [{ count: categoriesCount }, { count: medicinesCount }, { count: ordersCount }, { count: prescriptionsCount }] =
    await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("medicines").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("prescriptions").select("*", { count: "exact", head: true }),
    ])

  // Get orders by status
  const { data: ordersByStatus } = await supabase.from("orders").select("status")

  const statusCounts = ordersByStatus?.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {})

  // Get prescription medicines count
  const { count: prescriptionMedicinesCount } = await supabase
    .from("medicines")
    .select("*", { count: "exact", head: true })
    .eq("requires_prescription", true)

  // Get low stock medicines
  const { data: lowStockMedicines } = await supabase
    .from("medicines")
    .select("id, name, stock_quantity")
    .lt("stock_quantity", 50)
    .order("stock_quantity")

  return NextResponse.json({
    data: {
      categories: categoriesCount || 0,
      medicines: medicinesCount || 0,
      prescriptionMedicines: prescriptionMedicinesCount || 0,
      orders: ordersCount || 0,
      ordersByStatus: statusCounts || {},
      prescriptions: prescriptionsCount || 0,
      lowStockMedicines: lowStockMedicines || [],
    },
  })
}
