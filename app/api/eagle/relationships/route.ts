import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const paper_id = req.nextUrl.searchParams.get("id")

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/eagle/relationships/${paper_id}`
  )

  const data = await res.json()

  return NextResponse.json(data)
}
