"use client"

import * as React from "react"
import { CaretSortIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

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
import { Badge } from "@/components/ui/badge"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { useRouter } from "next/navigation"

export type Gene = {
  id: number
  symbol: string
  chromosome: string
  cases: number
}

// Define text style type for different emphasis levels
type TextEmphasis = "low" | "medium" | "high" | "special";

export const columns: ColumnDef<Gene>[] = [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-foreground hover:text-primary px-2 py-1 transition-colors text-left w-full justify-start"
        >
          Gene Symbol
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium text-primary hover:text-primary/80 cursor-pointer px-2 py-1 transition-all">
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
          className="font-medium text-foreground hover:text-primary px-2 py-1 transition-colors text-center w-full justify-center"
        >
          Chromosome
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const chromosome = row.getValue("chromosome") as string;
      let textClass = "text-foreground";
      
      // Color-code chromosomes with subtle text styling
      if (chromosome === "X") {
        textClass = "text-primary";
      } else if (chromosome === "Y") {
        textClass = "text-secondary";
      }
      
      return (
        <div className={`font-medium px-2 py-1 ${textClass} text-center`}>
          {chromosome}
        </div>
      );
    },
  },
  {
    accessorKey: "cases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-foreground hover:text-primary px-2 py-1 transition-colors text-right w-full justify-end"
        >
          Cases
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const cases = row.getValue("cases") as number;
      let textClass = "text-foreground";
      let fontWeight = "font-normal";
      
      // Highlight case counts with different text styles based on count
      if (cases > 10) {
        textClass = "text-destructive";
        fontWeight = "font-semibold";
      } else if (cases > 5) {
        textClass = "text-primary";
        fontWeight = "font-medium";
      } else if (cases > 2) {
        textClass = "text-secondary";
      }
      
      return (
        <div className={`text-right px-2 py-1 ${textClass} ${fontWeight}`}>
          {cases}
        </div>
      );
    },
  },
]

export function GenesTable({
  data,
  className,
}: {
  data: Gene[]
  className?: string
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const router = useRouter()

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Default sorting by cases count (descending)
  React.useEffect(() => {
    setSorting([{ id: "cases", desc: true }]);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between py-4">
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter genes..."
            value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("symbol")?.setFilterValue(event.target.value)
            }
            className="pl-9 pr-4 py-2 border-input bg-background text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} genes found
          </p>
        </div>
      </div>
      <div className="rounded-md border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-foreground h-10">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0"
                  onClick={() => {
                    router.push(`/curations/${row.original.symbol}`)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
} 