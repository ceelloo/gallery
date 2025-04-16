"use client"

import FormInput from "@/components/form-input"
import { MultiSelect } from "@/components/multi-select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User } from "@/lib/auth"
import { imageTags } from "@/lib/constant"
import { formatDistanceToNow } from "date-fns"
import { Download, Heart, Pen, Send, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useActionState, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteImage, ExtendedImage, postComment, toggleLike, updateImage } from "./action"

export const LoadImage = ({ image, isLiked, users }: { image: ExtendedImage, isLiked: boolean, users: User }) => {
  const [pending, startTransition] = useTransition()
  const [liked, setLiked] = useState<boolean>(isLiked)

  const { comments, user, ...imageOnly } = image

  const isHorizontal = image.metadata.width > image.metadata.height
  const imageClasses = isHorizontal
    ? 'max-w-[620px] object-contain'
    : 'max-h-[500px] max-w-[320px] object-contain'

  const handleToggle = async () => {
    startTransition(async () => {
      const res = await toggleLike(image.id)
      setLiked(res)
    })
  }
  return (
    <div className={`p-10 ${isHorizontal ? 'px-28' : 'px-48'}`}>
      <div className="flex flex-col md:flex-row gap-6 p-10 shadow-lg border rounded-lg">
        <div className="flex gap-6 w-full">
          <div className="flex justify-start" >
            <Image
              src={`/api/image/${image.id}`}
              alt={image.title}
              width={image.metadata.width}
              height={image.metadata.height}
              className={`${imageClasses} rounded-lg`}
            />
          </div>
          <div className={`flex-1 flex flex-col gap-2`}>
            <div>
              <h1 className="text-3xl font-bold">{image.title}</h1>
              <p className="text-lg">{image.description}</p>
              <p className="text-xs">{formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {image.tags && image.tags.split(",").map(val => (
                <Badge key={val}>{val}</Badge>
              ))}
            </div>
            <Link href={`/profile/${image.user.email}`} className="p-2 rounded-lg hover:bg-zinc-200 transition-all duration-300 flex gap-2 cursor-pointer w-64">
              <Avatar className="size-10">
                <AvatarFallback>??</AvatarFallback>
                <AvatarImage src={`/api/image/${image.user.image}?type=profile`} />
              </Avatar>
              <div className="flex flex-col font-semibold">
                <h1>{image.user.name}</h1>
                <p className="text-sm">{image.user.email}</p>
              </div>
            </Link>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" disabled={pending} onClick={handleToggle}>
                <Heart fill={liked ? "red" : "white"} />
                {image.likes}
              </Button>
              <Button asChild className="flex-1">
                <a href={`/api/image/${image.id}`} download={image.title}>
                  <Download />
                  Download
                </a>
              </Button>
              {users.id === image.user.id && (
                <>
                  <UpdateImage data={imageOnly} />
                  <DeleteImage id={image.id} />
                </>
              )}
            </div>
            <div className="border border-dashed w-full border-black" />
            <div className="flex-1 flex flex-col gap-2">
              <h1>{image.comments.length} comments.</h1>
              <ScrollArea className="h-48">
                {image.comments.map((val, idx) => (
                  <Comment key={idx} data={val} />
                ))}
              </ScrollArea>
              <form action={postComment.bind(null, image.id)} className="flex gap-2 items-end h-full">
                <div className="flex-1">
                  <FormInput name="text" />
                </div>
                <Button>
                  <Send />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Comment = ({ data }: { data: ExtendedImage["comments"][number] }) => {
  return (
    <div className="flex items-start space-x-2 my-2">
      <Avatar>
        <AvatarFallback>??</AvatarFallback>
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="text-gray-800 flex flex-col">
        <div className='text-sm flex gap-2'>
          <Link href={`/profile/${data.userName}`}>
            <h1 className='font-bold hover:underline'>{data.userName}</h1>
          </Link>
          <p>{data.text}</p>
        </div>
        <p className='text-[12px]'>{formatDistanceToNow(data.createdAt)}</p>
      </div>
    </div>
  )
}

const UpdateImage = ({ data }: { data: Omit<ExtendedImage, "user" | "comments"> }) => {
  const [tags, setTags] = useState<string[]>(data.tags?.split(",") ?? [])
  const [state, action] = useActionState(updateImage, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.success) {
      toast.success("Image updated.")
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pen />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Image</DialogTitle>
        <form action={action} className="flex flex-col gap-4">
          <FormInput
            label="Title"
            name="title"
            defaultValue={data.title}
          />
          <FormInput
            label="Description"
            name="description"
            defaultValue={data.description ?? ""}
          />
          <MultiSelect
            label="Tags"
            defaultValue={data.tags?.split(",")}
            options={imageTags.map(val => ({ value: val, label: val }))}
            onValueChange={(val) => setTags(val)}
          />
          <input type="hidden" name="tags" value={tags.join(",") ?? ""} />
          <input type="hidden" name="id" value={data.id} />
          <Button>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DeleteImage = ({ id }: { id: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Are you sure?
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        </DialogTitle>

        <form action={deleteImage.bind(null, id)}>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}