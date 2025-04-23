"use client"

import { authClient } from "@/lib/auth-client"
import { Folder, Image, LogOut, UserIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { User } from "better-auth"

export const Navbar = ({ user }: { user: User }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex justify-between items-center bg h-16 px-6">
        <Link href="/" className="flex-1 flex justify-start text-3xl font-bold">
          Gallery
        </Link>
        <div className="flex-1 flex justify-center">
          hello there!
        </div>
        <div className="flex-1 flex justify-end">
          <AvatarButton user={user} />
        </div>
      </div>
    </nav>
  )
}

const AvatarButton = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>??</AvatarFallback>
          <AvatarImage src={`/api/image/${user.image}?type=profile`} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 absolute -left-44">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/upload">
          <DropdownMenuItem>
            Upload Image
            <DropdownMenuShortcut><Image /></DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <Link href="/album">
          <DropdownMenuItem>
            Album
            <DropdownMenuShortcut><Folder/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut><UserIcon /></DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            void authClient.signOut({
              fetchOptions: {
                onRequest: () => void toast.loading("Logging out...")
              }
            }).then(() => window.location.href = "/sign-in")
          }}
        >
          Logout
          <DropdownMenuShortcut><LogOut /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}