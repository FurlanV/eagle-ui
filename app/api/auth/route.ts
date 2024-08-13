import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const loginData = await req.json()

    const res = await fetch(`${API_URL}/api/v1/user/login`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(loginData),
    })

    const data = await res.json()

    return NextResponse.json(data)
}
