import { InputHTMLAttributes } from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | string[] | undefined
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input {...props} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}