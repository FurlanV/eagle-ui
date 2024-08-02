import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const res = await fetch(
    `https://low.enthropy.app/eagle-api/api/v1/report/`
  )

  const data = await res.json()

  return NextResponse.json(data)
}
