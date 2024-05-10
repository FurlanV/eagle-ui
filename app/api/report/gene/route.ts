import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const gene_name = req.nextUrl.searchParams.get("name")

  const res = await fetch(
    `http://10.118.0.2:8000/api/v1/report/gene/${gene_name}`
  )

  const data = await res.json()

  return NextResponse.json({ data })
}
