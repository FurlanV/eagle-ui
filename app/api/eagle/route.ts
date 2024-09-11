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

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/api/v1/eagle/new-job`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  // Create a TransformStream to modify the response
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      // Assuming the API sends progress updates as JSON
      const update = JSON.parse(new TextDecoder().decode(chunk))
      if (update.progress) {
        controller.enqueue(JSON.stringify({ progress: update.progress }))
      }
    },
  })

  return new NextResponse(response.body?.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
