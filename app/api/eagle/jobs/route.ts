import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const res = await fetch(`http://localhost:8000/api/v1/eagle/jobs`)

    const data = await res.json()

    return NextResponse.json({ data })
}
