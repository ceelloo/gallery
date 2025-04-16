"use server"

import db from "@/lib/database"
import { deleteProfile, storeProfile } from "@/lib/image"
import { revalidatePath } from "next/cache"

export const updateProfile = async (_: any, formData: FormData) => {
  const { id, name, bio, image } = Object.fromEntries(formData) as {
    id: string
    name: string
    bio: string
    image: File
  }

  let newImage: string | undefined

  if (image?.size > 0) {
    const user = await db.user.findUnique({
      where: { id },
      select: { image: true }
    })

    if (user?.image && user.image !== "default.png") {
      await deleteProfile(user.image)
    }

    newImage = await storeProfile(image)
  }

  await db.user.update({
    where: { id },
    data: {
      name,
      bio,
      ...(newImage && { image: newImage })
    }
  })

  revalidatePath("/profile")
  return { success: true }
}