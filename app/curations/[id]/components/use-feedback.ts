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
    const [userFeedbacks, setUserFeedbacks] = useState<Record<number, any>>({})

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
            try {
                const response = await getUserFeedbackForCases({ case_ids: cases })
                console.log("API Response:", response)
                
                // Ensure the feedback data is an object with case IDs as keys
                if (response.data) {
                    console.log("Response Data Type:", typeof response.data, Array.isArray(response.data))
                    
                    // If the data is an array, convert it to an object
                    if (Array.isArray(response.data)) {
                        const feedbackObj: Record<number, any> = {}
                        response.data.forEach((item: any) => {
                            console.log("Feedback Item:", item)
                            if (item && item.case_id) {
                                feedbackObj[item.case_id] = item
                            }
                        })
                        console.log("Converted Feedback Object:", feedbackObj)
                        setUserFeedbacks(feedbackObj)
                    } else {
                        // If it's already an object, use it directly
                        console.log("Using Response Data Directly:", response.data)
                        setUserFeedbacks(response.data)
                    }
                }
            } catch (error) {
                console.error("Error fetching user feedbacks:", error)
            }
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

                // Update userFeedbacks state to reflect the change immediately
                setUserFeedbacks((prev) => {
                    // Create a copy of the previous state (as an object, not an array)
                    const newUserFeedbacks = { ...prev };

                    // Initialize the feedback object for this case if it doesn't exist
                    if (!newUserFeedbacks[id]) {
                        newUserFeedbacks[id] = {};
                    }

                    // Toggle the liked state
                    newUserFeedbacks[id] = {
                        ...newUserFeedbacks[id],
                        liked: !isCurrentlyLiked,
                        // If we're liking, make sure disliked is false
                        disliked: !isCurrentlyLiked ? false : newUserFeedbacks[id].disliked
                    };

                    // If we're removing the like, we might need to clean up
                    if (isCurrentlyLiked) {
                        // If there's no other feedback, we can remove the entire entry
                        if (!newUserFeedbacks[id].disliked &&
                            !newUserFeedbacks[id].remove &&
                            !newUserFeedbacks[id].rescore) {
                            delete newUserFeedbacks[id];
                        }
                    }

                    // If we have a comment, update it
                    if (comment) {
                        if (newUserFeedbacks[id]) {
                            newUserFeedbacks[id].comment = comment;
                        }
                    }

                    return newUserFeedbacks;
                });
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
                toast({
                    title: "Success",
                    description: toastMessage,
                    variant: "default",
                })

                // Update userFeedbacks state to reflect the change immediately
                setUserFeedbacks((prev) => {
                    // Create a copy of the previous state (as an object, not an array)
                    const newUserFeedbacks = { ...prev };

                    // Initialize the feedback object for this case if it doesn't exist
                    if (!newUserFeedbacks[id]) {
                        newUserFeedbacks[id] = {};
                    }

                    // Toggle the disliked state
                    newUserFeedbacks[id] = {
                        ...newUserFeedbacks[id],
                        disliked: !isCurrentlyDisliked,
                        // If we're disliking, make sure liked is false
                        liked: !isCurrentlyDisliked ? false : newUserFeedbacks[id].liked
                    };

                    // If we're removing the dislike and there's no other feedback, clean up
                    if (isCurrentlyDisliked) {
                        if (!newUserFeedbacks[id].liked &&
                            !newUserFeedbacks[id].remove &&
                            !newUserFeedbacks[id].rescore) {
                            delete newUserFeedbacks[id];
                        }
                    }

                    // If we have a comment, update it
                    if (comment) {
                        if (newUserFeedbacks[id]) {
                            newUserFeedbacks[id].comment = comment;
                        }
                    }

                    return newUserFeedbacks;
                });
            })
            .catch((error) => {
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
                }
            })
    }

    // Function to flag a case
    const flagCase = (id: number, flagType: string, comment?: string) => {
        // Check if the case is currently flagged using the same logic as the UI
        const userFeedback = userFeedbacks && userFeedbacks[id] ? userFeedbacks[id] : null
        
        // Explicitly check for both old and new field names
        const isCurrentlyFlaggedForDeletion = userFeedback ? 
            (userFeedback.remove !== undefined ? userFeedback.remove : userFeedback.flagged || false) : 
            (flaggedCases[id] || false)
        
        const isCurrentlyFlaggedForRescoring = userFeedback ? 
            (userFeedback.rescore !== undefined ? userFeedback.rescore : userFeedback.flagged_for_rescoring || false) : 
            (flaggedForRescoring[id] || false)

        console.log(`flagCase - ID: ${id}, Type: ${flagType}, Current Deletion: ${isCurrentlyFlaggedForDeletion}, Current Rescoring: ${isCurrentlyFlaggedForRescoring}`)
        console.log(`flagCase - userFeedback:`, userFeedback)

        let feedbackType = "none";
        let toastMessage = "";
        let newFlaggedState = false;

        if (flagType === "deletion") {
            // Toggle flag for deletion
            newFlaggedState = !isCurrentlyFlaggedForDeletion;
            setFlaggedCases((prev) => ({
                ...prev,
                [id]: newFlaggedState,
            }))
            // If we're flagging for deletion, make sure rescoring flag is off
            if (newFlaggedState) {
                setFlaggedForRescoring((prev) => ({
                    ...prev,
                    [id]: false,
                }))
            }

            feedbackType = newFlaggedState ? "remove" : "none";
            toastMessage = newFlaggedState ? "Case flagged for deletion" : "Flag for deletion removed";
        } else if (flagType === "rescoring") {
            // Toggle flag for rescoring
            newFlaggedState = !isCurrentlyFlaggedForRescoring;
            setFlaggedForRescoring((prev) => ({
                ...prev,
                [id]: newFlaggedState,
            }))
            // If we're flagging for rescoring, make sure deletion flag is off
            if (newFlaggedState) {
                setFlaggedCases((prev) => ({
                    ...prev,
                    [id]: false,
                }))
            }

            feedbackType = newFlaggedState ? "rescore" : "none";
            toastMessage = newFlaggedState ? "Case flagged for rescoring" : "Flag for rescoring removed";
        }

        console.log(`flagCase - New State: ${newFlaggedState}, Feedback Type: ${feedbackType}`)

        if (comment) {
            setFlagComments((prev) => ({
                ...prev,
                [id]: comment,
            }))
        }

        // Close the modal after flagging
        setActiveFlagModal({ id: null, type: null })

        // Call the feedback API
        addOrUpdateFeedback({
            case_id: id,
            feedback_type: feedbackType,
            comment: comment || "",
        })
            .unwrap()
            .then(() => {
                toast({
                    title: "Success",
                    description: toastMessage,
                    variant: "default",
                })

                // Update userFeedbacks state to reflect the change immediately
                setUserFeedbacks((prev) => {
                    // Create a copy of the previous state
                    const newUserFeedbacks = { ...prev };
                    console.log("Previous userFeedbacks:", prev)

                    // Initialize the feedback object for this case if it doesn't exist
                    if (!newUserFeedbacks[id]) {
                        newUserFeedbacks[id] = {};
                    }

                    if (flagType === "deletion") {
                        newUserFeedbacks[id] = {
                            ...newUserFeedbacks[id],
                            remove: newFlaggedState,
                            flagged: newFlaggedState, // For backward compatibility
                            rescore: false, // Turn off rescoring flag if setting deletion flag
                            flagged_for_rescoring: false // For backward compatibility
                        };
                        console.log(`Updated userFeedbacks for deletion - ID: ${id}, State:`, newUserFeedbacks[id])
                    } else if (flagType === "rescoring") {
                        newUserFeedbacks[id] = {
                            ...newUserFeedbacks[id],
                            rescore: newFlaggedState,
                            flagged_for_rescoring: newFlaggedState, // For backward compatibility
                            remove: false, // Turn off deletion flag if setting rescoring flag
                            flagged: false // For backward compatibility
                        };
                        console.log(`Updated userFeedbacks for rescoring - ID: ${id}, State:`, newUserFeedbacks[id])
                    }

                    // If we're removing the flag and there's no other feedback, clean up
                    if (!newFlaggedState &&
                        !newUserFeedbacks[id].liked &&
                        !newUserFeedbacks[id].disliked &&
                        (flagType === "deletion" ? 
                            (!newUserFeedbacks[id].rescore && !newUserFeedbacks[id].flagged_for_rescoring) : 
                            (!newUserFeedbacks[id].remove && !newUserFeedbacks[id].flagged))) {
                        delete newUserFeedbacks[id];
                        console.log(`Removed userFeedbacks entry for ID: ${id}`)
                    }

                    // If we have a comment, update it
                    if (comment) {
                        if (newUserFeedbacks[id]) {
                            newUserFeedbacks[id].comment = comment;
                            console.log(`Updated comment for ID: ${id}:`, comment)
                        }
                    }

                    console.log("New userFeedbacks:", newUserFeedbacks)
                    return newUserFeedbacks;
                });
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: "Failed to update feedback. Please try again.",
                    variant: "destructive",
                })

                // Revert UI changes on error
                if (flagType === "deletion") {
                    setFlaggedCases((prev) => ({
                        ...prev,
                        [id]: isCurrentlyFlaggedForDeletion,
                    }))
                } else if (flagType === "rescoring") {
                    setFlaggedForRescoring((prev) => ({
                        ...prev,
                        [id]: isCurrentlyFlaggedForRescoring,
                    }))
                }
            })
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