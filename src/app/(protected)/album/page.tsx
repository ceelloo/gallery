import { Flower } from "lucide-react"
import Link from "next/link"
import { getAlbums } from "./action"
import { AlbumUtils } from "./utils"

export default async function Album() {
  const albums = await getAlbums()

  return (
    <div className="m-4">
      <h1 className="text-4xl font-bold">Your album</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {albums.map((album) => (
          <div key={album.id} className="group relative">
            <AlbumUtils id={album.id} name={album.name} description={album.description} />
            <Link href={`/album/${album.id}`} className="block">
              <Flower className="relative size-52 bg-zinc-100 rounded-lg border border-black" />
              <h1 className="font-medium line-clamp-1">{album.name}</h1>
              <p className="text-sm text-muted-foreground">{album.description}</p>
            </Link>
          </div>

        ))}
      </div>
    </div>
  )
}