"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  useGetGeneInformationQuery,
  useGetGenePhenotypesQuery,
  useGetGeneReferencesQuery,
} from "@/services/annotation/gene"
import { useGetReportsByGeneQuery } from "@/services/eagle/reports"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AuthWrapper } from "@/components/auth-wrapper"
import { GeneCard } from "@/components/gene-card"
import { PapersTable } from "@/components/papers-table"
import { ReportsTable } from "@/components/reports-table"

export default function GenePage() {
  // const [papers, setPapers] = useState<any[]>([])
  // const [searchedPapers, setSearchedPapers] = useState<any[]>([])
  // const [annotation, setAnnotation] = useState<any>({})
  // const [geneInfo, setGeneInfo] = useState<any>({})

  const pathname = usePathname()
  const split_pathname = pathname.split("/")
  const gene_name = split_pathname[split_pathname.length - 1]
  if (!gene_name) return

  const { data: annotationData } = useGetGeneReferencesQuery(gene_name)
  const { data: geneInfoData = {} } = useGetGeneInformationQuery(
    annotationData && annotationData[0].id
  )

  const { data: reportsData = [] } = useGetReportsByGeneQuery(gene_name)

  return (
    <AuthWrapper>
      <div className="flex h-full flex-row p-4 gap-2">
        <GeneCard geneInfo={geneInfoData ?? {}} annotation={{}} />
        <div className="flex flex-col flex-1 gap-2">
          <div className="grid grid-cols-3 gap-2 h-50">
            <Card className="w-full h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Eagle Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-center">
                  <Label className="text-4xl font-bold">
                    {reportsData.reduce(
                      (acc, report) => acc + report.final_score,
                      0
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reported Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-center">
                  <Label className="text-4xl font-bold">
                    {reportsData.length}
                  </Label>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-center">
                  <Label className="text-4xl font-bold">0.0</Label>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="w-full p-1">
            <div className="flex items-center space-x-2 justify-end">
              <Label htmlFor="airplane-mode">On Queue</Label>
              <Switch id="airplane-mode" />
            </div>
          </Card>
          <div className="flex flex-row gap-2">
            {/* <PapersTable data={searchedPapers} /> */}
            <ReportsTable data={reportsData} />
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
