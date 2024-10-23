import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookie = cookies()
    const authToken = cookie.get('AUTH_TOKEN')

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const file_name = req.nextUrl.searchParams.get('file_name')
    const res = await fetch(`${API_URL}/api/v1/extractor/get-file-content/${file_name}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}