"use server"

import { auth } from "@/lib/auth"
import db from "@/lib/database"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export const getAlbums = async () => {
  const user = await auth.api.getSession({ headers: await headers() })
  if (!user) throw new Error("Unauthorized")

  return await db.album.findMany({ where: { userId: user.user.id } })
}

export const updateAlbum = async (_: any, formData: FormData) => {
  const data = Object.fromEntries(formData) as { name: string, description: string, id: string }

  const album = await db.album.update({
    where: { id: data.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    }
  })
  revalidatePath(`/album/${album.id}`)
  return { success: true }
}

export const deleteAlbum = async (id: string) => {
  await db.album.delete({ where: { id: id } })
  revalidatePath("/album")
  return { success: true }
}