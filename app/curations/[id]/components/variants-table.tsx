import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"

import { Variant } from "../types"

interface VariantsTableProps {
  variants: Variant[]
  isLoading: boolean
}

export const VariantsTable: React.FC<VariantsTableProps> = ({
  variants,
  isLoading,
}) => {
  const columns: ColumnDef<Variant>[] = [
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
    {
      accessorKey: "inheritance_pattern",
      header: "Inheritance",
      cell: (info) => info.getValue() || "Unknown",
    },
    {
      accessorKey: "linkage_to_asd",
      header: "ASD Linkage",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    },
    {
      accessorKey: "sift_score",
      header: "SIFT",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "polyphen_score",
      header: "PolyPhen",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "cadd_score",
      header: "CADD",
      cell: (info) => info.getValue() || "N/A",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <DataTable columns={columns} data={variants} initialPageSize={10} />
    </div>
  )
} 