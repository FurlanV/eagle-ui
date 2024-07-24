import { NextRequest, NextResponse } from "next/server"
import { getValidAuthTokens } from "@/lib/cookies"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const { token } = getValidAuthTokens()

  const res = await fetch(`http://localhost:8000/api/v1/eagle/new-job`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json()

  return NextResponse.json(data)
}
