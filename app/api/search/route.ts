import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword")

  const res = await fetch(`http://10.118.0.2:8000/api/v1/search/${keyword}`)

  const data = await res.json()

  return NextResponse.json({ data })
}
