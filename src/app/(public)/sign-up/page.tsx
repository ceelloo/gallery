'use client'

import FormInput from "@/components/form-input";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";

const submit = async (_: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData) as { name: string, email: string, password: string }
  const data = { image: "default.jpg", callbackURL: "/", ...rawData }

  await authClient.signUp.email(data, {
    onError: (ctx) => void toast.error(ctx.error.message),
    onSuccess: () => redirect("/")
  })
}

export default function SignUp() {
  const [_, action, pending] = useActionState(submit, undefined)

  return (
    <form action={action} className="w-96 border rounded-lg shadow-xl">
      <div className="px-10 py-6 flex flex-col gap-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-zinc-500">Let's get started. Fill in the details below to create your account.</p>
        </div>

        <div className="border border-dashed" />

        <FormInput
          label="Name"
          name="name"
          placeholder="yourname"
          autoComplete="name"
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="yourpassword"
          required
        />

        <button className={buttonVariants()} disabled={pending}>
          {pending ? "..." : "Create account"}
        </button>

      </div>
      <div className="bg-muted border rounded-lg p-3">
        <p className="text-accent-foreground text-center text-sm">
          Already have an account ?
          <Link href="/sign-in" className={cn(buttonVariants({ variant: "link" }), "px-2 text-sky-500")}>Sign in</Link>
        </p>
      </div>
    </form>
  )
}