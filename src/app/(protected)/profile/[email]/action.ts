"use server"

import { ExtendedImage } from "@/lib/constant"
import db from "@/lib/database"
import type { User } from "@prisma/client"

export const getUserProfile = async (email: string): Promise<(User & { images: ExtendedImage[] }) | null> => {
  const user = await db.user.findUnique({
    where: { email: decodeURIComponent(email) },
    include: {
      images: true,
    }
  })

  if (!user) return null

  return user as User & { images: ExtendedImage[] }
}
