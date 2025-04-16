"use client"

import NextImage, { ImageProps } from "next/image"
import { useState } from "react"
import clsx from "clsx"

interface ImageWithSkeletonProps extends ImageProps {}

export const Image = ({ className, ...props }: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={clsx("relative w-full", className)}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-zinc-200 rounded-lg" />
      )}
      <NextImage
        {...props}
        className={clsx(
          "transition-opacity duration-500 ease-in-out rounded-lg",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
