import { Image } from "@/components/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExtendedImage } from "@/lib/constant"

export const LoadImage = ({ images }: { images: ExtendedImage[] }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
      {images.map((image, index) => (
        <Link href={image.slug} key={image.id}>
          <div className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
            <Image
              src={`/api/image/${image.id}`}
              alt={image.metadata.name}
              width={image.metadata.width}
              height={image.metadata.height}
              priority={index < 2}
              className="w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 w-full h-18 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition z-20 flex text-white font-bold gap-2 items-center">
              <Avatar className="size-8">
                <AvatarFallback>??</AvatarFallback>
                <AvatarImage src={`/api/image/${image.user.image}?type=profile`} />
              </Avatar>
              <h1>{image.user.name}</h1>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
