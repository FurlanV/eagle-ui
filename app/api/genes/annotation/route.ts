import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const gene_name = req.nextUrl.searchParams.get("name")

  const res = await fetch(
    `http://api.vln-hub.com:8005/api/v1/gene/annotation/${gene_name}`
  )

  const data = await res.json()

  return NextResponse.json({ data })
}
