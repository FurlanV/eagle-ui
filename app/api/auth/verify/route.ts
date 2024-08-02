import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const token = await req.json()

    const res = await fetch(`https://low.enthropy.app/eagle-api/api/v1/auth/verify`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(token),
    })
    
    const data = await res.json()

    return NextResponse.json(data)
}
