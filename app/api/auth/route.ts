import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const loginData = await req.json()

    const res = await fetch(`http://localhost:8000/api/v1/user/login`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(loginData),
    })

    const data = await res.json()

    return NextResponse.json(data)
}
