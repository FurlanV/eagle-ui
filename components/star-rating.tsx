"use client"

import { Star } from "lucide-react"
import { useState, useRef } from "react"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent, starValue: number) => {
    const { left, width } = containerRef.current!.getBoundingClientRect()
    const clickPosition = event.clientX - left
    const starWidth = width / max
    const isHalf = clickPosition < starWidth / 2
    const newValue = isHalf ? starValue - 0.5 : starValue
    onChange(newValue)
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className="flex gap-1" ref={containerRef}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1
        let fillPercentage = 0

        if (displayValue >= starValue) {
          fillPercentage = 100
        } else if (displayValue >= starValue - 0.5) {
          fillPercentage = 50
        }

        return (
          <div
            key={index}
            className="relative cursor-pointer"
            onMouseMove={(e) => {
              const { left, width } = containerRef.current!.getBoundingClientRect()
              const hoverPos = e.clientX - left - index * (width / max)
              const isHalf = hoverPos < (width / max) / 2
              const newHoverValue = isHalf ? starValue - 0.5 : starValue
              setHoverValue(newHoverValue)
            }}
            onMouseLeave={() => setHoverValue(null)}
            onClick={(e) => handleClick(e, starValue)}
          >
            <Star
              className="h-5 w-5 text-gray-300"
              fill="none"
              stroke="currentColor"
            />
            <Star
              className={`h-5 w-5 absolute top-0 left-0 text-yellow-400`}
              style={{ width: `${fillPercentage}%`, overflow: "hidden" }}
            />
          </div>
        )
      })}
    </div>
  )
}
