import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
    const caseId = req.nextUrl.searchParams.get('caseId')

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const cookie = await cookies()
    const authToken = await cookie.get('AUTH_TOKEN')
    const refreshToken = await cookie.get('REFRESH_TOKEN')

    if (!authToken || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const res = await fetch(`${API_URL}/api/v1/feedback/case/${caseId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {

    const cookie = await cookies()
    const authToken = await cookie.get('AUTH_TOKEN')
    const refreshToken = await cookie.get('REFRESH_TOKEN')

    if (!authToken || !refreshToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = Buffer.from(authToken.value, 'base64').toString('ascii');
    //const refresh_token = Buffer.from(refreshToken.value, 'base64').toString('ascii');

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL

        if (!API_URL) {
            return NextResponse.json(
                { error: "API URL not configured" },
                { status: 500 }
            )
        }

        const data = await req.json()

        const res = await fetch(`${API_URL}/api/v1/feedback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to submit feedback" },
                { status: res.status }
            )
        }

        const responseData = await res.json()
        return NextResponse.json(responseData)
    } catch (error) {
        console.error("Error submitting feedback:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}