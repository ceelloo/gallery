import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserProfile } from "./action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Image } from "@/components/image"

export default async function Profile({ params }: { params: Promise<{ email: string }> }) {
  const data = await auth.api.getSession({ headers: await headers() })
  if (!data?.user) return null

  const profile = await getUserProfile((await params).email)
  if (!profile) return null

  return (
    <div className="w-full flex h-[calc(100vh-6rem)]">
      <div className="flex-1 flex flex-col justify-center items-center h-auto gap-2">
        <div className="flex justify-center items-center">
          <Avatar className="size-80">
            <AvatarFallback>??</AvatarFallback>
            <AvatarImage src={`/api/image/${profile.image}?type=profile`} />
          </Avatar>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">{profile.name}</h1>
          <p className="border-b-2">{profile.email}</p>
          <p className="text-2xl">{profile.bio}</p>
          <p className="text-sm">Joined at {new Date(profile.createdAt).toDateString()}</p>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">{profile.name} Collections.</h1>
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.images.map((val) => (
              <Link href={`/${val.slug}`} key={val.slug}>
                <div className="relative w-full overflow-hidden rounded-lg">
                  <Image
                    src={`/api/image/${val.id}`}
                    alt={profile.name}
                    width={val.metadata.width}
                    height={val.metadata.height}
                    className="w-full h-auto object-cover rounded-lg"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={false}
                  />
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}