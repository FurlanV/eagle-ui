import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")

  const res = await fetch(
    `https://rest.ensembl.org/phenotype/gene/human/${id}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  )

  const data = await res.json()

  return NextResponse.json(data)
}
