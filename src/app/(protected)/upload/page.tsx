import { getAlbum } from "./action";
import UploadForm from "./form";

export default async function Upload() {
  const album = await getAlbum()

  return <UploadForm album={album} />
}