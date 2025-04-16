import { getImages } from "./action"
import { LoadImage } from "./load"

export default async function Home() {
  const images = await getImages()

  return <LoadImage images={images} />
}