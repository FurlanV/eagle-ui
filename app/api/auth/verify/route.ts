import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const token = await req.json()

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_URL}/api/v1/auth/verify`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(token),
    })
    
    const data = await res.json()

    return NextResponse.json(data)
}
