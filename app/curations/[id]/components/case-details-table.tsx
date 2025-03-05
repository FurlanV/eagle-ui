import React, { useState } from "react"
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
import { ArrowUpDown, ChevronDown, ChevronRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

  // Function to toggle row expansion
  const toggleRowExpanded = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
    <div>
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
    </div>
  )
}
