import { Image } from "@/components/image"
import Link from "next/link"
import { getAlbum } from "./action"

export default async function Album({ params }: { params: Promise<{ id: string }> }) {
  const album = await getAlbum(((await params).id))
  return (
    <div className="m-4">
      <div className="mx-4 mt-2 mb-4 text-center">
        <h1 className="text-3xl font-bold">{album.name}</h1>
        <p className="text-xl">{album.description}</p>
        <p>{album.user.name} album.</p>
      </div>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
        {album.images.map((image, index) => (
          <Link href={`/${image.slug}`} key={image.id}>
            <div className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
              <Image
                src={`/api/image/${image.id}`}
                alt={image.slug}
                width={image.width}
                height={image.height}
                priority={index < 2}
                className="w-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}