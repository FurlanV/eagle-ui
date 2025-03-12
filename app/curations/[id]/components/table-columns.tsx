import React, { useState } from "react"
import {
  useRescoreCaseMutation,
  useSoftDeleteCaseMutation,
} from "@/services/eagle/cases"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronRight, RefreshCw, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ConfirmationModal } from "./confirmation-modal"
import { FeedbackControls } from "./feedback-controls"
import { getScoreColumn } from "./score-cell"

interface GetColumnsProps {
  expandedRows: Record<number, boolean>
  toggleRowExpanded: (id: number) => void
  feedbackState: any
  feedbackHandlers: any
  commentInputRef: React.RefObject<HTMLTextAreaElement>
  flagCommentInputRef: React.RefObject<HTMLTextAreaElement>
  userFeedbacks: any
  isUserCurator: boolean
  isUserAdmin: boolean
}

export const getColumns = (
  baseColumns: ColumnDef<any, any>[],
  {
    expandedRows,
    toggleRowExpanded,
    feedbackState,
    feedbackHandlers,
    commentInputRef,
    flagCommentInputRef,
    userFeedbacks,
    isUserCurator,
    isUserAdmin,
  }: GetColumnsProps
): ColumnDef<any, any>[] => {
  const expanderColumn: ColumnDef<any, any> = {
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
  }

  const ageColumn: ColumnDef<any, any> = {
    id: "age",
    header: "Age",
    cell: ({ row }) => row.original.age || "Not specified",
  }

  const phenotypesColumn: ColumnDef<any, any> = {
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
  }

  const scoreColumn = getScoreColumn()

  const feedbackColumn: ColumnDef<any, any> = {
    id: "feedback",
    header: "Feedback",
    cell: ({ row }) => (
      <FeedbackControls
        caseData={row.original}
        feedbackState={feedbackState}
        handlers={feedbackHandlers}
        commentInputRef={commentInputRef}
        flagCommentInputRef={flagCommentInputRef}
        userFeedbacks={userFeedbacks}
      />
    ),
  }

  const actionsColumn: ColumnDef<any, any> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [rescoreModalOpen, setRescoreModalOpen] = useState(false)
      const [excludeModalOpen, setExcludeModalOpen] = useState(false)

      const [rescoreCase] = useRescoreCaseMutation()
      const [softDeleteCase] = useSoftDeleteCaseMutation()

      const handleRescore = () => rescoreCase(row.original.id)

      const handleExclude = () => softDeleteCase(row.original.id)

      return (
        <div
          className="flex items-center space-x-2 z-10"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setRescoreModalOpen(true)
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rescore this case</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive border-destructive hover:bg-destructive/10 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExcludeModalOpen(true)
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exclude this case</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Rescore Confirmation Modal */}
          <ConfirmationModal
            isOpen={rescoreModalOpen}
            onClose={() => setRescoreModalOpen(false)}
            onConfirm={handleRescore}
            title="Rescore Case"
            description={`Are you sure you want to rescore case ${row.original.id}?`}
            confirmText="Rescore"
          />

          {/* Exclude Confirmation Modal */}
          <ConfirmationModal
            isOpen={excludeModalOpen}
            onClose={() => setExcludeModalOpen(false)}
            onConfirm={handleExclude}
            title="Exclude Case"
            description={`Are you sure you want to exclude case ${row.original.id}? This action cannot be undone.`}
            confirmText="Exclude"
            variant="destructive"
          />
        </div>
      )
    },
  }

  // Filter out any columns that might have phenotypes as accessorKey
  const filteredBaseColumns = baseColumns.filter((col) => {
    if ("accessorKey" in col) {
      return col.accessorKey !== "phenotypes"
    }
    return true
  })

  // Base columns that are always shown regardless of user role
  const commonColumns = [
    expanderColumn,
    ...filteredBaseColumns,
    ageColumn,
    phenotypesColumn,
    scoreColumn,
  ]

  // Create a copy of columns to add role-specific columns
  let resultColumns = [...commonColumns]

  // Add the feedback column if the user is a curator
  if (isUserCurator) {
    resultColumns.push(feedbackColumn)
  }

  // Add the actions column if the user is an admin
  if (isUserAdmin) {
    resultColumns.push(actionsColumn)
  }

  return resultColumns
}
