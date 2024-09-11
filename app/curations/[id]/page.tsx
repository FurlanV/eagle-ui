"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGetTaskChildrenQuery, useGetTaskInfoQuery } from "@/services/tasks"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  XCircle,
} from "lucide-react"

import { Task } from "@/types/eagle-job"
import { useAppSelector } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthWrapper } from "@/components/auth-wrapper"
import { FileDetails } from "@/components/file-details"
import { FileStatusList } from "@/components/file-status-list"

export default function CurationDetailsPage() {
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<Task | null>(null)
  const [showFileDetails, setShowFileDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { selectedJob } = useAppSelector((state) => state.jobs)

  const { data: childrenData, isLoading: isChildrenLoading } =
    useGetTaskChildrenQuery(selectedJob?.id, {
      skip: !selectedJob,
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000,
    })

  const { data: taskInfo, isLoading: isTaskInfoLoading } = useGetTaskInfoQuery(
    selectedFile?.id,
    {
      skip: !selectedFile,
      refetchOnMountOrArgChange: true,
      pollingInterval: 3000,
    }
  )

  const handleFileClick = (task: Task) => {
    setSelectedFile(task)
    setShowFileDetails(true)
  }

  const totalFiles = childrenData?.length || 0
  const processedFiles =
    childrenData?.filter((step: any) => step.status === "completed").length || 0

  const progress = (processedFiles / totalFiles) * 100

  const filesWithErrors = childrenData?.filter(
    (step: any) => step.status === "failed"
  ).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-800"
      case "failed":
        return "bg-destructive"
      case "running":
        return "bg-yellow-600"
      default:
        return "bg-muted"
    }
  }

  useEffect(() => {
    if (childrenData) {
      setIsLoading(false)
    }
  }, [childrenData])

  const router = useRouter()

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
              Back to Curations
            </Button>
            <h1 className="text-3xl font-bold">
              Curation: {selectedJob?.task_name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              className={`${getStatusColor(
                selectedJob?.status
              )} flex items-center space-x-2`}
            >
              {selectedJob?.status === "error" && <span>Curation Error</span>}
              {selectedJob?.status === "completed" && (
                <span>Curation Completed</span>
              )}
              {selectedJob?.status === "running" && (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Curation Running</span>
                </>
              )}
              {selectedJob?.status === "pending" && (
                <span>Curation Pending</span>
              )}
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-2">
              {lastUpdateTime ? (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              )}
              <span>Real-time updates</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                Updated: {lastUpdateTime && lastUpdateTime.toLocaleTimeString()}
              </span>
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="flex flex-col items-center rounded-lg p-4">
            <FileText className="w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{totalFiles}</span>
            <span className="text-sm">Total Files</span>
          </Card>
          <Card className="flex flex-col items-center rounded-lg p-4">
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{processedFiles}</span>
            <span className="text-sm">Processed Files</span>
          </Card>
          <Card className="flex flex-col items-center rounded-lg p-4">
            <AlertCircle className="w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">
              {totalFiles - processedFiles}
            </span>
            <span className="text-sm">Pending Files</span>
          </Card>
          <Card className="flex flex-col items-center rounded-lg p-4">
            <XCircle className="w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{filesWithErrors}</span>
            <span className="text-sm">Files with Errors</span>
          </Card>
        </div>

        {showFileDetails ? (
          <div className="grid grid-cols-1 gap-4">
            <FileDetails
              selectedFile={taskInfo}
              handleRating={() => {}} // Implement rating functionality if needed
              onBack={() => setShowFileDetails(false)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Files Status</CardTitle>
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
        )}
      </div>
    </AuthWrapper>
  )
}
