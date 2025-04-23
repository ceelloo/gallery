"use server"

import { ExtendedImage } from "@/lib/constant"
import db from "@/lib/database"
import type { User } from "@prisma/client"
import { notFound } from "next/navigation"

export const getUserProfile = async (email: string): Promise<(User & { images: ExtendedImage[] }) | null> => {
  const user = await db.user.findUnique({
    where: { email: decodeURIComponent(email) },
    include: {
      images: true,
    }
  })

  if (!user) notFound()

  return user as User & { images: ExtendedImage[] }
}
