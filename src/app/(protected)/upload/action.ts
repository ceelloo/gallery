"use server"

import db from "@/lib/database"
import { z } from "zod"
import sharp from "sharp"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { processAndStoreImage, storeImage } from "@/lib/image"
import { revalidatePath } from "next/cache"

const imageUploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File cannot be empty." })
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "File size must be under 5MB.",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Only JPG, PNG, or WebP files are allowed.",
    }),
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  tag: z
    .string()
    .min(1, { message: "At least one tag is required." })
    .transform((val) =>
      val
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    ),
})

export const upload = async (_: any, form: FormData) => {
  const validatedFields = imageUploadSchema.safeParse(Object.fromEntries(form))
  if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors, success: false }

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-out")

  const processImage = await processAndStoreImage(validatedFields.data.image)
  if (!processImage.success) return { success: processImage.success }

  await db.image.create({
    data: {
      userId: session.user.id,
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      filePath: processImage.data.fileName,
      tags: validatedFields.data.tag.join(','),
      metadata: processImage.data.metadata,
    },
  })

  revalidatePath("/upload")
  return { success: true }
}