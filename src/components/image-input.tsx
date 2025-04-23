"use client"

import { Upload, X } from "lucide-react"
import { ChangeEvent, useRef, useState, type InputHTMLAttributes } from "react"
import { toast } from "sonner"

interface ImageUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  minWidth?: number
  minHeight?: number
  error?: string | string[] | undefined
}

export const ImageUpload = ({ className, error, minWidth = 300, minHeight = 300, ...props }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const ref = useRef<HTMLInputElement | null>(null)

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return toast.error("No file selected.")
    if (!file.type.startsWith("image/")) return toast.error("File must be an image.")
    if (!(await validateImage(file))) return toast.error(`Image must be at least ${minWidth}x${minHeight}px in size.`)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateImage = async (file: File): Promise<boolean> => {
    return new Promise((res) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        res(img.width >= minWidth && img.height >= minHeight)
      }
    })
  }

  const removeImage = () => {
    setPreview(null)
    if (ref.current) {
      ref.current.value = ""
    }
  }

  return (
    <div>
      <div
        className={`relative h-72 rounded-lg border-2 border-dashed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${preview ? 'p-0' : 'p-4'}
            bg-gray-50 transition-colors`}
        onClick={() => ref.current?.click()}
      >
        <input
          {...props}
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleImageChange(e)
            props.onChange?.(e)
          }}
        />

        {preview ? (
          <div className="relative h-full w-full group cursor-pointer p-2">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeImage()
              }}
              className="absolute top-4 right-4 p-1 rounded-full bg-white shadow-md
                  opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 cursor-pointer">
            <Upload className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-gray-400">or drag & drop file here.</p>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default ImageUpload