import React, { useState } from "react"
import { 
  ColumnDef, 
  SortingState, 
  flexRender, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  useReactTable 
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

import { Paper, Variant } from "../types"

interface PapersTableProps {
  papers: Paper[]
  isLoading: boolean
}

// Component to render the expanded row content
const ExpandedPaperRow = ({ paper }: { paper: Paper }) => {
  const variantColumns: ColumnDef<Variant>[] = [
    {
      accessorKey: "variant",
      header: "Variant",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "chromosome",
      header: "Chr",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "variant_type",
      header: "Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "zygosity",
      header: "Zygosity",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "rsid",
      header: "rsID",
      cell: (info) => info.getValue(),
    },
  ]

  const variantsTable = useReactTable({
    data: paper.variants,
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <TableRow>
      <TableCell colSpan={5} className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-2">Paper Summary</h3>
            <p className="text-gray-700">{paper.asd_relevance_summary}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-md mt-4 mb-2">Variants</h4>
            {paper.variants.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {variantsTable.getHeaderGroups().map((headerGroup) => (
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
                    {variantsTable.getRowModel().rows?.length ? (
                      variantsTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
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
                          colSpan={variantColumns.length}
                          className="h-24 text-center"
                        >
                          No variants.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No variants reported in this paper</p>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

export const PapersTable: React.FC<PapersTableProps> = ({
  papers,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const toggleRow = (paperId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [paperId]: !prev[paperId],
    }))
  }

  const columns: ColumnDef<Paper>[] = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => {
        const paperId = row.original.id
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleRow(paperId)
            }}
            className="p-0 h-8 w-8"
          >
            {expandedRows[paperId] ? (
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
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "first_author",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          First Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "associated_disorders",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Associated Disorders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <div className="max-w-xs truncate" title={value}>
            {value}
          </div>
        );
      },
    },
  ]

  const table = useReactTable({
    data: papers,
    columns,
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
    <div className="space-y-4">
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
                    onClick={() => toggleRow(row.original.id)}
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
                    <ExpandedPaperRow paper={row.original} />
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