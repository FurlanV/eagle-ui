"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data: Papers[] = [
  {
    id: "m5gr84i9",
    title: "Systematic evaluation of genome sequencing for the diagnostic...",
    doi: "10.1073/pnas.2013773117",
    status: "processed",
    score: 1.5,
    abstract:
      "Western South America was one of the worldwide cradles of civilization. The well-known Inca Empire was the tip of the iceberg of an evolutionary process that started 11,000 to 14,000 years ago. Genetic data from 18 Peruvian populations reveal the following: 1) The between-population homogenization of the central southern Andes and its differentiation with respect to Amazonian populations of similar latitudes do not extend northward...",
  },
  {
    id: "3u1reuv4",
    title: "Transcriptome and Genome Analysis Uncovers a DMD...",
    doi: "10.1073/pnas.2013773117",
    status: "processed",
    score: 1.0,
    abstract:
      "Western South America was one of the worldwide cradles of civilization. The well-known Inca Empire was the tip of the iceberg of an evolutionary process that started 11,000 to 14,000 years ago. Genetic data from 18 Peruvian populations reveal the following: 1) The between-population homogenization of the central southern Andes and its differentiation with respect to Amazonian populations of similar latitudes do not extend northward...",
  },
  {
    id: "derv1ws0",
    title: "Integrating de novo and inherited variants in 42,607 autism...",
    doi: "10.1073/pnas.2013773117",
    status: "processed",
    score: 2,
    abstract:
      "Western South America was one of the worldwide cradles of civilization. The well-known Inca Empire was the tip of the iceberg of an evolutionary process that started 11,000 to 14,000 years ago. Genetic data from 18 Peruvian populations reveal the following: 1) The between-population homogenization of the central southern Andes and its differentiation with respect to Amazonian populations of similar latitudes do not extend northward...",
  },
  {
    id: "5kma53ae",
    title:
      "Autism Spectrum Disorder and Duchenne Muscular Dystrophy: A Clinical...",
    doi: "10.1073/pnas.2013773117",
    status: "processing",
    score: 1.25,
    abstract:
      "Western South America was one of the worldwide cradles of civilization. The well-known Inca Empire was the tip of the iceberg of an evolutionary process that started 11,000 to 14,000 years ago. Genetic data from 18 Peruvian populations reveal the following: 1) The between-population homogenization of the central southern Andes and its differentiation with respect to Amazonian populations of similar latitudes do not extend northward...",
  },
  {
    id: "bhqecj4p",
    title: "Genetic landscape of autism spectrum disorder...",
    doi: "10.1073/pnas.2013773117",
    status: "processing",
    score: 1.5,
    abstract:
      "Western South America was one of the worldwide cradles of civilization. The well-known Inca Empire was the tip of the iceberg of an evolutionary process that started 11,000 to 14,000 years ago. Genetic data from 18 Peruvian populations reveal the following: 1) The between-population homogenization of the central southern Andes and its differentiation with respect to Amazonian populations of similar latitudes do not extend northward...",
  },
]

export type Papers = {
  id: string
  title: string
  doi: string
  abstract: string
  status: "processed" | "processing"
  score: number
}

export const columns: ColumnDef<Papers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "abstract",
    header: "Abstract",
    cell: ({ row }) => <div>{row.getValue("abstract").substring(0, 60)}</div>,
  },
  {
    accessorKey: "doi",
    header: "DOI",
    cell: ({ row }) => <div>{row.getValue("doi")}</div>,
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center font-bold">{row.getValue("score")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy DOI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Authors</DropdownMenuItem>
            <DropdownMenuItem>View Analysis</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo({ className, setShowFileUpload }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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

  return (
    <div className={cn("w-full h-full", className)}>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Papers..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
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
        <Button variant="outline" className="ml-2" onClick={() => setShowFileUpload(true)}>
            Upload
        </Button>
      </div>
      <div className="rounded-md border">
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
                  data-state={row.getIsSelected() && "selected"}
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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
