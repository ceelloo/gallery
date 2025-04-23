"use client"

import FormInput from "@/components/form-input";
import ImageUpload from "@/components/image-input";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { imageTags } from "@/lib/constant";
import { showError } from "@/lib/show-error";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createAlbum, upload } from "./action";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Album } from "@/generated";

export default function UploadForm({ album }: { album: Album[] }) {
  const [state, action, pending] = useActionState(upload, undefined)
  const [tag, setTag] = useState<string[]>()

  useEffect(() => {
    if (state?.success) toast.success("Image uploaded successfully")
    if (state?.errors) showError(state.errors)
  }, [state])

  return (
    <div className="flex h-[80vh] justify-center items-center">
      <form action={action} className="border-2 rounded-lg p-8 space-y-2 flex flex-col shadow-xl gap-4">
        <h1 className="text-center text-4xl font-bold">Upload Image.</h1>
        <div className="flex gap-4">
          <ImageUpload
            name="image"
          />
          <div className="flex flex-col justify-between gap-4 w-80">
            <FormInput label="Title" name="title" />
            <FormInput label="Description" name="description" />
            <div className="space-y-2">
              <Label>Album</Label>
              <div className="flex gap-2">
                <Select name="album" required>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Album" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {album.length != 0 ? album.map((val) => (
                        <SelectItem key={val.id} value={val.id}>{val.name}</SelectItem>
                      )) : (
                        <SelectLabel>Seems like you dont have album yet.</SelectLabel>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <CreateAlbum />
              </div>
            </div>
            <MultiSelect
              label="Tags"
              placeholder="Select tags"
              options={imageTags.map((val) => ({
                label: val,
                value: val,
              }))}
              onValueChange={(val) => setTag(val)}
            />
            <input type="hidden" name="tag" value={tag ?? ""} />
          </div>
        </div>
        <Button className="w-full" disabled={pending}>
          {pending ? "..." : "Upload"}
        </Button>
      </form>
    </div>
  )
}

const CreateAlbum = () => {
  const [state, action] = useActionState(createAlbum, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.success) {
      toast.success("Album created successfully")
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="flex-1">New Album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create album</DialogTitle>
        <form action={action} className="space-y-2">
          <FormInput
            label="Name"
            name="name"
            required
          />
          <FormInput
            label="Description"
            name="description"
            required
          />
          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}