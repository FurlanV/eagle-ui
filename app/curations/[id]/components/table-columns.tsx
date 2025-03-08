import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CaseData } from './types'
import { FeedbackControls } from './feedback-controls'
import { getScoreColumn } from './score-cell'

interface GetColumnsProps {
  expandedRows: Record<number, boolean>
  toggleRowExpanded: (id: number) => void
  feedbackState: any
  feedbackHandlers: any
  commentInputRef: React.RefObject<HTMLTextAreaElement>
  flagCommentInputRef: React.RefObject<HTMLTextAreaElement>
  userFeedbacks: any
}

export const getEnhancedColumns = (
  baseColumns: ColumnDef<any, any>[],
  {
    expandedRows,
    toggleRowExpanded,
    feedbackState,
    feedbackHandlers,
    commentInputRef,
    flagCommentInputRef,
    userFeedbacks
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

  // Filter out any columns that might have phenotypes as accessorKey
  const filteredBaseColumns = baseColumns.filter((col) => {
    if ("accessorKey" in col) {
      return col.accessorKey !== "phenotypes"
    }
    return true
  })

  return [
    expanderColumn,
    ...filteredBaseColumns,
    ageColumn,
    phenotypesColumn,
    scoreColumn,
    feedbackColumn,
  ]
} 