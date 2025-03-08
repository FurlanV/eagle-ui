import React, { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ThumbsUp, ThumbsDown, Flag, X } from "lucide-react"
import { CaseData, FeedbackState, FeedbackHandlers } from './types'

interface FeedbackControlsProps {
  caseData: CaseData
  feedbackState: FeedbackState
  handlers: FeedbackHandlers
  commentInputRef: React.RefObject<HTMLTextAreaElement>
  flagCommentInputRef: React.RefObject<HTMLTextAreaElement>
  userFeedbacks: any
}

export const FeedbackControls: React.FC<FeedbackControlsProps> = ({
  caseData,
  feedbackState,
  handlers,
  commentInputRef,
  flagCommentInputRef,
  userFeedbacks
}) => {
  const {
    likedCases,
    dislikedCases,
    flaggedCases,
    flaggedForRescoring,
    likeComments,
    dislikeComments,
    flagComments,
    activeCommentType,
    tempComment,
    activeFlagModal,
  } = feedbackState

  const {
    handleLike,
    handleDislike,
    flagCase,
    setActiveCommentType,
    setTempComment,
    setActiveFlagModal,
  } = handlers

  const id = caseData.id
  
  // Use userFeedbacks data if available, otherwise fall back to feedbackState
  const userFeedback = userFeedbacks && userFeedbacks[id] ? userFeedbacks[id] : null
  
  const isLiked = userFeedback ? userFeedback.liked : (likedCases[id] || false)
  const isDisliked = userFeedback ? userFeedback.disliked : (dislikedCases[id] || false)
  const isFlagged = userFeedback ? userFeedback.flagged : (flaggedCases[id] || false)
  const isFlaggedForRescoring = userFeedback ? userFeedback.flagged_for_rescoring : (flaggedForRescoring[id] || false)
  
  // For comments, check both sources
  const userLikeComment = userFeedback && userFeedback.liked ? userFeedback.comment : null
  const userDislikeComment = userFeedback && userFeedback.disliked ? userFeedback.comment : null
  const userFlagComment = userFeedback && (userFeedback.flagged || userFeedback.flagged_for_rescoring) ? userFeedback.comment : null
  
  const isCommentingLike = activeCommentType[id] === "like"
  const isCommentingDislike = activeCommentType[id] === "dislike"
  const hasLikeComment = userLikeComment || (likeComments[id] && likeComments[id].length > 0)
  const hasDislikeComment = userDislikeComment || (dislikeComments[id] && dislikeComments[id].length > 0)

  // Use the appropriate comment source
  const displayLikeComment = userLikeComment || likeComments[id] || ""
  const displayDislikeComment = userDislikeComment || dislikeComments[id] || ""
  const displayFlagComment = userFlagComment || flagComments[id] || ""

  return (
    <div
      className="flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center space-x-2">
        {/* Like Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isCommentingLike) {
                    // If already commenting, just toggle the like
                    handleLike(id)
                  } else {
                    // Toggle comment mode
                    setActiveCommentType((prev) => ({
                      ...prev,
                      [id]: isCommentingLike ? null : "like",
                    }))
                    setTempComment(displayLikeComment)
                  }
                }}
                className={`p-1 ${
                  isLiked
                    ? "text-green-500 bg-green-50"
                    : caseData.likes_count > 0
                    ? "text-gray-600 bg-green-50/30"
                    : "text-gray-400"
                } ${
                  hasLikeComment
                    ? "ring-1 ring-green-200 rounded-full"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      isLiked
                        ? "fill-green-500"
                        : caseData.likes_count > 0
                        ? "fill-green-200"
                        : ""
                    }`}
                  />
                  {caseData.likes_count > 0 && (
                    <span
                      className={`ml-1 text-xs font-medium ${
                        isLiked ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {caseData.likes_count}
                    </span>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            {(hasLikeComment || caseData.likes_count > 0) && (
              <TooltipContent
                side="top"
                className="max-w-xs bg-green-50 border-green-200"
              >
                <div className="flex flex-col">
                  {caseData.likes_count > 0 && (
                    <span className="text-xs font-medium text-green-700 mb-1">
                      {caseData.likes_count}{" "}
                      {caseData.likes_count === 1
                        ? "person has"
                        : "people have"}{" "}
                      liked this case
                      {isLiked && " (including you)"}
                    </span>
                  )}
                  {hasLikeComment && (
                    <>
                      <span className="text-xs font-medium text-green-700 mb-1">
                        Your positive feedback:
                      </span>
                      <p className="text-sm text-green-800">
                        {displayLikeComment}
                      </p>
                    </>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Dislike Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${
                  isDisliked
                    ? "text-red-500 bg-red-50"
                    : caseData.dislikes_count > 0
                    ? "text-gray-600 bg-red-50/30"
                    : "text-gray-400"
                } ${
                  hasDislikeComment
                    ? "ring-1 ring-red-200 rounded-full"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isCommentingDislike) {
                    // If already commenting, just toggle the dislike
                    handleDislike(id)
                  } else {
                    // Toggle comment mode
                    setActiveCommentType((prev) => ({
                      ...prev,
                      [id]: isCommentingDislike ? null : "dislike",
                    }))
                    setTempComment(displayDislikeComment)
                  }
                }}
              >
                <div className="flex items-center">
                  <ThumbsDown
                    className={`h-4 w-4 ${
                      isDisliked
                        ? "fill-red-500"
                        : caseData.dislikes_count > 0
                        ? "fill-red-200"
                        : ""
                    }`}
                  />
                  {caseData.dislikes_count > 0 && (
                    <span
                      className={`ml-1 text-xs font-medium ${
                        isDisliked ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {caseData.dislikes_count}
                    </span>
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            {(hasDislikeComment || caseData.dislikes_count > 0) && (
              <TooltipContent className="max-w-xs bg-red-50 border-red-200">
                <div className="flex flex-col">
                  {caseData.dislikes_count > 0 && (
                    <span className="text-xs font-medium text-red-700 mb-1">
                      {caseData.dislikes_count}{" "}
                      {caseData.dislikes_count === 1
                        ? "person has"
                        : "people have"}{" "}
                      disliked this case
                      {isDisliked && " (including you)"}
                    </span>
                  )}
                  {hasDislikeComment && (
                    <>
                      <span className="text-xs font-medium text-red-700 mb-1">
                        Your negative feedback:
                      </span>
                      <p className="text-sm text-red-800">
                        {displayDislikeComment}
                      </p>
                    </>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Flag for rescoring button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${
                  isFlaggedForRescoring
                    ? "text-amber-500 bg-amber-50 ring-1 ring-amber-200 rounded-full"
                    : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveFlagModal({ id, type: "rescoring" })
                }}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {isFlaggedForRescoring && displayFlagComment ? (
              <TooltipContent className="max-w-xs bg-amber-50 border-amber-200">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-amber-700 mb-1">
                    Flagged for rescoring:
                  </span>
                  <p className="text-sm text-amber-800">
                    {displayFlagComment}
                  </p>
                </div>
              </TooltipContent>
            ) : (
              <TooltipContent>
                <p className="text-xs">Flag for rescoring</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Flag for deletion button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${
                  isFlagged ? "text-red-500 bg-red-50 ring-1 ring-red-200 rounded-full" : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveFlagModal({ id, type: "deletion" })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {isFlagged && displayFlagComment ? (
              <TooltipContent className="max-w-xs bg-red-50 border-red-200">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-red-700 mb-1">
                    Flagged for deletion:
                  </span>
                  <p className="text-sm text-red-800">
                    {displayFlagComment}
                  </p>
                </div>
              </TooltipContent>
            ) : (
              <TooltipContent>
                <p className="text-xs">Flag for deletion</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Inline comment input for like/dislike */}
      {(isCommentingLike || isCommentingDislike) && (
        <div className="mt-2 w-full max-w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`relative border rounded-md p-2 shadow-sm ${
              isCommentingLike
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="mb-1 flex justify-between items-center">
              <span className="text-xs font-medium px-1">
                {isCommentingLike
                  ? "What do you like about this case?"
                  : "What do you dislike about this case?"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => {
                  setActiveCommentType((prev) => ({
                    ...prev,
                    [id]: null,
                  }))
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              ref={commentInputRef}
              placeholder="Add your comment here..."
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              className={`text-sm min-h-[80px] w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                isCommentingLike
                  ? "bg-green-50 placeholder:text-green-400"
                  : "bg-red-50 placeholder:text-red-400"
              }`}
              onKeyDown={(e) => {
                // Submit on Ctrl+Enter or Cmd+Enter
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  if (isCommentingLike) {
                    handleLike(id, tempComment)
                  } else {
                    handleDislike(id, tempComment)
                  }
                  setTempComment("")
                }
              }}
            />
            <div className="flex justify-end mt-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-xs ${
                  isCommentingLike
                    ? "text-green-700 hover:text-green-800 hover:bg-green-100"
                    : "text-red-700 hover:text-red-800 hover:bg-red-100"
                }`}
                onClick={() => {
                  if (isCommentingLike) {
                    handleLike(id, tempComment)
                  } else {
                    handleDislike(id, tempComment)
                  }
                  setTempComment("")
                }}
              >
                Save Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {activeFlagModal.id === id && (
        <Dialog
          open={true}
          onOpenChange={() => setActiveFlagModal({ id: null, type: null })}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {activeFlagModal.type === "deletion"
                  ? "Flag Case for Deletion"
                  : "Flag Case for Rescoring"}
              </DialogTitle>
              <DialogDescription>
                Please explain why you are flagging this case.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="flag-comment">Comment</Label>
                <Textarea
                  id="flag-comment"
                  ref={flagCommentInputRef}
                  placeholder="Please provide your reasoning..."
                  className="min-h-[100px]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveFlagModal({ id: null, type: null })
                }}
              >
                Cancel
              </Button>
              <Button
                variant={
                  activeFlagModal.type === "deletion"
                    ? "destructive"
                    : "default"
                }
                onClick={(e) => {
                  e.stopPropagation()
                  if (
                    activeFlagModal.id !== null &&
                    activeFlagModal.type !== null &&
                    flagCommentInputRef.current
                  ) {
                    flagCase(
                      activeFlagModal.id,
                      activeFlagModal.type,
                      flagCommentInputRef.current.value
                    )
                  }
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 