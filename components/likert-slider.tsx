import React from "react"
import { Slider } from "./ui/slider"
import { cn } from "@/lib/utils"

interface LikertSliderProps {
  options?: string[]
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function LikertSlider({
  options = ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
}: LikertSliderProps) {
  // Ensure the number of options matches the slider range
  if (options.length !== max - min + 1) {
    console.warn(
      "The number of options should match the range of the slider (max - min + 1)."
    )
  }

  return (
    <div className="w-full">
      {/* Add labels above slider */}
      <div className="flex justify-between text-sm mb-1">
        {options.map((option, index) => (
          <span
            key={`label-${index}`}
            className={cn(
              "flex-1 text-center px-2",
              index === 0 && "text-left",
              index === options.length - 1 && "text-right",
              value === index + 1 && "font-semibold text-primary"
            )}
          >
            {value === index + 1 && option}
          </span>
        ))}
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="mb-2" // Reduced margin
        aria-label="Likert Scale Slider"
        marks={options.map((_, i) => ({ value: i + 1 }))}
      />
      {/* Keep existing labels below */}
      <div className="flex justify-between text-sm">
        {options.map((option, index) => (
          <span
            key={`value-${index}`}
            className={cn(
              "flex-1 text-center px-2 text-muted-foreground",
              index === 0 && "text-left",
              index === options.length - 1 && "text-right"
            )}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  )
}
