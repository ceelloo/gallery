import fs from "fs/promises";
import path from "path";
import { tryCatch } from "./try-catch";
import sharp from "sharp";

export const storeImage = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${crypto.randomUUID()}-${Date.now()}.${file.type.split("/")[1]}`
  const uploadPath = path.join(process.cwd(), "storage", "uploads", fileName)

  await fs.writeFile(uploadPath, buffer)
  return `${fileName}`
}

export const deleteImage = async (filePath: string) => {
  const uploadPath = path.join(process.cwd(), "storage", "uploads", filePath)
  await fs.unlink(uploadPath)
}

export const storeProfile = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${crypto.randomUUID()}-${Date.now()}.${file.type.split("/")[1]}`
  const uploadPath = path.join(process.cwd(), "storage", "profile", fileName)

  await fs.writeFile(uploadPath, buffer)
  return `${fileName}`
}

export const deleteProfile = async (filePath: string) => {
  const uploadPath = path.join(process.cwd(), "storage", "profile", filePath)
  await fs.unlink(uploadPath)
}

export const processAndStoreImage = async (file: File) => {
  const processResult = await tryCatch(async () => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const metadata = await sharp(buffer).metadata()
    const savedFileName = await storeImage(file)

    return {
      success: true,
      fileName: savedFileName,
      metadata: {
        size: file.size,
        type: file.type,
        name: file.name,
        width: metadata.width,
        height: metadata.height,
      }
    }
  })

  if (!processResult.success) return {
    success: processResult.success,
    error: processResult.error,
  } 

  return processResult
}