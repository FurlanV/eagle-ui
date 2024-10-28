"use client"

import { useCallback, useEffect, useState } from "react"
import {
  useCreateCurationReviewMutation,
  useGetCurationReviewsByJobIdQuery,
  useUpdateCurationReviewMutation,
} from "@/services/eagle/review"

import { CurationReview } from "@/types/curation-review"
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

  const { data: curationReviews, isLoading: isLoadingCurationReviews } =
    useGetCurationReviewsByJobIdQuery(job_id, {
      skip: !job_id,
      refetchOnMountOrArgChange: true,
    })
  const [createCurationReview, { isLoading: isCreatingCurationReview }] =
    useCreateCurationReviewMutation()
  const [updateCurationReview, { isLoading: isUpdatingCurationReview }] =
    useUpdateCurationReviewMutation()

  // Add useEffect to populate review state when curation reviews are loaded

  const setReviewData = useCallback(
    (curationReviews: CurationReview) => {
      setReview({
        paperAnalysis: {
          rating: curationReviews.paper_analysis_rating || 0,
          comment: curationReviews.paper_analysis_comment || "",
        },
        evidenceSummary: {
          rating: curationReviews.evidence_summary_rating || 0,
          comment: curationReviews.evidence_summary_comment || "",
        },
        evidenceScore: {
          rating: curationReviews.evidence_score_rating || 0,
          comment: curationReviews.evidence_score_comment || "",
        },
      })
    },
    [curationReviews]
  )

  useEffect(() => {
    if (curationReviews) {
      setReviewData(curationReviews)
    }
  }, [curationReviews])

  //console.log(curationReviews)

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

  const handleSave = () => {
    if (curationReviews) {
      updateCurationReview({
        ...curationReviews,
        paper_analysis_rating: review.paperAnalysis.rating,
        paper_analysis_comment: review.paperAnalysis.comment,
        evidence_summary_rating: review.evidenceSummary.rating,
        evidence_summary_comment: review.evidenceSummary.comment,
        evidence_score_rating: review.evidenceScore.rating,
        evidence_score_comment: review.evidenceScore.comment,
      })
    } else {
      createCurationReview({
        ...curationReviews,
        job_id: job_id,
        paper_analysis_rating: review.paperAnalysis.rating,
        paper_analysis_comment: review.paperAnalysis.comment,
        evidence_summary_rating: review.evidenceSummary.rating,
        evidence_summary_comment: review.evidenceSummary.comment,
        evidence_score_rating: review.evidenceScore.rating,
        evidence_score_comment: review.evidenceScore.comment,
      })
    }
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
          <DialogDescription className="text-muted-foreground">
            {job_status}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-6">
            {Object.entries(review).map(([category, values]) => (
              <div key={category} className="space-y-3">
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium capitalize text-base">
                    {category
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .toLowerCase()}
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
                  onChange={(e) =>
                    handleCommentChange(category, e.target.value)
                  }
                  className="h-24 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isCreatingCurationReview || isUpdatingCurationReview}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
