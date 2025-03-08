import React, { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

// Define interface for CommentInput props
interface CommentInputProps {
  id: number;
  isCommentingLike: boolean;
  buttonPosition: { top: number; left: number };
  tempComment: string;
  setTempComment: (comment: string) => void;
  handleLike: (id: number, comment?: string) => void;
  handleDislike: (id: number, comment?: string) => void;
  setActiveCommentType: (callback: (prev: Record<number, string | null>) => Record<number, string | null>) => void;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
}

// Separate component for the comment input to prevent re-renders
const CommentInput: React.FC<CommentInputProps> = ({
  id,
  isCommentingLike,
  buttonPosition,
  tempComment,
  setTempComment,
  handleLike,
  handleDislike,
  setActiveCommentType,
  commentInputRef
}) => {
  // Use local state to prevent parent re-renders from affecting this component
  const [localComment, setLocalComment] = useState(tempComment);
  
  // Update parent state only when saving
  const handleSave = () => {
    if (isCommentingLike) {
      handleLike(id, localComment);
    } else {
      handleDislike(id, localComment);
    }
    setTempComment("");
  };
  
  // Update local state when typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalComment(e.target.value);
  };
  
  // Focus the textarea on mount
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [commentInputRef]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSave();
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setActiveCommentType((prev) => ({
      ...prev,
      [id]: null,
    }));
  };
  
  return createPortal(
    <div 
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: `${buttonPosition.top}px`,
        left: `${buttonPosition.left}px`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`relative border rounded-lg p-3 shadow-lg ${
          isCommentingLike
            ? "border-green-200 bg-white"
            : "border-red-200 bg-white"
        }`}
      >
        {/* Arrow pointing down to the button */}
        <div 
          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
            isCommentingLike
              ? "bg-white border-b border-r border-green-200"
              : "bg-white border-b border-r border-red-200"
          }`}
        />
        
        <div className="mb-2 flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isCommentingLike ? "text-green-700" : "text-red-700"
          }`}>
            {isCommentingLike
              ? "What do you like about this case?"
              : "What do you dislike about this case?"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-100"
            onClick={handleCancel}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <Textarea
          ref={commentInputRef}
          placeholder="Add your comment here..."
          value={localComment}
          onChange={handleChange}
          className={`text-sm min-h-[100px] w-full min-w-[300px] border ${
            isCommentingLike
              ? "border-green-200 focus-visible:ring-green-200 placeholder:text-green-400"
              : "border-red-200 focus-visible:ring-red-200 placeholder:text-red-400"
          }`}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant={isCommentingLike ? "default" : "destructive"}
            size="sm"
            className="text-xs"
            onClick={handleSave}
          >
            {isCommentingLike ? "Save Like" : "Save Dislike"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

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

  // State to track the position of the comment balloon
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  
  // Calculate button position only when comment mode changes
  const calculateButtonPosition = useCallback((isLike: boolean) => {
    const buttonId = isLike ? `like-button-${id}` : `dislike-button-${id}`;
    const buttonElement = document.getElementById(buttonId);
    
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setButtonPosition({
        top: rect.top - 220,
        left: rect.left - 150
      });
    }
  }, [id]);
  
  // Update position when comment mode changes
  useEffect(() => {
    if (isCommentingLike) {
      calculateButtonPosition(true);
    } else if (isCommentingDislike) {
      calculateButtonPosition(false);
    }
  }, [isCommentingLike, isCommentingDislike, calculateButtonPosition]);

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
                  } else if (isLiked) {
                    // If already liked, just remove the like without showing comment input
                    handleLike(id)
                  } else {
                    // Toggle comment mode only when adding a like
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
                } relative`}
                id={`like-button-${id}`}
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
                } relative`}
                id={`dislike-button-${id}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isCommentingDislike) {
                    // If already commenting, just toggle the dislike
                    handleDislike(id)
                  } else if (isDisliked) {
                    // If already disliked, just remove the dislike without showing comment input
                    handleDislike(id)
                  } else {
                    // Toggle comment mode only when adding a dislike
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

      {/* Render comment input as a portal to prevent re-renders */}
      {(isCommentingLike || isCommentingDislike) && (
        <CommentInput
          id={id}
          isCommentingLike={isCommentingLike}
          buttonPosition={buttonPosition}
          tempComment={tempComment}
          setTempComment={setTempComment}
          handleLike={handleLike}
          handleDislike={handleDislike}
          setActiveCommentType={setActiveCommentType}
          commentInputRef={commentInputRef}
        />
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