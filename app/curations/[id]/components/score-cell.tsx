import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

interface ScoreCellProps {
  score: number
}

export const ScoreCell: React.FC<ScoreCellProps> = ({ score }) => {
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
}

export const getScoreColumn = (): ColumnDef<any, any> => ({
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
    return <ScoreCell score={row.original.total_case_score} />
  },
}) 