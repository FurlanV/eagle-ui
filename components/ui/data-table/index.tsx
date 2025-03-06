"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  OnChangeFn,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

// Icons for expand/collapse

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  initialPageSize?: number
  hidePagination?: boolean
  enableExpanding?: boolean
  onRowClick?: (row: Row<TData>) => void
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialPageSize = 10,
  hidePagination = false,
  enableExpanding = false,
  onRowClick,
  sorting: externalSorting,
  onSortingChange: onExternalSortingChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState({})

  const sorting = externalSorting ?? internalSorting
  const setSorting = onExternalSortingChange ?? setInternalSorting

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  React.useEffect(() => {
    table.setPageSize(Number(initialPageSize))
  }, [initialPageSize])

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* Expand/Collapse Column Header */}
                <TableHead>
                  {/* Placeholder for expand/collapse buttons */}
                </TableHead>
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
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={(event) => {
                      if (!(event.target as HTMLElement).closest(".z-20")) {
                        onRowClick?.(row)
                        row.toggleSelected()
                      }
                    }}
                  >
                    {/* Expand/Collapse Button */}
                    <TableCell>
                      {enableExpanding && (
                        <button
                          onClick={() => row.toggleExpanded()}
                          className="flex items-center justify-center w-6 h-6"
                          aria-label={
                            row.getIsExpanded() ? "Collapse row" : "Expand row"
                          }
                        >
                          {row.getIsExpanded() ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {enableExpanding && row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length + 1}>
                        {/* Render Expanded Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Detailed Information
                          </h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(row.original as Record<string, unknown>).map(([key, value]) => (
                              <div key={key} className="flex flex-col gap-1">
                                <dt className="capitalize font-bold">
                                  {key.replace(/_/g, " ")}
                                </dt>
                                <dd className="bg-muted p-2 rounded-md">
                                  {value ? String(value) : "N/A"}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  )
}
