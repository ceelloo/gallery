"use client"

import FormInput from "@/components/form-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateProfile } from "./action";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export const ProfileForm = ({ user }: { user: User }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [state, action, pending] = useActionState(updateProfile, undefined)

  useEffect(() => {
    if (state?.success) toast("Profile updated successfully")
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <form action={action} className="p-10 border-2 rounded-lg shadow-lg flex flex-col gap-4">
      <div>
        <h1 className="text-center text-3xl font-semibold">Profile Information</h1>
        <p className="text-center">Update your account's profile information and email address.</p>
      </div>

      <div className="flex justify-between">
        <div className="flex-1 w-80 flex flex-col gap-4">
          <input type="hidden" name="id" value={user.id} />
          <FormInput name="name" label="Name" defaultValue={user.name} />
          <FormInput name="email" label="Email" defaultValue={user.email} />
          <FormInput name="bio" label="Bio" defaultValue={user.bio ?? ""} />
          <div className="flex gap-2 w-full">
            <Button className="flex-1" disabled={pending}>{pending ? `...` : 'Save'}</Button>
            <DeleteProfile />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <button type="button" onClick={handleClick}>
            <Avatar className="size-44 cursor-pointer hover:opacity-80 transition">
              <AvatarImage src={preview ?? `/api/image/${user.image}?type=profile` ?? "default.jpg"} alt="Avatar" />
              <AvatarFallback>??</AvatarFallback>
            </Avatar>
          </button>

          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </form>
  )
}

const DeleteProfile = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleDelete = async () => {
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    await authClient.deleteUser({
      password: password,
    }, {
      onRequest: () => setLoading(true),
      onError: (e) => {
        setLoading(false)
        void toast.error(e.error.message)
      },
      onSuccess: () => {
        setLoading(false)
        void toast.success("Profile deleted successfully")
        router.push("/sign-in")
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1" variant="destructive" type="button">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Delete Profile</DialogTitle>
        <p className="text-sm text-muted-foreground">
          This action is permanent. Please enter your password to confirm.
        </p>

        <div className="grid gap-2 pt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};