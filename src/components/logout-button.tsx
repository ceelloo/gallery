"use client"

import { authClient } from "@/lib/auth-client"
import { buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"

type LogoutButtonProps = VariantProps<typeof buttonVariants> & React.ButtonHTMLAttributes<HTMLButtonElement>

export const LogoutButton = ({ variant, size, className, ...props }: LogoutButtonProps) => {
  return (
    <button
      onClick={() => void authClient.signOut().then(() => window.location.href = "/sign-in")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      Logout
    </button>
  )
}
