import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function TaskOverview({ taskData, lastUpdateTime }) {
  const totalFiles = Object.keys(taskData.steps || {}).length
  const processedFiles = Object.values(taskData.steps || {}).filter(
    (steps: any[]) => steps.every((step) => step.status === "completed")
  ).length
  const pendingFiles = totalFiles - processedFiles
  const filesWithErrors = Object.values(taskData.steps || {}).filter(
    (steps: any[]) => steps.some((step) => step.status === "error")
  ).length

  return (
    <Card className="bg-white/10">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{taskData.task_name}</h2>
            <p className="text-sm text-muted-foreground">
              Task ID: {taskData.task_id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{taskData.status}</Badge>
            <Badge variant="outline">
              Updated: {lastUpdateTime && lastUpdateTime.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Stat icon={FileText} value={totalFiles} label="Total Files" />
          <Stat icon={CheckCircle2} value={processedFiles} label="Processed" />
          <Stat icon={Clock} value={pendingFiles} label="Pending" />
          <Stat icon={AlertCircle} value={filesWithErrors} label="Errors" />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}
