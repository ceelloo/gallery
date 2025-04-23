import type { Image, User } from "@/generated"

export const imageTags = [
  // Theme / Content
  "Nature",
  "Landscape",
  "Portrait",
  "Architecture",
  "Street",
  "Food",
  "Travel",
  "Art",
  "Fashion",
  "Technology",
  "Abstract",
  "Aesthetic",
  "Macro",
  "Night",
  "Minimalism",
  "Vintage",
  "Urban",
  "Still Life",

  // Color / Mood
  "Black and White",
  "Vibrant",
  "Pastel",
  "Dark",
  "Warm",
  "Cool",
  "Moody",
  "Colorful",
  "Monochrome",
  "Soft Tones",

  // Season
  "Morning",
  "Afternoon",
  "Sunset",
  "Golden Hour",
  "Summer",
  "Autumn",
  "Winter",
  "Spring",

  // Style
  "Cinematic",
  "Flat Lay",
  "Candid",
  "Editorial",
  "Conceptual",
  "Experimental",
  "Documentary",
  "Fine Art",

  // Subject
  "People",
  "Couple",
  "Children",
  "Animals",
  "Cityscape",
  "Cars",
  "Buildings",
  "Interiors",
]

export type ImageMetadata = {
  width: number
  height: number
  size: number
  type: string
  name: string
}

export type ExtendedImage = Image & {
  metadata: ImageMetadata
  user: User
}