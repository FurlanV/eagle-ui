import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const gene_id = req.nextUrl.searchParams.get("gene_id")

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/gene/asd-relevance/gene-id/${gene_id}`
    )

    const data = await res.json()

    return NextResponse.json(data)
}
