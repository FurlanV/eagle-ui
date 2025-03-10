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

    const res = await fetch(`${API_URL}/api/v1/report/dashboard/sankey/gene-variant-cs`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    return NextResponse.json(data)
}
