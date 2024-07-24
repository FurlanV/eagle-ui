import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const caseId = req.nextUrl.searchParams.get("case_id")

    const res = await fetch(
        `http://localhost:8000/api/v1/report/${caseId}`
    )

    const data = await res.json()

    return NextResponse.json(data)
}
