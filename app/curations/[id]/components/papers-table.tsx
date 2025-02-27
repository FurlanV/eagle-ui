import React, { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"

import { Paper, Variant } from "../types"

interface PapersTableProps {
  papers: Paper[]
  isLoading: boolean
}

export const PapersTable: React.FC<PapersTableProps> = ({
  papers,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

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
            onClick={() => toggleRow(paperId)}
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
      header: "Title",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "first_author",
      header: "First Author",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "associated_disorders",
      header: "Associated Disorders",
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

  const renderVariantsTable = (variants: Variant[]) => {
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

    return (
      <div className="pl-8 pr-4 py-2 bg-gray-50 rounded-md">
        <DataTable
          columns={variantColumns}
          data={variants}
          initialPageSize={5}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={papers} initialPageSize={10} />
      
      {papers.map((paper) => (
        <div key={paper.id} className={expandedRows[paper.id] ? "block" : "hidden"}>
          <div className="mb-4 px-4 py-3 bg-white border rounded-md">
            <h3 className="font-medium text-lg mb-2">Paper Summary</h3>
            <p className="text-gray-700">{paper.asd_relevance_summary}</p>
            
            <h4 className="font-medium text-md mt-4 mb-2">Variants</h4>
            {paper.variants.length > 0 ? (
              renderVariantsTable(paper.variants)
            ) : (
              <p className="text-gray-500 italic">No variants reported in this paper</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 