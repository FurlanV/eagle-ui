"use client"

import React, { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  useGetGeneInformationQuery,
  useGetGeneReferencesQuery,
} from "@/services/annotation/gene"
import { ColumnDef } from "@tanstack/react-table"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react"

import { useAppSelector } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddFilesDialog } from "@/components/add-files-dialog"
import { AuthWrapper } from "@/components/auth-wrapper"
import { FileDetails } from "@/components/file-details"
import { FileStatusList } from "@/components/file-status-list"

import { Alerts } from "./components/alerts"
import { CaseDetailsTable } from "./components/case-details-table"
import { GenomeBrowser } from "./components/genome-browser"
// Import separated components
import { Header } from "./components/header"
import { InheritancePatternsChart } from "./components/inheritance-pattern-chart"
import { OverviewCards } from "./components/overview-cards"
import { ReportMetrics } from "./components/report-metrics"
import { PayloadVisualization } from "./components/research-page"
import { ScoreRationale } from "./components/score-rationale"
import { WordClouds } from "./components/word-clouds"
// Import custom hook and types
import { useCurationData } from "./hooks/useCurationData"

export default function CurationDetailsPage() {
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob)

  const {
    childrenData,
    isChildrenLoading,
    childrenError,
    allTasksCompleted,
    totalFinalScore,
    variantWordCounts,
    evidenceTypeCounts,
    otherInsights,
    selectedFile,
    setSelectedFile,
    showFileDetails,
    setShowFileDetails,
    searchTerm,
    setSearchTerm,
    taskInfo,
    isTaskInfoLoading,
    lastUpdateTime,
    caseDetailsData,
  } = useCurationData(selectedJob)

  const handleFileClick = (task: any) => {
    setSelectedFile(task)
    setShowFileDetails(true)
  }

  const pathname = usePathname()
  const split_pathname = pathname.split("/")
  const gene_name = split_pathname[split_pathname.length - 1]
  if (!gene_name) return

  const { data: annotationData } = useGetGeneReferencesQuery(gene_name)
  const { data: geneInfoData = {} } = useGetGeneInformationQuery(
    annotationData && annotationData[0].id,
    {
      skip: !annotationData || annotationData.length === 0,
    }
  )

  const casesData = taskInfo?.cases

  const selectedCase = casesData?.filter(
    (caseItem: any) => caseItem.task_id === taskInfo?.id
  )
  
  // // Extract Variants and Impacts
  const variants =
    selectedCase?.map((caseItem: any) => caseItem?.variant) || []
  const impacts = variants?.map((variant: any) => variant?.impact) || []

  // Determine Score Relevance
  let scoreRelevance = ""
  switch (true) {
    case totalFinalScore >= 12:
      scoreRelevance = "Definitive"
      break
    case totalFinalScore >= 9:
      scoreRelevance = "Strong"
      break
    case totalFinalScore >= 6:
      scoreRelevance = "Moderate"
      break
    case totalFinalScore >= 3:
      scoreRelevance = "Limited"
      break
    default:
      scoreRelevance = "No Support"
  }

  // Prepare data for word cloud
  const words = useMemo(
    () =>
      Object.keys(variantWordCounts).map((key) => ({
        text: key,
        value: variantWordCounts[key],
      })),
    [variantWordCounts]
  )

  const evidenceTypeWords = useMemo(
    () =>
      Object.keys(evidenceTypeCounts).map((key) => ({
        text: key,
        value: evidenceTypeCounts[key],
      })),
    [evidenceTypeCounts]
  )

  // Define columns for the interactive table
  const columns: ColumnDef<any, any>[] = useMemo(
    () => [
      {
        accessorKey: "case_id",
        header: "Case ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "sex",
        header: "Sex",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "inheritance",
        header: "Inheritance",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "total_case_score",
        header: "Final Score",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phenotype_quality",
        header: "Phenotype Quality",
        cell: (info) => info.getValue(),
      },
    ],
    []
  )

  return (
    <AuthWrapper>
      <Header
        selectedJob={selectedJob}
        allTasksCompleted={allTasksCompleted}
        lastUpdateTime={lastUpdateTime}
      />
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            onClick={() => setShowFileDetails(false)}
            value="dashboard"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="literature">Literature</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="mx-auto p-6 space-y-6 overflow-y-auto h-full">
            {/* Main Content */}
            {!showFileDetails ? (
              <>
                {/* Overview Cards */}
                <OverviewCards
                  totalFinalScore={totalFinalScore}
                  totalFiles={childrenData?.length || 0}
                  totalReports={caseDetailsData?.length || 0}
                  scoreRelevance={scoreRelevance}
                />

                {/* Alerts */}
                <Alerts
                  errorMessage={selectedJob?.error_message}
                  childrenError={!!childrenError}
                />
                <Card className="relative h-full">
                  <CardHeader>
                    <CardTitle>{gene_name} Explorer</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    {geneInfoData && Object.keys(geneInfoData).length > 0 ? (
                      <GenomeBrowser geneInfoData={geneInfoData} />
                    ) : (
                      <Spinner className="h-10 w-10" />
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Word Clouds */}
                  <WordClouds
                    words={words}
                    evidenceTypeWords={evidenceTypeWords}
                    isLoading={isChildrenLoading}
                  />

                  {/* Inheritance Patterns by Sex Chart */}
                  <InheritancePatternsChart
                    childrenData={childrenData}
                    isLoading={isChildrenLoading}
                  />
                </div>

                {/* Case Details Interactive Table */}
                <CaseDetailsTable
                  caseDetailsData={caseDetailsData}
                  columns={columns}
                  isLoading={isChildrenLoading}
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileDetails(false)}
                  className="mt-4"
                  aria-label="Back to Dashboard"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>

                {/* Report Metrics Section */}
                <ReportMetrics
                  reportData={casesData}
                  finalScoreSum={totalFinalScore}
                  variants={variants}
                  impacts={impacts}
                />

                {/* File Details */}
                <FileDetails
                  selectedFile={taskInfo}
                  handleRating={() => {}}
                  onBack={() => setShowFileDetails(false)}
                  isLoading={isTaskInfoLoading}
                  //curation_reviews={taskInfo.curation_reviews}
                />
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="literature">
          {!showFileDetails ? (
            <div className="mx-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-1">
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {childrenData?.length || 0}
                  </span>
                  <span className="text-sm">Total Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <CheckCircle2 className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {childrenData?.filter((task: any) =>
                      task.steps?.some(
                        (step: any) => step.status === "completed"
                      )
                    ).length || 0}
                  </span>
                  <span className="text-sm">Processed Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {childrenData?.length -
                      (childrenData?.filter((task: any) =>
                        task.steps?.some(
                          (step: any) => step.status === "completed"
                        )
                      ).length || 0)}
                  </span>
                  <span className="text-sm">Pending Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <XCircle className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {
                      childrenData?.filter((task) =>
                        task.steps?.some(
                          (step: any) => step.status === "failed"
                        )
                      ).length
                    }
                  </span>
                  <span className="text-sm">Files with Errors</span>
                </Card>
              </div>

              {/* Alerts */}
              <Alerts
                errorMessage={selectedJob?.error_message}
                childrenError={false}
              />

              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-row justify-between items-center">
                      <CardTitle>Curated Literature</CardTitle>
                      <AddFilesDialog parent_task_id={selectedJob?.id} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FileStatusList
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      handleFileClick={handleFileClick}
                      tasks={childrenData}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="mx-auto p-6 space-y-6">
              <PayloadVisualization
                payload={selectedCase}
                isLoading={isChildrenLoading}
                selectedFile={taskInfo}
                onBack={() => setShowFileDetails(false)}
                isLoading={isChildrenLoading}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AuthWrapper>
  )
}

{
  /* Report Metrics Section */
}
// <ReportMetrics
//   reportData={selectedCase ?? []}
//   finalScoreSum={selectedCase?.reduce(
//     (sum: number, caseItem: any) =>
//       sum + caseItem.total_case_score,
//     0
//   )}
//   variants={variants}
//   impacts={impacts}
// />

// {/* Score Rationale Section */}
// <ScoreRationale scoreRationale={casesData ?? []} />

// {/* File Details */}
//   <Drawer>
//   <DrawerTrigger>Extraction Rationale</DrawerTrigger>
//   <DrawerContent>
//   <FileDetails
//     selectedFile={taskInfo}
//     handleRating={() => {}}
//     onBack={() => setShowFileDetails(false)}
//     isLoading={isChildrenLoading}
//   />
//   </DrawerContent>
// </Drawer>
// <div className="grid grid-cols-1 gap-4">
//   <FileDetails
//     selectedFile={taskInfo}
//     handleRating={() => {}}
//     onBack={() => setShowFileDetails(false)}
//     isLoading={isChildrenLoading}
//   />
// </div>
