import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const job_id = req.nextUrl.searchParams.get("id")
    const paper_id = req.nextUrl.searchParams.get("paper_id")

    if ((job_id === "null" || !job_id) || (paper_id === "null" || !paper_id)) return NextResponse.json([])
    const res = await fetch(`http://localhost:8000/api/v1/eagle/job/${job_id}/paper/${paper_id}/output`)

    const data = await res.json()

    return NextResponse.json(data)
}
