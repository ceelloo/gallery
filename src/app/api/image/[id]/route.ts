import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { existsSync } from "fs"
import fs from 'fs/promises'
import mime from "mime"
import db from "@/lib/database"
import { ExtendedImage } from "@/lib/constant"
import { tryCatch } from "@/lib/try-catch"

const getImage = async (id: string): Promise<ExtendedImage | null> => {
  return await db.image.findUnique({
    where: { id },
    include: { user: true }
  }) as ExtendedImage | null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const imageProcessingResult = await tryCatch(async () => {
    const type = request.nextUrl.searchParams.get('type')

    let filePath: string
    const imageId = (await params).id

    if (type === "profile") {
      filePath = path.join(process.cwd(), "storage", "profile", imageId)
    } else {
      const image = await getImage(imageId)
      if (!image) {
        return NextResponse.json(
          { message: "Image not found" },
          { status: 404 }
        )
      }

      filePath = path.join(process.cwd(), "storage", "uploads", image.filePath)
    }

    if (!existsSync(filePath)) {
      console.warn(`File not found at path: ${filePath}`)
      return NextResponse.json(
        { message: "File resource not found" },
        { status: 404 }
      )
    }

    const fileBuffer = await fs.readFile(filePath)
    const mimeType = mime.getType(filePath) || "application/octet-stream"

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  })

  if (!imageProcessingResult.success) return NextResponse.json(
    { message: "Internal server error retrieving image" },
    { status: 500 }
  )

  return imageProcessingResult.data
}