import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const job_id = req.nextUrl.searchParams.get("id")

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_URL}/api/v1/paper/eagle-run/${job_id}`)

    const data = await res.json()

    return NextResponse.json(data)
}
