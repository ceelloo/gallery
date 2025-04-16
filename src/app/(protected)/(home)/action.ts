"use server"

import { ExtendedImage } from "@/lib/constant"
import db from "@/lib/database"

export const getImages = async () => {
  return await db.image.findMany({
    include: { user: true }
  }) as ExtendedImage[]
}