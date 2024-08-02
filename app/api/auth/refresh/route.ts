import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { NextURL } from "next/dist/server/web/next-url"

export async function POST(req: NextRequest) {

    const cookie = cookies()
    const authToken = cookie.get('AUTH_TOKEN')
    const refreshToken = cookie.get('REFRESH_TOKEN')

    if (!authToken || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = Buffer.from(authToken.value, 'base64').toString('ascii');
    const refresh_token = Buffer.from(refreshToken.value, 'base64').toString('ascii');

    const res = await fetch(`https://low.enthropy.app/eagle-api/api/v1/auth/refresh`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ token, refresh_token }),
    })

    if (!res.ok) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await res.json()

    return NextResponse.json(data)
}
