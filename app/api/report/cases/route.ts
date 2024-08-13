import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const caseId = req.nextUrl.searchParams.get("case_id")

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(
        `${API_URL}/api/v1/report/${caseId}`
    )

    const data = await res.json()

    return NextResponse.json(data)
}
