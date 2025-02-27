import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface ThumbsRatingProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

export function ThumbsRating({ value, onChange }: ThumbsRatingProps) {
  return (
    <div className="flex items-center space-x-4">
      <ThumbsUp
        className={`h-8 w-8 cursor-pointer ${value === true ? "text-green-500" : "text-gray-300"}`}
        onClick={() => onChange(value === true ? null : true)}
      />
      <ThumbsDown
        className={`h-8 w-8 cursor-pointer ${value === false ? "text-red-500" : "text-gray-300"}`}
        onClick={() => onChange(value === false ? null : false)}
      />
    </div>
  )
}
