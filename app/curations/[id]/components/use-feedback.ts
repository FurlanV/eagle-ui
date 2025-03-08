import { useState, useRef, useEffect, useCallback } from 'react'
import { useAddOrUpdateFeedbackMutation, useGetUserFeedbackForCasesMutation } from "@/services/feedback/feedback"
import { CaseData, FeedbackState, FeedbackHandlers } from './types'
import { toast } from "@/components/ui/use-toast"

export const useFeedback = (caseDetailsData: CaseData[]) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
    const [likedCases, setLikedCases] = useState<Record<number, boolean>>({})
    const [dislikedCases, setDislikedCases] = useState<Record<number, boolean>>({})
    const [flaggedCases, setFlaggedCases] = useState<Record<number, boolean>>({})
    const [flaggedForRescoring, setFlaggedForRescoring] = useState<Record<number, boolean>>({})
    const [likeComments, setLikeComments] = useState<Record<number, string>>({})
    const [dislikeComments, setDislikeComments] = useState<Record<number, string>>({})
    const [tempComment, setTempComment] = useState<string>("")
    const [activeCommentType, setActiveCommentType] = useState<Record<number, string | null>>({})
    const [flagComments, setFlagComments] = useState<Record<number, string>>({})
    const [activeFlagModal, setActiveFlagModal] = useState<{
        id: number | null
        type: string | null
    }>({ id: null, type: null })
    const [userFeedbacks, setUserFeedbacks] = useState<any[]>([])

    const commentInputRef = useRef<HTMLTextAreaElement>(null)
    const flagCommentInputRef = useRef<HTMLTextAreaElement>(null)

    const [addOrUpdateFeedback, { isLoading: isAddingFeedback }] = useAddOrUpdateFeedbackMutation()
    const [getUserFeedbackForCases, { isLoading: isGettingUserFeedbackForCases }] = useGetUserFeedbackForCasesMutation()

    const getUserFeedbacks = useCallback(async () => {
        if (caseDetailsData && caseDetailsData.length > 0) {
            const cases: string[] = []
            caseDetailsData.map((caseData: any) => {
                cases.push(caseData.id)
            })
            const feedback = await getUserFeedbackForCases({ case_ids: cases })
            setUserFeedbacks(feedback.data)
        }
    }, [caseDetailsData])

    useEffect(() => {
        getUserFeedbacks()
    }, [getUserFeedbacks])

    // Effect to focus the textarea when it appears
    useEffect(() => {
        if (commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }, [activeCommentType])

    // Effect to focus the flag comment textarea when the modal appears
    useEffect(() => {
        if (flagCommentInputRef.current && activeFlagModal.id !== null) {
            flagCommentInputRef.current.focus()
        }
    }, [activeFlagModal])

    // Function to toggle row expansion
    const toggleRowExpanded = (id: number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    // Function to handle like
    const handleLike = (id: number, comment?: string) => {
        // Check if the case is currently liked using the same logic as the UI
        const userFeedback = userFeedbacks && userFeedbacks[id] ? userFeedbacks[id] : null
        const isCurrentlyLiked = userFeedback ? userFeedback.liked : (likedCases[id] || false)

        // If disliked, remove dislike
        if (dislikedCases[id]) {
            setDislikedCases((prev) => ({
                ...prev,
                [id]: false,
            }))

            // Update the dislikes count in the caseDetailsData
            const caseIndex = caseDetailsData.findIndex((c) => c.id === id)
            if (caseIndex !== -1 && caseDetailsData[caseIndex].dislikes_count > 0) {
                const updatedCaseData = [...caseDetailsData]
                updatedCaseData[caseIndex] = {
                    ...updatedCaseData[caseIndex],
                    dislikes_count: updatedCaseData[caseIndex].dislikes_count - 1,
                }
                // Note: In a real implementation, you would update the state here
                // This is just to show the logic, but we can't directly modify the props
            }
        }

        // Toggle like
        setLikedCases((prev) => ({
            ...prev,
            [id]: !isCurrentlyLiked,
        }))

        // Update the likes count in the caseDetailsData
        const caseIndex = caseDetailsData.findIndex((c) => c.id === id)
        if (caseIndex !== -1) {
            const updatedCaseData = [...caseDetailsData]
            updatedCaseData[caseIndex] = {
                ...updatedCaseData[caseIndex],
                likes_count: isCurrentlyLiked
                    ? Math.max(0, updatedCaseData[caseIndex].likes_count - 1)
                    : updatedCaseData[caseIndex].likes_count + 1,
            }
            // Note: In a real implementation, you would update the state here
            // This is just to show the logic, but we can't directly modify the props
        }

        // Save comment if provided
        if (comment) {
            setLikeComments((prev) => ({
                ...prev,
                [id]: comment,
            }))
        }

        // Close comment input
        setActiveCommentType((prev) => ({
            ...prev,
            [id]: null,
        }))

        // Determine the feedback type and message for toast
        const feedbackType = !isCurrentlyLiked ? "like" : "none"
        const toastMessage = !isCurrentlyLiked ? "Case liked successfully" : "Like removed successfully"

        // Call the feedback API
        addOrUpdateFeedback({
            case_id: id,
            feedback_type: feedbackType, // If already liked, toggling means removing the like
            comment: comment || "",
        })
            .unwrap()
            .then(() => {
                toast({
                    title: "Success",
                    description: toastMessage,
                    variant: "default",
                })
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: "Failed to update feedback. Please try again.",
                    variant: "destructive",
                })
                
                // Revert UI changes on error
                setLikedCases((prev) => ({
                    ...prev,
                    [id]: isCurrentlyLiked,
                }))
                
                // If we were removing a like and it failed, restore the like count
                if (isCurrentlyLiked && caseIndex !== -1) {
                    const updatedCaseData = [...caseDetailsData]
                    updatedCaseData[caseIndex] = {
                        ...updatedCaseData[caseIndex],
                        likes_count: updatedCaseData[caseIndex].likes_count + 1,
                    }
                }
            })
    }

    // Function to handle dislike
    const handleDislike = (id: number, comment?: string) => {
        // Check if the case is currently disliked using the same logic as the UI
        const userFeedback = userFeedbacks && userFeedbacks[id] ? userFeedbacks[id] : null
        const isCurrentlyDisliked = userFeedback ? userFeedback.disliked : (dislikedCases[id] || false)

        // If liked, remove like
        if (likedCases[id]) {
            setLikedCases((prev) => ({
                ...prev,
                [id]: false,
            }))

            // Update the likes count in the caseDetailsData
            const caseIndex = caseDetailsData.findIndex((c) => c.id === id)
            if (caseIndex !== -1 && caseDetailsData[caseIndex].likes_count > 0) {
                const updatedCaseData = [...caseDetailsData]
                updatedCaseData[caseIndex] = {
                    ...updatedCaseData[caseIndex],
                    likes_count: updatedCaseData[caseIndex].likes_count - 1,
                }
                // Note: In a real implementation, you would update the state here
                // This is just to show the logic, but we can't directly modify the props
            }
        }

        // Toggle dislike
        setDislikedCases((prev) => ({
            ...prev,
            [id]: !isCurrentlyDisliked,
        }))

        // Update the dislikes count in the caseDetailsData
        const caseIndex = caseDetailsData.findIndex((c) => c.id === id)
        if (caseIndex !== -1) {
            const updatedCaseData = [...caseDetailsData]
            updatedCaseData[caseIndex] = {
                ...updatedCaseData[caseIndex],
                dislikes_count: isCurrentlyDisliked
                    ? Math.max(0, updatedCaseData[caseIndex].dislikes_count - 1)
                    : updatedCaseData[caseIndex].dislikes_count + 1,
            }
            // Note: In a real implementation, you would update the state here
            // This is just to show the logic, but we can't directly modify the props
        }

        // Save comment if provided
        if (comment) {
            setDislikeComments((prev) => ({
                ...prev,
                [id]: comment,
            }))
        }

        // Close comment input
        setActiveCommentType((prev) => ({
            ...prev,
            [id]: null,
        }))

        // Determine the feedback type and message for toast
        const feedbackType = !isCurrentlyDisliked ? "dislike" : "none"
        const toastMessage = !isCurrentlyDisliked ? "Case disliked successfully" : "Dislike removed successfully"

        // Call the feedback API
        addOrUpdateFeedback({
            case_id: id,
            feedback_type: feedbackType, // If already disliked, toggling means removing the dislike
            comment: comment || "",
        })
            .unwrap()
            .then(() => {
                console.log(`Feedback for case ${id} successfully submitted`)
                // Show success toast
                toast({
                    title: "Success",
                    description: toastMessage,
                    variant: "default",
                })
            })
            .catch((error) => {
                console.error(`Error submitting feedback for case ${id}:`, error)
                // Show error toast
                toast({
                    title: "Error",
                    description: "Failed to update feedback. Please try again.",
                    variant: "destructive",
                })
                
                // Revert UI changes on error
                setDislikedCases((prev) => ({
                    ...prev,
                    [id]: isCurrentlyDisliked,
                }))
                
                // If we were removing a dislike and it failed, restore the dislike count
                if (isCurrentlyDisliked && caseIndex !== -1) {
                    const updatedCaseData = [...caseDetailsData]
                    updatedCaseData[caseIndex] = {
                        ...updatedCaseData[caseIndex],
                        dislikes_count: updatedCaseData[caseIndex].dislikes_count + 1,
                    }
                    // Note: In a real implementation, you would update the state here
                }
            })
    }

    // Function to flag a case
    const flagCase = (id: number, flagType: string, comment?: string) => {
        if (flagType === "deletion") {
            setFlaggedCases((prev) => ({
                ...prev,
                [id]: true,
            }))
            setFlaggedForRescoring((prev) => ({
                ...prev,
                [id]: false,
            }))
            if (comment) {
                setFlagComments((prev) => ({
                    ...prev,
                    [id]: comment,
                }))
            }
            console.log(
                `Case ${id} flagged for deletion${comment ? `, Comment: ${comment}` : ""
                }`
            )
        } else if (flagType === "rescoring") {
            setFlaggedForRescoring((prev) => ({
                ...prev,
                [id]: true,
            }))
            setFlaggedCases((prev) => ({
                ...prev,
                [id]: false,
            }))
            if (comment) {
                setFlagComments((prev) => ({
                    ...prev,
                    [id]: comment,
                }))
            }
            console.log(
                `Case ${id} flagged for rescoring${comment ? `, Comment: ${comment}` : ""
                }`
            )
        }
        // Close the modal after flagging
        setActiveFlagModal({ id: null, type: null })
    }

    const feedbackState: FeedbackState = {
        likedCases,
        dislikedCases,
        flaggedCases,
        flaggedForRescoring,
        likeComments,
        dislikeComments,
        flagComments,
        activeCommentType,
        tempComment,
        activeFlagModal
    }

    const feedbackHandlers: FeedbackHandlers = {
        handleLike,
        handleDislike,
        flagCase,
        setActiveCommentType,
        setTempComment,
        setActiveFlagModal
    }

    return {
        expandedRows,
        toggleRowExpanded,
        feedbackState,
        feedbackHandlers,
        commentInputRef,
        flagCommentInputRef,
        isAddingFeedback,
        userFeedbacks
    }
} 