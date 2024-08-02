import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const cookie = cookies()
  const authToken = cookie.get('AUTH_TOKEN')

  if (!authToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const token = Buffer.from(authToken.value, 'base64').toString('ascii');

  const res = await fetch(`https://low.enthropy.app/eagle-api/api/v1/eagle/new-job`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json()

  return NextResponse.json(data)
}
