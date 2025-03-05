"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Info, ChevronDownIcon, ArrowUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

export type Gene = {
  id: number
  symbol: string
  chromosome: string
  cases: number
  total_score: number
  // Additional fields that might be useful for expanded view
  description?: string
  aliases?: string[]
  location?: string
  function?: string
}

// Define text style type for different emphasis levels
type TextEmphasis = "low" | "medium" | "high" | "special"

// Component to render the expanded row content
const ExpandedGeneRow = ({ data }: { data: Gene }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4 mt-2 mb-4">
      {data.description && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Gene Description</h4>
          <p className="text-sm text-gray-700">{data.description}</p>
        </div>
      )}

      {data.aliases && data.aliases.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Aliases</h4>
          <p className="text-sm text-gray-700">{data.aliases.join(", ")}</p>
        </div>
      )}

      {data.location && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Genomic Location</h4>
          <p className="text-sm text-gray-700">{data.location}</p>
        </div>
      )}

      {data.function && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Function</h4>
          <p className="text-sm text-gray-700">{data.function}</p>
        </div>
      )}
    </div>
  )
}

export function GenesTable({
  data,
  className,
  isLoading = false,
}: {
  data: Gene[]
  className?: string
  isLoading?: boolean
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [expandedRows, setExpandedRows] = React.useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = React.useState("")

  const router = useRouter()

  // Function to toggle row expansion
  const toggleRowExpanded = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Default sorting by cases count (descending)
  React.useEffect(() => {
    setSorting([{ id: "total_score", desc: true }])
  }, [])

  // Update column filters when search query changes
  React.useEffect(() => {
    setColumnFilters(searchQuery ? [{ id: "symbol", value: searchQuery }] : [])
  }, [searchQuery])

  const columns: ColumnDef<Gene>[] = [
    {
      accessorKey: "symbol",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-left"
          >
            Gene Symbol
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer text-left">
          {row.getValue("symbol")}
        </div>
      ),
    },
    {
      accessorKey: "chromosome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            Chr
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const chromosome = row.getValue("chromosome") as string
        let textClass = "text-gray-600"

        if (chromosome === "X") {
          textClass = "text-purple-600"
        } else if (chromosome === "Y") {
          textClass = "text-indigo-600"
        }

        return (
          <div className={`font-medium ${textClass} text-center w-full`}>
            {chromosome}
          </div>
        )
      },
    },
    {
      accessorKey: "total_score",
      header: ({ column }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="cursor-help text-center w-full"
                >
                  Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Total confidence score for this gene</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue("total_score") as number
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
        } else {
          textClass = "text-gray-700"
          bgClass = "bg-gray-50"
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
      accessorKey: "cases",
      header: ({ column }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="cursor-help text-center w-full"
                >
                  Cases
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Number of reported cases</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      cell: ({ row }) => {
        const cases = row.getValue("cases") as number
        let textClass = "text-gray-600"
        let bgClass = "bg-gray-50"

        if (cases > 10) {
          textClass = "text-red-700"
          bgClass = "bg-red-50"
        } else if (cases > 5) {
          textClass = "text-orange-700"
          bgClass = "bg-orange-50"
        } else if (cases > 2) {
          textClass = "text-yellow-700"
          bgClass = "bg-yellow-50"
        }

        return (
          <div className="flex justify-center w-full">
            <div className={`rounded-full px-3 py-1 ${bgClass}`}>
              <span className={`font-medium ${textClass}`}>
                {cases}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: "details",
      header: () => <div className="w-10"></div>,
      cell: ({ row }) => (
        <div className="flex justify-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleRowExpanded(row.original.id)
            }}
            className="p-0 h-8 w-8"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const handleRowClick = (row: Row<Gene>) => {
    router.push(`/curations/${row.original.symbol}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full", className)}>
      <div className="flex items-center py-3">
        <Input
          placeholder="Filter genes..."
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-scroll h-[39rem]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(row)}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
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

      {/* Render expanded rows */}
      {data.map(
        (row) =>
          expandedRows[row.id] && (
            <div key={`expanded-${row.id}`}>
              <ExpandedGeneRow data={row} />
            </div>
          )
      )}
    </div>
  )
}
