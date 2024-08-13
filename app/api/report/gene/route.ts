import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const geneSymbol = req.nextUrl.searchParams.get("symbol")

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${API_URL}/api/v1/report/gene/${geneSymbol}`
  )

  const data = await res.json()

  return NextResponse.json(data)
}
