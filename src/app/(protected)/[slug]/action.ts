"use server"

import { auth } from "@/lib/auth"
import { ImageMetadata } from "@/lib/constant"
import db from "@/lib/database"
import { deleteImage as removeImage } from "@/lib/image"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

export const getImageBySlug = async (slug: string) => {
  const image = await db.image.findUnique({
    where: { slug },
    include: {
      user: true,
      likes: true,
      comments: { include: { user: true } },
      album: true,
    }
  })

  if (!image) notFound()

  return {
    id: image.id,
    title: image.title,
    description: image.description,
    tags: image.tags,
    filePath: image.filePath,
    metadata: image.metadata as ImageMetadata,
    createdAt: image.createdAt,
    likes: image.likes.length,
    album: {
      id: image.album.id,
      name: image.album.name,
    },
    user: {
      id: image.user.id,
      name: image.user.name,
      image: image.user.image,
      email: image.user.email,
    },
    comments: image.comments.map((comment) => ({
      text: comment.text,
      userName: comment.user.name,
      userImage: comment.user.image,
      userEmail: comment.user.email,
      createdAt: comment.createdAt,
    }))
  }
}

export type ExtendedImage = Awaited<ReturnType<typeof getImageBySlug>>

export const isLiked = async (imageId: string) => {
  const user = await auth.api.getSession({ headers: await headers() })
  if (!user) return false
  const existingLike = await db.like.findUnique({
    where: { imageId_userId: { imageId, userId: user.user.id } }
  })
  return !!existingLike
}

export const toggleLike = async (imageId: string) => {
  const user = await auth.api.getSession({ headers: await headers() })
  if (!user) throw new Error("Unauthorized")

  const image = await db.image.findFirst({ where: { id: imageId } })

  const existingLike = await db.like.findUnique({
    where: { imageId_userId: { imageId, userId: user.user.id } }
  })

  if (existingLike) return await db.like.delete({
    where: { imageId_userId: { imageId, userId: user.user.id } }
  }).then(void revalidatePath(`/${image?.slug}`)).then(() => false)

  else return await db.like.create({
    data: { imageId, userId: user.user.id }
  }).then(void revalidatePath(`/${image?.slug}`)).then(() => true)
}

export const postComment = async (imageId: string, formData: FormData) => {
  const data = Object.fromEntries(formData) as { text: string }
  const user = await auth.api.getSession({ headers: await headers() })
  if (!user) throw new Error("Unauthorized")
  const image = await db.image.findUnique({
    where: { id: imageId }
  })
  await db.comment.create({
    data: { imageId, text: data.text, userId: user.user.id }
  })
  revalidatePath(`/${image?.slug}`)
  return
}

export const updateImage = async (_: any, formData: FormData) => {
  const data = Object.fromEntries(formData) as { title: string, description: string, tags: string, id: string, albumId: string }
  const image = await db.image.update({
    where: { id: data.id },
    data: {
      ...data,
      tags: data.tags,
      albumId: data.albumId,
    }
  })
  revalidatePath(`/${image.slug}`)
  return { success: true }
}

export const deleteImage = async (id: string, _: FormData) => {
  const image = await db.image.delete({
    where: { id: id },
  })

  await removeImage(image.filePath)
  redirect("/")
}

export const getAlbums = async () => {
  const user = await auth.api.getSession({ headers: await headers() })
  if (!user) throw new Error("Unauthorized")

  return await db.album.findMany({ where: { userId: user.user.id } })
}