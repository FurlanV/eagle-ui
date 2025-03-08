import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const cookie = await cookies()
    const authToken = await cookie.get('AUTH_TOKEN')
    const refreshToken = await cookie.get('REFRESH_TOKEN')

    if (!authToken || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const data = await req.json()

    const res = await fetch(`${API_URL}/api/v1/feedback/user/cases`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const responseData = await res.json()

    return NextResponse.json(responseData)
}