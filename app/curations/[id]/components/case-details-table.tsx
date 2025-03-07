import React, { useEffect, useRef, useState } from "react"
import { useAddOrUpdateFeedbackMutation } from "@/services/feedback/feedback"
import {
  CellContext,
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  Flag,
  Info,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Updated interface to match the new data structure
export interface CaseData {
  id: number
  case_id: string
  sex: string | null
  age: string | null
  phenotypes: string
  notes: string | null
  description: string
  total_case_score: number
  genetic_evidence_score_rationale: string | null
  score_adjustment_rationale: string | null
  experimental_evidence_score_rationale: string | null
  likes_count: number
  dislikes_count: number
}

interface CaseDetailsTableProps {
  caseDetailsData: CaseData[]
  columns: ColumnDef<any, any>[]
  isLoading: boolean
}

// Component to render the expanded row content
const ExpandedRow = ({ data }: { data: CaseData }) => {
  return (
    <TableRow>
      <TableCell
        colSpan={7}
        className="p-4 bg-gray-50 border-t border-gray-200"
      >
        <div className="space-y-4">
          {data.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Case Description
              </h4>
              <p className="text-sm text-gray-700">{data.description}</p>
            </div>
          )}

          {data.phenotypes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Phenotypes</h4>
              <p className="text-sm text-gray-700">{data.phenotypes}</p>
            </div>
          )}

          {data.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
              <p className="text-sm text-gray-700">{data.notes}</p>
            </div>
          )}

          {data.genetic_evidence_score_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Genetic Evidence Score Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.genetic_evidence_score_rationale}
              </p>
            </div>
          )}

          {data.score_adjustment_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Score Adjustment Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.score_adjustment_rationale}
              </p>
            </div>
          )}

          {data.experimental_evidence_score_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Experimental Evidence Score Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.experimental_evidence_score_rationale}
              </p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export const CaseDetailsTable: React.FC<CaseDetailsTableProps> = ({
  caseDetailsData,
  columns,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [likedCases, setLikedCases] = useState<Record<number, boolean>>({})
  const [dislikedCases, setDislikedCases] = useState<Record<number, boolean>>(
    {}
  )
  const [flaggedCases, setFlaggedCases] = useState<Record<number, boolean>>({})
  const [flaggedForRescoring, setFlaggedForRescoring] = useState<
    Record<number, boolean>
  >({})
  const [likeComments, setLikeComments] = useState<Record<number, string>>({})
  const [dislikeComments, setDislikeComments] = useState<
    Record<number, string>
  >({})
  const [tempComment, setTempComment] = useState<string>("")
  const [activeCommentType, setActiveCommentType] = useState<
    Record<number, string | null>
  >({})
  const [flagComments, setFlagComments] = useState<Record<number, string>>({})
  const [activeFlagModal, setActiveFlagModal] = useState<{
    id: number | null
    type: string | null
  }>({ id: null, type: null })
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const flagCommentInputRef = useRef<HTMLTextAreaElement>(null)
  const [addOrUpdateFeedback, { isLoading: isAddingFeedback }] =
    useAddOrUpdateFeedbackMutation()

  console.log(caseDetailsData)

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
    const isCurrentlyLiked = likedCases[id] || false

    // If disliked, remove dislike
    if (dislikedCases[id]) {
      setDislikedCases((prev) => ({
        ...prev,
        [id]: false,
      }))
      
      // Update the dislikes count in the caseDetailsData
      const caseIndex = caseDetailsData.findIndex(c => c.id === id)
      if (caseIndex !== -1 && caseDetailsData[caseIndex].dislikes_count > 0) {
        const updatedCaseData = [...caseDetailsData]
        updatedCaseData[caseIndex] = {
          ...updatedCaseData[caseIndex],
          dislikes_count: updatedCaseData[caseIndex].dislikes_count - 1
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
    const caseIndex = caseDetailsData.findIndex(c => c.id === id)
    if (caseIndex !== -1) {
      const updatedCaseData = [...caseDetailsData]
      updatedCaseData[caseIndex] = {
        ...updatedCaseData[caseIndex],
        likes_count: isCurrentlyLiked 
          ? Math.max(0, updatedCaseData[caseIndex].likes_count - 1)
          : updatedCaseData[caseIndex].likes_count + 1
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

    // Call the feedback API
    addOrUpdateFeedback({
      case_id: id,
      feedback_type: !isCurrentlyLiked ? "like" : "none", // If already liked, toggling means removing the like
      comment: comment || "",
    })
      .unwrap()
      .then(() => {
        console.log(`Feedback for case ${id} successfully submitted`)
      })
      .catch((error) => {
        console.error(`Error submitting feedback for case ${id}:`, error)
      })

    console.log(
      `Case ${id} liked: ${!isCurrentlyLiked}${
        comment ? `, Comment: ${comment}` : ""
      }`
    )
  }

  // Function to handle dislike
  const handleDislike = (id: number, comment?: string) => {
    const isCurrentlyDisliked = dislikedCases[id] || false

    // If liked, remove like
    if (likedCases[id]) {
      setLikedCases((prev) => ({
        ...prev,
        [id]: false,
      }))
      
      // Update the likes count in the caseDetailsData
      const caseIndex = caseDetailsData.findIndex(c => c.id === id)
      if (caseIndex !== -1 && caseDetailsData[caseIndex].likes_count > 0) {
        const updatedCaseData = [...caseDetailsData]
        updatedCaseData[caseIndex] = {
          ...updatedCaseData[caseIndex],
          likes_count: updatedCaseData[caseIndex].likes_count - 1
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
    const caseIndex = caseDetailsData.findIndex(c => c.id === id)
    if (caseIndex !== -1) {
      const updatedCaseData = [...caseDetailsData]
      updatedCaseData[caseIndex] = {
        ...updatedCaseData[caseIndex],
        dislikes_count: isCurrentlyDisliked 
          ? Math.max(0, updatedCaseData[caseIndex].dislikes_count - 1)
          : updatedCaseData[caseIndex].dislikes_count + 1
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

    // Call the feedback API
    addOrUpdateFeedback({
      case_id: id,
      feedback_type: !isCurrentlyDisliked ? "dislike" : "none", // If already disliked, toggling means removing the dislike
      comment: comment || "",
    })
      .unwrap()
      .then(() => {
        console.log(`Feedback for case ${id} successfully submitted`)
      })
      .catch((error) => {
        console.error(`Error submitting feedback for case ${id}:`, error)
      })

    console.log(
      `Case ${id} disliked: ${!isCurrentlyDisliked}${
        comment ? `, Comment: ${comment}` : ""
      }`
    )
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
        `Case ${id} flagged for deletion${
          comment ? `, Comment: ${comment}` : ""
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
        `Case ${id} flagged for rescoring${
          comment ? `, Comment: ${comment}` : ""
        }`
      )
    }
    // Close the modal after flagging
    setActiveFlagModal({ id: null, type: null })
  }

  // Enhanced columns with expand/collapse functionality
  const enhancedColumns: ColumnDef<any, any>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        const isExpanded = expandedRows[row.original.id] || false
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRowExpanded(row.original.id)}
            className="p-0 h-8 w-8"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    // Include all columns except any that might have phenotypes as accessorKey
    ...columns.filter((col) => {
      if ("accessorKey" in col) {
        return col.accessorKey !== "phenotypes"
      }
      return true
    }),
    {
      id: "age",
      header: "Age",
      cell: ({ row }) => row.original.age || "Not specified",
    },
    {
      id: "phenotypes",
      header: "Phenotypes",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate cursor-help">
                {row.original.phenotypes || "Not specified"}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>{row.original.phenotypes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      id: "total_case_score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      accessorKey: "total_case_score",
      cell: ({ row }) => {
        const score = row.original.total_case_score
        let textClass = "text-gray-600"
        let bgClass = "bg-gray-50"

        if (score >= 8) {
          textClass = "text-green-700"
          bgClass = "bg-green-50"
        } else if (score >= 6) {
          textClass = "text-blue-700"
          bgClass = "bg-blue-50"
        } else if (score >= 4) {
          textClass = "text-yellow-700"
          bgClass = "bg-yellow-50"
        }

        return (
          <div className="flex justify-center w-full">
            <div className={`rounded-full px-3 py-1 ${bgClass}`}>
              <span className={`font-medium ${textClass}`}>
                {score.toFixed(2)}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const id = row.original.id
        const isLiked = likedCases[id] || false
        const isDisliked = dislikedCases[id] || false
        const isFlagged = flaggedCases[id] || false
        const isFlaggedForRescoring = flaggedForRescoring[id] || false
        const isCommentingLike = activeCommentType[id] === "like"
        const isCommentingDislike = activeCommentType[id] === "dislike"
        const hasLikeComment = likeComments[id] && likeComments[id].length > 0
        const hasDislikeComment =
          dislikeComments[id] && dislikeComments[id].length > 0

        return (
          <div
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center space-x-2">
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
                          setTempComment(likeComments[id] || "")
                        }
                      }}
                      className={`p-1 ${
                        isLiked ? "text-green-500 bg-green-50" : 
                        row.original.likes_count > 0 ? "text-gray-600 bg-green-50/30" : "text-gray-400"
                      } ${
                        hasLikeComment
                          ? "ring-1 ring-green-200 rounded-full"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-green-500" : row.original.likes_count > 0 ? "fill-green-200" : ""}`} />
                        {row.original.likes_count > 0 && (
                          <span className={`ml-1 text-xs font-medium ${isLiked ? "text-green-600" : "text-gray-600"}`}>
                            {row.original.likes_count}
                          </span>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {(hasLikeComment || row.original.likes_count > 0) && (
                    <TooltipContent
                      side="top"
                      className="max-w-xs bg-green-50 border-green-200"
                    >
                      <div className="flex flex-col">
                        {row.original.likes_count > 0 && (
                          <span className="text-xs font-medium text-green-700 mb-1">
                            {row.original.likes_count} {row.original.likes_count === 1 ? 'person has' : 'people have'} liked this case
                            {isLiked && ' (including you)'}
                          </span>
                        )}
                        {hasLikeComment && (
                          <>
                            <span className="text-xs font-medium text-green-700 mb-1">
                              Your positive feedback:
                            </span>
                            <p className="text-sm text-green-800">
                              {likeComments[id]}
                            </p>
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${
                        isDisliked ? "text-red-500 bg-red-50" : 
                        row.original.dislikes_count > 0 ? "text-gray-600 bg-red-50/30" : "text-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isDisliked) {
                          handleDislike(id)
                        } else {
                          setActiveCommentType((prev) => ({
                            ...prev,
                            [id]: "dislike",
                          }))
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <ThumbsDown className={`h-4 w-4 ${isDisliked ? "fill-red-500" : row.original.dislikes_count > 0 ? "fill-red-200" : ""}`} />
                        {row.original.dislikes_count > 0 && (
                          <span className={`ml-1 text-xs font-medium ${isDisliked ? "text-red-600" : "text-gray-600"}`}>
                            {row.original.dislikes_count}
                          </span>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {((isDisliked && dislikeComments[id]) || row.original.dislikes_count > 0) && (
                    <TooltipContent className="max-w-xs bg-red-50 border-red-200">
                      <div className="flex flex-col">
                        {row.original.dislikes_count > 0 && (
                          <span className="text-xs font-medium text-red-700 mb-1">
                            {row.original.dislikes_count} {row.original.dislikes_count === 1 ? 'person has' : 'people have'} disliked this case
                            {isDisliked && ' (including you)'}
                          </span>
                        )}
                        {isDisliked && dislikeComments[id] && (
                          <>
                            <span className="text-xs font-medium text-red-700 mb-1">
                              Your negative feedback:
                            </span>
                            <p className="text-sm text-red-800">
                              {dislikeComments[id]}
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
                          ? "text-amber-500"
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
                  {isFlaggedForRescoring && flagComments[id] ? (
                    <TooltipContent className="max-w-xs bg-amber-50 border-amber-200">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-amber-700 mb-1">
                          Flagged for rescoring:
                        </span>
                        <p className="text-sm text-amber-800">
                          {flagComments[id]}
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
                        isFlagged ? "text-red-500" : "text-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveFlagModal({ id, type: "deletion" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  {isFlagged && flagComments[id] ? (
                    <TooltipContent className="max-w-xs bg-red-50 border-red-200">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-red-700 mb-1">
                          Flagged for deletion:
                        </span>
                        <p className="text-sm text-red-800">
                          {flagComments[id]}
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

            {/* Improved inline comment input for like/dislike */}
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
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: caseDetailsData,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => toggleRowExpanded(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRows[row.original.id] && (
                    <ExpandedRow data={row.original} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Flag Confirmation Modal */}
      {activeFlagModal.id !== null && (
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
    </>
  )
}
