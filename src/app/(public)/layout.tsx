import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const data = await auth.api.getSession({ headers: await headers() })
  if (data?.session) redirect("/")
  
  return (
    <main className="flex min-h-screen justify-center items-center font-switze">
      {children}
    </main>
  )
}