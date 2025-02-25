import React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"

import { ReportData } from "../types"

interface CaseDetailsTableProps {
  caseDetailsData: ReportData[]
  columns: ColumnDef<any, any>[]
  isLoading: boolean
}

export const CaseDetailsTable: React.FC<CaseDetailsTableProps> = ({
  caseDetailsData,
  columns,
  isLoading,
}) => {
  return (
    // <Card className="mt-6">
    //   <CardHeader>
    //     <div className="flex justify-between items-center">
    //       <CardTitle>Case Details</CardTitle>
    //     </div>
    //   </CardHeader>
    //   <CardContent>
    //     {isLoading ? (
    //       <div className="flex justify-center items-center py-20">
    //         <Spinner size="lg" />
    //       </div>
    //     ) : (
    //       <DataTable columns={columns} data={caseDetailsData} initialPageSize={10} />
    //     )}
    //   </CardContent>
    // </Card>

    <DataTable columns={columns} data={caseDetailsData} initialPageSize={10} />
  )
}
