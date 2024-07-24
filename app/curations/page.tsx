"use client"

import { useState } from "react"
import {
  useGetJobInformationQuery,
  useGetUserJobsQuery,
} from "@/services/eagle/jobs"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { EagleJob } from "@/types/eagle-job"
import { cn } from "@/lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { JobCollapsible } from "@/components/job-collapsible"

export default function CurationsPage({ defaultLayout = [17, 50, 15] }) {
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [selectedPhase, setSelectedPhase] = useState<any>(null)
  const {
    data = [],
    error,
    isLoading,
  } = useGetUserJobsQuery("", {
    pollingInterval: 10000, //30s
    skipPollingIfUnfocused: true,
  })
  const {
    data: jobData = [],
    error: jobError,
    isLoading: jobIsLoading,
  } = useGetJobInformationQuery(
    {
      job_id: selectedPaper?.job_id,
      paper_id: selectedPaper?.id,
    },
    {
      skip: !selectedPaper,
    }
  )

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsible={true}
          minSize={20}
          maxSize={28}
          onResize={() => {
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
        >
          <div className="flex items-center px-4 py-2 h-[48px]">
            <h1 className="text-xl font-bold">Jobs</h1>
          </div>
          <Separator className="my-2" />
          {data.map((job: EagleJob) => {
            return (
              <JobCollapsible
                key={job.id}
                job={job}
                selectedPaper={selectedPaper}
                setSelectedPaper={setSelectedPaper}
                setSelectedPhase={setSelectedPhase}
                selectedPhase={selectedPhase}
                jobData={jobData}
              />
            )
          })}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex items-center px-4 py-2 h-[56px]">
            <h1 className="text-xl font-bold">{selectedPhase?.name}</h1>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="overflow-scroll h-[calc(100vh-80px)]">
              <Markdown className="prose markdown" remarkPlugins={[remarkGfm]}>
                {selectedPhase?.output}
              </Markdown>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className="flex items-center px-4 h-[48px]">
            <h1 className="text-xl font-bold">Steps</h1>
          </div>
          <Separator className="my-2" />
          <div className="px-4 py-2">
            {selectedPaper && (
              <div className="flex flex-col h-full gap-2 w-full">
                <div className="space-y-1 overflow-scroll h-full">
                  {jobData?.map((job: any) => (
                    <div
                      key={job.id}
                      className="flex flex-row w-full items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedPhase(job)}
                    >
                      <div
                        className={cn(
                          "rounded-md border px-4 py-2 font-mono text-sm shadow-sm w-full",
                          selectedPhase?.id === job.id && "bg-muted"
                        )}
                      >
                        {job.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
