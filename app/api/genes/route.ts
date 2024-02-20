import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const gene_name = req.nextUrl.searchParams.get("name")

  const res = await fetch(
    `http://192.168.2.42:8000/api/v1/gene/name/${gene_name}`
  )

  const data = await res.json()

  return NextResponse.json({ data })
}
