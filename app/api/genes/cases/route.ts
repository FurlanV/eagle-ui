import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/gene/cases`
    )

    const data = await res.json()

    return NextResponse.json(data)
}
