import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const webhookFormData = new FormData()
    webhookFormData.append("image", image)

    const response = await fetch("https://kingpromise007.app.n8n.cloud/webhook/food-ai", {
      method: "POST",
      body: webhookFormData,
    })

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
