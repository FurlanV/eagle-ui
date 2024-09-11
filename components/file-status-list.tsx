"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, FileText, Search } from "lucide-react"

import { Task } from "@/types/eagle-job"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileStatusListProps {
  tasks: Task[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleFileClick: (fileName: string) => void
}

const FileCard = ({
  fileName,
  task,
  onClick,
}: {
  task: Task
  onClick: () => void
}) => {
  const totalSteps = 2
  const completedSteps = 1
  const progress = 5

  return (
    <div
      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors"
      onClick={onClick}
    >
      <FileText className="w-8 h-8 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          Steps: {completedSteps}/{totalSteps}
        </p>
        <Progress value={progress} className="w-full h-2 mt-2 bg-white/20" />
      </div>
      <div className="flex flex-col items-end">
        <Badge variant={completedSteps === totalSteps ? "success" : "default"}>
          {completedSteps === totalSteps ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <Clock className="w-4 h-4 mr-1" />
          )}
          {completedSteps === totalSteps ? "Completed" : "In Progress"}
        </Badge>
        <span className="text-xs text-muted-foreground mt-1">
          {/* {formatDistanceToNow(new Date(steps[0].start_time), { addSuffix: true })} */}
        </span>
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
      <ScrollArea className="h-[calc(100vh-32rem)]">
        {tasks &&
          tasks.map((task) => (
            <FileCard
              key={task.task_name}
              fileName={task.task_name}
              steps={task.steps}
              onClick={() => handleFileClick(task)}
              task={task}
            />
          ))}
      </ScrollArea>
    </div>
  )
}
