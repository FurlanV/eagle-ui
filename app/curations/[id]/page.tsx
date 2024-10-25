// gendex-ui/app/curations/[id]/page.tsx
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { AuthWrapper } from "@/components/auth-wrapper";
import { AddFilesDialog } from "@/components/add-files-dialog";
import { FileStatusList } from "@/components/file-status-list";
import { FileDetails } from "@/components/file-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

// Import custom hook and types
import { useCurationData } from "./hooks/useCurationData";
import { ReportData } from "./types";

// Import separated components
import { Header } from "./components/header";
import { OverviewCards } from "./components/overview-cards";
import { Alerts } from "./components/alerts";
import { WordClouds } from "./components/word-clouds";
import { InheritancePatternsChart } from "./components/inheritance-pattern-chart";
import { CaseDetailsTable } from "./components/case-details-table";
import { ReportMetrics } from "./components/report-metrics";
import { ScoreRationale } from "./components/score-rationale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FileText } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { XCircle } from "lucide-react";

export default function CurationDetailsPage() {
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob);
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
  } = useCurationData(selectedJob);

  const handleFileClick = (task: any) => {
    setSelectedFile(task);
    setShowFileDetails(true);
  };

  // Calculate Final Score Sum
  const reportData = selectedFile?.reports || [];
  const finalScoreSum = reportData.reduce((sum, report) => sum + report.final_score, 0);

  // Extract Variants and Impacts
  const variants = reportData.map((report) => report.variant);
  const impacts = reportData.map((report) => report.impact);

  // Determine Score Relevance
  let scoreRelevance = "";
  switch (true) {
    case totalFinalScore >= 12:
      scoreRelevance = "Definitive";
      break;
    case totalFinalScore >= 9:
      scoreRelevance = "Strong";
      break;
    case totalFinalScore >= 6:
      scoreRelevance = "Moderate";
      break;
    case totalFinalScore >= 3:
      scoreRelevance = "Limited";
      break;
    default:
      scoreRelevance = "No Support";
  }

  // Prepare data for word cloud
  const words = useMemo(
    () =>
      Object.keys(variantWordCounts).map((key) => ({
        text: key,
        value: variantWordCounts[key],
      })),
    [variantWordCounts]
  );

  const evidenceTypeWords = useMemo(
    () =>
      Object.keys(evidenceTypeCounts).map((key) => ({
        text: key,
        value: evidenceTypeCounts[key],
      })),
    [evidenceTypeCounts]
  );

  // Example data extraction for the interactive table
  const caseDetailsData: ReportData[] =
    childrenData?.flatMap(
      (task: Task) =>
        task.reports?.map((report: any) => ({
          reported_case_id: report.reported_case_id,
          sex: report.sex,
          inheritance: report.inheritance,
          final_score: report.final_score,
          phenotype: report.phenotype,
          variant_notes: report.variant_notes,
          cognitive_ability_comment: report.cognitive_ability_comment,
          notes: report.notes,
          score_rationale: report.score_rationale,
        })) || []
    ) || [];

  // Define columns for the interactive table
  const columns: ColumnDef<any, any>[] = useMemo(
    () => [
      {
        accessorKey: "reported_case_id",
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
        accessorKey: "final_score",
        header: "Final Score",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phenotype",
        header: "Phenotype",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  return (
    <AuthWrapper>
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="literature">Literature</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="w-full h-full">
          <div className="mx-auto p-6 space-y-6 overflow-y-auto h-screen">
            {/* Header */}
            <Header
              selectedJob={selectedJob}
              allTasksCompleted={allTasksCompleted}
              lastUpdateTime={lastUpdateTime}
            />

            {/* Main Content */}
            {!showFileDetails ? (
              <>
                {/* Overview Cards */}
                <OverviewCards
                  totalFinalScore={totalFinalScore}
                  totalFiles={childrenData?.length || 0}
                  totalReports={otherInsights.totalReports}
                  scoreRelevance={scoreRelevance}
                />

                {/* Alerts */}
                <Alerts
                  errorMessage={selectedJob?.error_message}
                  childrenError={!!childrenError}
                />

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
                  reportData={reportData}
                  finalScoreSum={finalScoreSum}
                  variants={variants}
                  impacts={impacts}
                />

                {/* Score Rationale Section */}
                <ScoreRationale scoreRationale={reportData[0]?.score_rationale} />

                {/* File Details */}
                <FileDetails
                  selectedFile={taskInfo}
                  handleRating={() => {}}
                  onBack={() => setShowFileDetails(false)}
                  isLoading={isTaskInfoLoading}
                />
              </>
            )}
          </div>
        </TabsContent>
        <TabsContent value="literature">
          {!showFileDetails ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-1">
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <FileText className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">{childrenData?.length || 0}</span>
                  <span className="text-sm">Total Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <CheckCircle2 className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {childrenData?.filter((task) =>
                      task.steps?.some((step) => step.status === "completed")
                    ).length || 0}
                  </span>
                  <span className="text-sm">Processed Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {childrenData?.length -
                      (childrenData?.filter((task) =>
                        task.steps?.some((step) => step.status === "completed")
                      ).length || 0)}
                  </span>
                  <span className="text-sm">Pending Files</span>
                </Card>
                <Card className="flex flex-col items-center rounded-lg p-4">
                  <XCircle className="w-8 h-8 mb-2" />
                  <span className="text-2xl font-bold">
                    {
                      childrenData?.filter((task) =>
                        task.steps?.some((step) => step.status === "failed")
                      ).length
                    }
                  </span>
                  <span className="text-sm">Files with Errors</span>
                </Card>
              </div>

              {/* Alerts */}
              <Alerts errorMessage={selectedJob?.error_message} childrenError={false} />

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
            </>
          ) : (
            <>
              {/* Report Metrics Section */}
              <ReportMetrics
                reportData={reportData}
                finalScoreSum={finalScoreSum}
                variants={variants}
                impacts={impacts}
              />

              {/* Score Rationale Section */}
              <ScoreRationale scoreRationale={reportData[0]?.score_rationale} />

              {/* File Details */}
              <div className="grid grid-cols-1 gap-4">
                <FileDetails
                  selectedFile={taskInfo}
                  handleRating={() => {}}
                  onBack={() => setShowFileDetails(false)}
                  isLoading={isChildrenLoading}
                />
                {/* Uncomment and implement Report component if needed */}
                {/* <Report reportData={reportData} /> */}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AuthWrapper>
  );
}