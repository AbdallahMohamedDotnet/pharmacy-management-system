import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET single prescription
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("prescriptions")
    .select("*, profiles!prescriptions_user_id_fkey(full_name, email)")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data })
}

// PUT review prescription (pharmacist/admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("prescriptions")
    .update({
      status: body.status,
      review_notes: body.review_notes,
      reviewed_by: user?.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}
