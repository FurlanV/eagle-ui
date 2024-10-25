"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { LikertSlider } from "@/components/likert-slider"

import { Icons } from "./icons"

export function CurationReviewDialog({ job_id, job_name, job_status }: any) {
  const [review, setReview] = useState({
    paperAnalysis: { rating: 0, comment: "" },
    evidenceSummary: { rating: 0, comment: "" },
    evidenceScore: { rating: 0, comment: "" },
  })

  const handleRatingChange = (category: string, value: number) => {
    setReview((prev) => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], rating: value },
    }))
  }

  const handleCommentChange = (category: string, value: string) => {
    setReview((prev) => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], comment: value },
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icons.star className="w-4 h-4 mr-2 text-yellow-500" />
          Output Rating
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[950px] sm:max-w-[calc(100vw-100px)] max-h-[90vh] p-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">{job_name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{job_status}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-6">
            {Object.entries(review).map(([category, values]) => (
              <div key={category} className="space-y-3">
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium capitalize text-base">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h4>
                  <div className="w-full">
                    <LikertSlider
                      value={values.rating}
                      onChange={(value) => handleRatingChange(category, value)}
                    />
                  </div>
                </div>
                <Textarea
                  placeholder={`Add your ${category} comment here...`}
                  value={values.comment}
                  onChange={(e) => handleCommentChange(category, e.target.value)}
                  className="h-24 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
