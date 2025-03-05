"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ExternalLink, Info } from "lucide-react"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Paper } from "@/services/paper/paper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Component to render the expanded row content
const ExpandedPaperRow = ({ data }: { data: Paper }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-4">
          {data.abstract && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Abstract</h4>
              <p className="text-sm text-gray-700">{data.abstract}</p>
            </div>
          )}

          {data.associated_disorders && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Associated Disorders</h4>
              <p className="text-sm text-gray-700">{data.associated_disorders}</p>
            </div>
          )}

          {data.asd_relevance_summary && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">ASD Relevance Summary</h4>
              <p className="text-sm text-gray-700">{data.asd_relevance_summary}</p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function PapersTable({
  data,
  className,
  isLoading = false,
}: {
  data: Paper[]
  className?: string
  isLoading?: boolean
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
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

  // Default sorting by year (descending)
  React.useEffect(() => {
    setSorting([{ id: "year", desc: true }])
  }, [])

  // Update column filters when search query changes
  React.useEffect(() => {
    setColumnFilters(searchQuery ? [{ id: "title", value: searchQuery }] : [])
  }, [searchQuery])

  const columns: ColumnDef<Paper>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium text-primary hover:text-primary/80 cursor-pointer">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "first_author",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Author
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const author = row.getValue("first_author") as string | null
        return <div>{author || "Unknown"}</div>
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Year
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const year = row.getValue("year") as number | null
        return <div className="text-center">{year || "N/A"}</div>
      },
    },
    {
      accessorKey: "doi",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            DOI
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const doi = row.getValue("doi") as string | null
        const link = row.original.link
        
        if (!doi && !link) return <div className="text-center">N/A</div>
        
        return (
          <div className="text-center">
            {(doi || link) && (
              <a 
                href={link || `https://doi.org/${doi}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {doi ? "DOI" : "Link"}
              </a>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "autism_report",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            ASD Report
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const hasAutismReport = row.getValue("autism_report") as boolean
        return <div className="text-center">{hasAutismReport ? "Yes" : "No"}</div>
      },
    },
    {
      id: "details",
      header: () => <div className="w-10"></div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
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
    state: {
      sorting,
      columnFilters,
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
    <div className={cn("w-full", className)}>
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
                    <ExpandedPaperRow data={row.original} />
                  )}
                </React.Fragment>
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
    </div>
  )
}
