"use server"

import { ExtendedImage } from "@/lib/constant"
import db from "@/lib/database"
import { notFound } from "next/navigation"

export const getAlbum = async (id: string) => {
  const album = await db.album.findUnique({
    where: { id },
    include: {
      images: true,
      user: true
    }
  })

  if (!album) notFound()

  return {
    name: album.name,
    description: album.description,
    user: {
      name: album.user.name,
      email: album.user.email,
    },
    images: (album.images as ExtendedImage[]).map((image) => ({
      id: image.id,
      slug: image.slug,
      file: image.filePath,
      width: image.metadata.width,
      height: image.metadata.height,
    }))
  }
}