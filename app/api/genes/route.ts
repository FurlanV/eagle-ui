import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const gene_name = req.nextUrl.searchParams.get("name")

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/gene/name/${gene_name}`
  )

  const data = await res.json()

  return NextResponse.json(data)
}
