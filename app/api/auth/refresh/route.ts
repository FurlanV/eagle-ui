import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const tokenData = await req.json()

    const res = await fetch(`http://localhost:8000/api/v1/auth/refresh`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenData.token}`,
        },
        method: "POST",
        body: JSON.stringify({ token: tokenData.token, refresh_token: tokenData.refresh_token }),
    })

    const data = await res.json()

    return NextResponse.json(data)
}
