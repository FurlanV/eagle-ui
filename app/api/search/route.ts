import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword")

  const res = await fetch(`http://192.168.2.42:8000/api/v1/search/${keyword}`)

  const data = await res.json()

  return NextResponse.json({ data })
}
