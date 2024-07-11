import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const res = await fetch(`http://localhost:8000/api/v1/eagle/new-job`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()

  return NextResponse.json({ data })
}
