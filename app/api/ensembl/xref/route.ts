import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const gene_name = req.nextUrl.searchParams.get("name")

  const res = await fetch(
    `https://rest.ensembl.org/xrefs/symbol/human/${gene_name}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  )

  const data = await res.json()

  return NextResponse.json(data)
}
