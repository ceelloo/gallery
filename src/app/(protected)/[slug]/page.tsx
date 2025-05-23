import { auth } from "@/lib/auth";
import { getAlbums, getImageBySlug, isLiked } from "./action";
import { LoadImage } from "./load";
import { headers } from "next/headers";

export default async function Show({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const image = await getImageBySlug((await params).slug)
  const liked = await isLiked(image.id)
  const albums = await getAlbums()

  return (
    <LoadImage image={image} isLiked={liked} users={session.user} albums={albums} />
  )
}