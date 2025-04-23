import { buttonVariants } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl">
          the page you looking for is not found. 😓
        </h1>
        <Link href="/" className={buttonVariants()}>
          <Home/> Home
        </Link>
      </div>
    </div>
  )
}