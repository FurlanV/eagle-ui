import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {

    const job_id = req.nextUrl.searchParams.get('job_id')
    const cookie = cookies()
    const authToken = cookie.get('AUTH_TOKEN')

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_URL}/api/v1/eagle/review/${job_id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {

    const cookie = cookies()
    const authToken = cookie.get('AUTH_TOKEN')

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${API_URL}/api/v1/eagle/review`, {
        method: "PUT",
        body: JSON.stringify(await req.json()),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}