"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useGetPaperRelationshipsQuery } from "@/services/eagle/relationships"
import { Paper } from "@/services/paper/paper"
import { CaretSortIcon } from "@radix-ui/react-icons"
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
import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
} from "@xyflow/react"
import { ExternalLink, Info } from "lucide-react"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import "@xyflow/react/dist/style.css"

// Add type definition for relationships data
interface RelationshipsData {
  nodes: Node[];
  edges: Edge[];
  raw_relationships?: any;
}

const ExpandedPaperRow = ({ data }: { data: Paper }) => {
  const [activeTab, setActiveTab] = useState("paper_info")
  const [isGraphLoading, setIsGraphLoading] = useState(true)
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)
  
  // Fetch relationships data with skip option to control when it loads
  const { data: relationships, isLoading, isError, refetch } = useGetPaperRelationshipsQuery(
    data.id.toString(),
    {
      // Force refetch when component mounts to ensure fresh data
      refetchOnMountOrArgChange: true
    }
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(relationships?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(relationships?.edges || [])

  // Update loading state and nodes/edges when relationships data changes
  useEffect(() => {
    if (relationships) {
      // Only update if we have actual data
      if (relationships.nodes && relationships.edges) {
        setNodes(relationships.nodes)
        setEdges(relationships.edges)
      }
      setIsGraphLoading(false)
      setHasAttemptedLoad(true)
    }
  }, [relationships, setNodes, setEdges])

  useEffect(() => {
    // Trigger a refetch when component mounts to ensure we have fresh data
    refetch()
  }, [refetch])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // If switching to relationships tab, ensure data is loaded
    if (value === "relationships") {
      if (isLoading || (!hasAttemptedLoad && !relationships)) {
        setIsGraphLoading(true)
        refetch()
      }
    }
  }

  // Determine if we have valid graph data
  const hasValidGraphData = 
    relationships && 
    relationships.nodes && 
    relationships.nodes.length > 0 && 
    relationships.edges && 
    relationships.edges.length > 0

  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className="p-4 bg-gray-50 border-t border-gray-200"
      >
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="paper_info">Paper Info</TabsTrigger>
            <TabsTrigger value="relationships">
              Relationships
              {isGraphLoading && (
                <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paper_info">
            <div className="space-y-4">
              {data.abstract && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Abstract</h4>
                  <p className="text-sm text-gray-700">{data.abstract}</p>
                </div>
              )}

              {data.associated_disorders && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Associated Disorders
                  </h4>
                  <p className="text-sm text-gray-700">
                    {data.associated_disorders}
                  </p>
                </div>
              )}

              {data.asd_relevance_summary && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    ASD Relevance Summary
                  </h4>
                  <p className="text-sm text-gray-700">
                    {data.asd_relevance_summary}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="relationships">
            <div className="space-y-4 h-[450px]">
              {isLoading || isGraphLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <p className="text-gray-600">Loading relationship graph...</p>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                      <span className="text-red-500 text-xl">!</span>
                    </div>
                    <p className="text-gray-600">Failed to load relationship data</p>
                    <button 
                      onClick={() => {
                        setIsGraphLoading(true)
                        setHasAttemptedLoad(false)
                        refetch()
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : hasValidGraphData ? (
                <ReactFlow
                  key={`flow-${data.id}`} // Add key to force re-render
                  nodes={nodes}
                  edges={edges}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodesDraggable={true}
                  elementsSelectable={true}
                >
                  <Controls />
                  <Background />
                </ReactFlow>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <p className="text-gray-600">No relationship data available for this paper</p>
                    <button 
                      onClick={() => {
                        setIsGraphLoading(true)
                        setHasAttemptedLoad(false)
                        refetch()
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
        return (
          <div className="text-center">{hasAutismReport ? "Yes" : "No"}</div>
        )
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
