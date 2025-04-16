import { auth } from "@/lib/auth"
import { ProfileForm } from "./form"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Profile() {
  const data = await auth.api.getSession({ headers: await headers() })
  if (!data?.user) redirect("/sign-out")

  return (
    <div className="flex flex-col justify-center px-60 py-10">
      <ProfileForm user={data.user} />
    </div>
  )
}