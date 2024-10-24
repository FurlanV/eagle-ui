"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetTaskChildrenQuery, useGetTaskInfoQuery } from "@/services/tasks"
import ParentSize from "@visx/responsive/lib/components/ParentSize"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Terminal,
  XCircle,
} from "lucide-react"

import { Task } from "@/types/eagle-job"
import { useAppSelector } from "@/lib/hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddFilesDialog } from "@/components/add-files-dialog"
import { AuthWrapper } from "@/components/auth-wrapper"
import { FileDetails } from "@/components/file-details"
import { FileStatusList } from "@/components/file-status-list"
import { WordCloudGraph } from "@/components/word-cloud-graph"

export default function CurationDetailsPage() {
  const [stopPolling, setStopPolling] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<Task | null>(null)
  const [showFileDetails, setShowFileDetails] = useState(false)

  const [totalFinalScore, setTotalFinalScore] = useState(0)
  const [variantWordCounts, setVariantWordCounts] = useState<
    Record<string, number>
  >({})
  const [evidenceTypeCounts, setEvidenceTypeCounts] = useState<
    Record<string, number>
  >({})
  const [otherInsights, setOtherInsights] = useState<{
    totalReports: number
    averageScore: number
  }>({
    totalReports: 0,
    averageScore: 0,
  })

  const { selectedJob } = useAppSelector((state) => state.jobs)

  const { data: childrenData, isLoading: isChildrenLoading } =
    useGetTaskChildrenQuery(selectedJob?.id, {
      skip: !selectedJob,
      refetchOnMountOrArgChange: true,
      pollingInterval: stopPolling ? null : 5000,
    })

  const totalFiles = childrenData?.length || 0
  const processedFiles =
    childrenData?.filter((task: Task) =>
      task.steps?.some((step) => step.status === "completed")
    ).length || 0

  const filesWithErrors =
    childrenData?.filter((task: Task) =>
      task.steps?.some((step) => step.status === "failed")
    ).length || 0

  const allTasksCompleted =
    (childrenData &&
      childrenData.length > 0 &&
      childrenData?.every((task: Task) =>
        task.steps?.every(
          (step) => step.status === "completed" || step.status === "failed"
        )
      )) ||
    false

  const { data: taskInfo, isLoading: isTaskInfoLoading } = useGetTaskInfoQuery(
    selectedFile?.id,
    {
      skip: !selectedFile,
      refetchOnMountOrArgChange: true,
      pollingInterval: allTasksCompleted ? null : 3000,
    }
  )

  // Assuming report data is part of taskInfo
  const reportData = selectedFile?.reports || []

  useEffect(() => {
    setLastUpdateTime(new Date())
    if (allTasksCompleted) {
      setStopPolling(true)
    }

    if (childrenData) {
      // Sum the final_score of all reports
      const totalScore = childrenData.reduce((sum, task) => {
        const taskTotal = task.reports?.reduce(
          (taskSum: number, report: any) => taskSum + report.final_score,
          0
        )
        return sum + (taskTotal || 0)
      }, 0)
      setTotalFinalScore(totalScore)

      // Extract variants and count occurrences
      const variantCounts: Record<string, number> = {}
      childrenData.forEach((task) => {
        task.reports?.forEach((report: any) => {
          const variant = report.variant
          if (variant) {
            variantCounts[variant] = (variantCounts[variant] || 0) + 1
          }
        })
      })
      setVariantWordCounts(variantCounts)

      // Extract evidence types and count occurrences
      const evidenceTypeCounts: Record<string, number> = {}
      childrenData.forEach((task) => {
        task.reports?.forEach((report: any) => {
          const evidenceType = report.evidence_type
          if (evidenceType) {
            evidenceTypeCounts[evidenceType] =
              (evidenceTypeCounts[evidenceType] || 0) + 1
          }
        })
      })
      setEvidenceTypeCounts(evidenceTypeCounts)

      // Generate other insights based on the data
      const totalReports = childrenData.reduce(
        (sum, task) => sum + (task.reports?.length || 0),
        0
      )
      const averageScore = totalReports ? totalScore / totalReports : 0
      setOtherInsights({
        totalReports,
        averageScore,
      })
    }
  }, [childrenData])

  // Prepare data for word cloud
  const words = Object.keys(variantWordCounts).map((key) => ({
    text: key,
    value: variantWordCounts[key],
  }))

  const evidenceTypeWords = Object.keys(evidenceTypeCounts).map((key) => ({
    text: key,
    value: evidenceTypeCounts[key],
  }))

  const handleFileClick = (task: Task) => {
    setSelectedFile(task)
    setShowFileDetails(true)
  }

  const router = useRouter()

  useEffect(() => {
    setLastUpdateTime(new Date())
    if (allTasksCompleted) {
      setStopPolling(true)
    }
  }, [allTasksCompleted])

  // Calculate Final Score Sum
  const finalScoreSum = reportData.reduce(
    (sum, report) => sum + report.final_score,
    0
  )

  // Extract Variants and Impacts
  const variants = reportData.map((report) => report.variant)
  const impacts = reportData.map((report) => report.impact)

  console.log(childrenData)

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

  return (
    <AuthWrapper>
      <div className="mx-auto p-6 gap-2 flex flex-col overflow-y-scroll h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/curations")}
              className="mr-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">{selectedJob?.task_name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-2">
              {allTasksCompleted ? "Completed" : "In Progress"}
            </Badge>

            <Badge variant="outline" className="flex items-center space-x-2">
              <span>Real-time updates</span>
              {!allTasksCompleted ? (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                Updated: {lastUpdateTime && lastUpdateTime.toLocaleTimeString()}
              </span>
            </Badge>
          </div>
        </div>

        {!showFileDetails ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-1">
              <Card className="flex flex-col items-center rounded-lg p-4">
                <Terminal className="w-8 h-8 mb-2" />
                <span className="text-2xl font-bold">{totalFinalScore}</span>
                <span className="text-sm">EAGLE Score</span>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4">
                <FileText className="w-8 h-8 mb-2" />
                <span className="text-2xl font-bold">{totalFiles}</span>
                <span className="text-sm">Number of Papers</span>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4">
                <FileText className="w-8 h-8 mb-2" />
                <span className="text-2xl font-bold">
                  {otherInsights.totalReports}
                </span>
                <span className="text-sm">Number of Cases</span>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="text-2xl font-bold">{scoreRelevance}</span>
                <span className="text-sm">ASD Gene Relevance</span>
              </Card>
            </div>

            {selectedJob?.error_message && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Occurred</AlertTitle>
                <AlertDescription>
                  {selectedJob?.error_message}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ParentSize>
                    {({ width, height }) => (
                      <WordCloudGraph
                        width={width}
                        height={height}
                        words={words}
                        sizeRange={[15, 30]}
                      />
                    )}
                  </ParentSize>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Variant Types</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ParentSize>
                    {({ width, height }) => (
                      <WordCloudGraph
                        width={width}
                        height={height}
                        words={evidenceTypeWords}
                      />
                    )}
                  </ParentSize>
                </CardContent>
              </Card>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="flex flex-col items-center rounded-lg p-4 ">
                <span className="text-lg font-semibold">Cases</span>
                <span className="text-3xl font-bold">{reportData.length}</span>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4 ">
                <span className="text-lg font-semibold">Final Score</span>
                <span className="text-3xl font-bold">{finalScoreSum}</span>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4 ">
                <span className="text-lg font-semibold">Variant</span>
                <ul className="list-disc list-inside text-center">
                  {variants.map((variant, index) => (
                    <li key={index}>{variant}</li>
                  ))}
                </ul>
              </Card>
              <Card className="flex flex-col items-center rounded-lg p-4 ">
                <span className="text-lg font-semibold">Impact</span>
                <ul className="list-disc list-inside text-center">
                  {impacts.map((impact, index) => (
                    <li key={index}>{impact}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Score Rationale Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Score Rationale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {reportData[0]?.score_rationale ||
                    "No score rationale available."}
                </p>
              </CardContent>
            </Card>

            {/* File Details and Report */}
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <FileDetails
                  selectedFile={taskInfo}
                  handleRating={() => {}} // Implement rating functionality if needed
                  onBack={() => setShowFileDetails(false)}
                  isLoading={isChildrenLoading}
                />
              </div>
              {/* <div className="grid grid-cols-1 gap-4">
                <Report reportData={reportData} />
              </div> */}
            </div>
          </>
        )}
      </div>
    </AuthWrapper>
  )
}
