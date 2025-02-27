"use client"

import React from "react"
import { useDeleteTaskMutation } from "@/services/tasks"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"

import { Task } from "@/types/eagle-job"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage,AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
interface FileStatusListProps {
  tasks: Task[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleFileClick: (fileName: string) => void
  curation_reviews: any
}

export function FileStatusList({
  tasks,
  searchTerm,
  setSearchTerm,
  handleFileClick,
}: FileStatusListProps) {
  const [deleteTask] = useDeleteTaskMutation()
  const { toast } = useToast()

  // Define table columns
  const columns: ColumnDef<Task, any>[] = React.useMemo(
    () => [
      {
        accessorKey: "task_name",
        header: "File Name",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span
              className="text-sm font-medium text-foreground cursor-pointer hover:underline"
              onClick={() => handleFileClick(row.original.task_name)}
            >
              {row.original.task_name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "last_update",
        header: "Last Update",
        cell: ({ row }) => {
          const task = row.original
          const lastStep = task.steps[0]
          const lastUpdate = lastStep
            ? formatDistanceToNow(new Date(lastStep.start_time), {
                addSuffix: true,
              })
            : "N/A"
          return (
            <span className="text-xs text-muted-foreground">{lastUpdate}</span>
          )
        },
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ row }) => {
          const task = row.original
          const totalSteps = task.steps.length || 0
          const completedSteps =
            task?.steps?.filter((step) => step.status === "completed").length || 0
          const progress =
            totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>{progress.toFixed(0)}% complete</TooltipContent>
                <Progress value={progress} className="w-full h-2 bg-white/20" />
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: "curation_reviews",
        header: "Reviewed By",
        cell: ({ row }) => (
          <div className="flex -space-x-2">
            {row.original.curation_reviews?.map((review: any) => (
              <TooltipProvider key={review.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800 cursor-pointer">
                      <AvatarImage src={review.user.profilePicture} alt={review.user.name} />
                      <AvatarFallback>
                        {review.user.name[0]}
                        {review.user.surname[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm font-medium">
                      {review.user.name} {review.user.surname}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "current_service",
        header: "Service Status",
        cell: ({ row }) => (
          <Badge className="flex items-center gap-1 justify-center">
            {/* <Cpu className="w-4 h-4" /> */}
            {row.original.current_service}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "General Status",
        cell: ({ row }) => {
          const task = row.original
          const totalSteps = task.steps.length || 0
          const completedSteps =
            task.steps.filter((step) => step.status === "completed").length || 0
          const failedSteps =
            task.steps.filter((step) => step.status === "failed").length || 0

          let variant = "default"
          let StatusIcon = Clock
          let text = "In Progress"

          if (totalSteps === 0) {
            text = "Queued"
          } else if (failedSteps > 0) {
            variant = "destructive"
            StatusIcon = XCircle
            text = "Failed"
          } else if (completedSteps === totalSteps) {
            variant = "secondary"
            StatusIcon = CheckCircle
            text = "Completed"
          }

          return (
            <Badge
              variant={variant}
              className={cn(
                "flex items-center gap-1 font-bold items-center justify-center"
              )}
            >
              <StatusIcon className="w-4 h-4" />
              {text}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ConfirmationDialog
            title="Delete File"
            description="Are you sure you want to delete this file?"
            onDelete={() => {
              deleteTask(row.original.id)
              toast({
                title: "File Deleted",
                description: "The file has been deleted successfully",
              })
            }}
          />
        ),
      },
    ],
    [handleFileClick, deleteTask, toast]
  )

  // Filter tasks based on search term
  const filteredTasks = React.useMemo(
    () =>
      tasks?.filter((task) =>
        task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tasks, searchTerm]
  )

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredTasks ?? []}
        initialPageSize={10}
        enableExpanding={false}
        onRowClick={(row) => {
          handleFileClick(row.original)
        }}
      />
    </div>
  )
}
