'use client'

import FormInput from "@/components/form-input";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useActionState } from "react";
import { toast } from "sonner";

const submit = async (_: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData) as { email: string, password: string }
  const data = { callbackURL: "/", ...rawData }

  await authClient.signIn.email(data, {
    onError: (ctx) => void toast.error(ctx.error.message)
  })
}

export default function SignIn() {
  const [_, action, pending] = useActionState(submit, undefined)

  return (
    <form action={action} className="w-96 border rounded-lg shadow-xl">
      <div className="px-10 py-6 flex flex-col gap-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Sign in to ++</h1>
          <p className="text-sm text-zinc-500">Welcome back! please sign in to continue</p>
        </div>

        <div className="border border-dashed" />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="yourpassword"
        />

        <button className={buttonVariants()} disabled={pending}>
          {pending ? "..." : "Sign in"}
        </button>

      </div>
      <div className="bg-muted border rounded-lg p-3">
        <p className="text-accent-foreground text-center text-sm">
          Don't have an account ?
          <Link href="/sign-up" className={cn(buttonVariants({ variant: "link" }), "px-2 text-sky-500")}>Create account</Link>
        </p>
      </div>
    </form>
  )
}