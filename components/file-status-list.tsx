"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, FileText, Search, XCircle } from "lucide-react"

import { Task } from "@/types/eagle-job"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FileStatusListProps {
  tasks: Task[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleFileClick: (fileName: string) => void
}

const FileCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const totalSteps = task?.steps?.length || 0
  const completedSteps =
    task?.steps?.filter((step) => step.status === "completed").length || 0
  const failedSteps =
    task?.steps?.filter((step) => step.status === "failed").length || 0
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  const getStatusInfo = () => {
    if (failedSteps > 0)
      return { variant: "destructive", icon: XCircle, text: "Failed" }
    if (completedSteps === totalSteps)
      return { variant: "secondary", icon: CheckCircle, text: "Completed" }
    return { variant: "default", icon: Clock, text: "In Progress" }
  }

  const { variant, icon: StatusIcon, text } = getStatusInfo()

  return (
    <div
      className="flex flex-row items-center space-x-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
      onClick={onClick}
    >
      <FileText className="w-8 h-8 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {task.task_name}
        </p>
        <p className="text-xs text-muted-foreground">
          Last Update:{" "}
          {formatDistanceToNow(new Date(task.steps[0].start_time), {
            addSuffix: true,
          })}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Progress
                value={progress}
                className="w-full h-2 mt-2 bg-white/20"
              />
            </TooltipTrigger>
            <TooltipContent>{progress.toFixed(0)}% complete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-row items-end gap-2">
        <Badge>{task.current_service}</Badge>
        <Badge
          variant={variant}
          className={cn("items-center justify-center w-[10em] font-bold")}
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {text}
        </Badge>
      </div>
    </div>
  )
}

export function FileStatusList({
  tasks,
  searchTerm,
  setSearchTerm,
  handleFileClick,
}: FileStatusListProps) {
  const filteredTasks = tasks?.filter((task) =>
    task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
        icon={<Search className="h-4 w-4 text-muted-foreground" />}
      />
      <ScrollArea className="h-[calc(100vh-28rem)]">
        {filteredTasks?.length > 0 ? (
          filteredTasks.map((task) => (
            <FileCard
              key={task.task_name}
              task={task}
              onClick={() => handleFileClick(task)}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No matching files found
          </p>
        )}
      </ScrollArea>
    </div>
  )
}
