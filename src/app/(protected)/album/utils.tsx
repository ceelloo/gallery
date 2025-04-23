"use client"

import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { deleteAlbum, updateAlbum } from "./action";
import { toast } from "sonner";

export const AlbumUtils = (props: { id: string, name: string, description: string }) => {
  const [state, action] = useActionState(updateAlbum, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.success) {
      toast.success("Album updated!")
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="absolute z-50 top-2 right-16 p-1 rounded bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Update Album
        </DialogTitle>
        <form action={action} className="space-y-2" id="form-album">
          <input type="hidden" name="id" value={props.id} />
          <FormInput name="name" label="Name" defaultValue={props.name} />
          <FormInput name="description" label="Description" defaultValue={props.description} />
        </form>
        <div className="space-x-2">
          <Button form="form-album">
            Save
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={async () => {
              const confirmed = window.confirm("Apakah kamu yakin ingin menghapus album ini?");
              if (confirmed) {
                await deleteAlbum(props.id)
              }
            }}
          >
            Delete Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}