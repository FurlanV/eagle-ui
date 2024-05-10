import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const res = await fetch(`http://10.118.0.2:8000/api/v1/paper/upload`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()

  return NextResponse.json({ data })
}
