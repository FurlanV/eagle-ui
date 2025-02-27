"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
} from "@tanstack/react-table"
import { Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Gene = {
  id: number
  symbol: string
  chromosome: string
  cases: number
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

  // Default sorting by cases count (descending)
  React.useEffect(() => {
    setSorting([{ id: "cases", desc: true }])
  }, [])

  // Update column filters when search query changes
  React.useEffect(() => {
    setColumnFilters(searchQuery ? [{ id: "symbol", value: searchQuery }] : [])
  }, [searchQuery])

  const columns: ColumnDef<Gene>[] = [
    {
      accessorKey: "symbol",
      header: ({ column }) => {
        return <div className="text-left font-medium px-4">Gene Symbol</div>
      },
      cell: ({ row }) => (
        <div className="font-medium text-primary hover:text-primary/80 cursor-pointer px-4 py-2">
          {row.getValue("symbol")}
        </div>
      ),
    },
    {
      accessorKey: "chromosome",
      header: ({ column }) => {
        return <div className="text-center font-medium px-4">Chromosome</div>
      },
      cell: ({ row }) => {
        const chromosome = row.getValue("chromosome") as string
        let textClass = "text-foreground"

        // Color-code chromosomes with subtle text styling
        if (chromosome === "X") {
          textClass = "text-primary"
        } else if (chromosome === "Y") {
          textClass = "text-secondary"
        }

        return (
          <div className={`font-medium ${textClass} text-center px-4 py-2`}>
            {chromosome}
          </div>
        )
      },
    },
    {
      accessorKey: "cases",
      header: ({ column }) => {
        return <div className="text-right font-medium px-4">Cases</div>
      },
      cell: ({ row }) => {
        const cases = row.getValue("cases") as number
        let textClass = "text-foreground"
        let fontWeight = "font-normal"

        // Highlight case counts with different text styles based on count
        if (cases > 10) {
          textClass = "text-destructive"
          fontWeight = "font-semibold"
        } else if (cases > 5) {
          textClass = "text-primary"
          fontWeight = "font-medium"
        } else if (cases > 2) {
          textClass = "text-secondary"
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`text-right ${textClass} ${fontWeight} px-4 py-2`}
                >
                  {cases}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{cases} reported cases</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

  const handleRowClick = (row: Row<Gene>) => {
    router.push(`/curations/${row.original.symbol}`)
  }

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter((gene) =>
      gene.symbol.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/*<div className="flex items-center justify-between py-4">
         <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter genes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div> 
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            {filteredData.length} genes found
          </p>
        </div>
      </div> */}

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
              <ExpandedGeneRow data={row} />
            </div>
          )
      )}
    </div>
  )
}
