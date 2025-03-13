
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookie = await cookies()
    const authToken = await cookie.get('AUTH_TOKEN')

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = Buffer.from(authToken.value, 'base64').toString('ascii');

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const case_id = req.nextUrl.searchParams.get("case_id")

    const res = await fetch(`${API_URL}/api/v1/eagle/case/${case_id}/rescore`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    return NextResponse.json(res)
}