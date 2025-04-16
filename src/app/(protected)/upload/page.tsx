"use client"

import FormInput from "@/components/form-input";
import ImageUpload from "@/components/image-input";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { imageTags } from "@/lib/constant";
import { showError } from "@/lib/show-error";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { upload } from "./action";

export default function UploadImage() {
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