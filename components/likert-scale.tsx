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
  options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
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
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="mb-4"
        aria-label="Likert Scale Slider"
      />
      <div className="flex justify-between text-sm">
        {options.map((option, index) => (
          <span key={index} className="flex-1 text-center">
            {option}
          </span>
        ))}
      </div>
    </div>
  )
}
