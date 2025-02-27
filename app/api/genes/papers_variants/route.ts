import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const gene_id = req.nextUrl.searchParams.get("gene_id")

    if (!gene_id) {
        return NextResponse.json({ error: "Gene ID is required" }, { status: 400 })
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/gene/papers_and_variants/${gene_id}`
    )

    const data = await res.json()

    return NextResponse.json(data)
}
