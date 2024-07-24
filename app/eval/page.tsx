"use client"

import { useState } from "react"
import {
  useGetAllReportsQuery,
  useGetReportsByCaseIdQuery,
} from "@/services/eagle/reports"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GeneScoresChart } from "@/components/gene-scores-chart"

export default function EvaluationsPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const { data = [], error, isLoading } = useGetAllReportsQuery()
  const {
    data: caseData = [],
    error: caseError,
    isLoading: caseIsLoading,
  } = useGetReportsByCaseIdQuery(selectedCase ?? "")

  console.log(caseData)

  return (
    <section className="flex flex-col h-full w-full">
      <div className="flex flex-col items-center gap-2 w-full h-full p-4">
        <h2 className="text-lg font-bold">Cases</h2>
        <Select onValueChange={(value: any) => setSelectedCase(value)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a case" />
          </SelectTrigger>
          <SelectContent>
            {data
              .filter(
                (report, index, self) =>
                  index ===
                  self.findIndex(
                    (t) => t.reported_case_id === report.reported_case_id
                  )
              )
              .map((report) => (
                <SelectItem
                  key={report.reported_case_id}
                  value={report.reported_case_id}
                >
                  {report.reported_case_id}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex p-4 gap-3 w-full">
        <GeneScoresChart chartData={caseData} />
      </div>
      {/* <div className="p-4 gap-3 h-full w-full">
        <div className="flex flex-col gap-2 h-[58rem] w-full">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {caseIsLoading ? (
              <p>Loading...</p>
            ) : caseError ? (
              <p>Error: {caseError.message}</p>
            ) : (
              caseData.map((report) => (
                <div key={report.id}>
                  <p>{report.case_id}</p>
                  <p>{report.gene_symbol}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}
    </section>
  )
}
