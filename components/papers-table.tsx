"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
} from "@tanstack/react-table"
import { ExternalLink, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Paper } from "@/services/paper/paper"

// Component to render the expanded row content
const ExpandedPaperRow = ({ data }: { data: Paper }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4 mt-2 mb-4">
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [expandedRows, setExpandedRows] = React.useState<
    Record<number, boolean>
  >({})
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
        return <div className="text-left font-medium px-4">Title</div>
      },
      cell: ({ row }) => (
        <div className="font-medium text-primary hover:text-primary/80 cursor-pointer px-4 py-2">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "first_author",
      header: ({ column }) => {
        return <div className="text-left font-medium px-4">Author</div>
      },
      cell: ({ row }) => {
        const author = row.getValue("first_author") as string | null
        return (
          <div className="text-left px-4 py-2">
            {author || "Unknown"}
          </div>
        )
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return <div className="text-center font-medium px-4">Year</div>
      },
      cell: ({ row }) => {
        const year = row.getValue("year") as number | null
        return (
          <div className="text-center px-4 py-2">
            {year || "N/A"}
          </div>
        )
      },
    },
    {
      accessorKey: "doi",
      header: ({ column }) => {
        return <div className="text-center font-medium px-4">DOI</div>
      },
      cell: ({ row }) => {
        const doi = row.getValue("doi") as string | null
        const link = row.original.link
        
        if (!doi && !link) return <div className="text-center px-4 py-2">N/A</div>
        
        return (
          <div className="text-center px-4 py-2">
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
        return <div className="text-center font-medium px-4">ASD Report</div>
      },
      cell: ({ row }) => {
        const hasAutismReport = row.getValue("autism_report") as boolean
        return (
          <div className="text-center px-4 py-2">
            {hasAutismReport ? "Yes" : "No"}
          </div>
        )
      },
    },
    {
      id: "details",
      header: () => <div className="w-10"></div>,
      cell: ({ row }) => (
        <div className="flex justify-center w-10 mx-auto">
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

  const handleRowClick = (row: Row<Paper>) => {
    // Navigate to paper details page if needed
    // router.push(`/papers/${row.original.id}`)
    
    // For now, just toggle expansion
    toggleRowExpanded(row.original.id)
  }

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          initialPageSize={10}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Render expanded rows */}
      {filteredData.map(
        (row) =>
          expandedRows[row.id] && (
            <div key={`expanded-${row.id}`}>
              <ExpandedPaperRow data={row} />
            </div>
          )
      )}
    </div>
  )
}
