"use client"

import { useState } from "react"
import { useGetJobPapersQuery } from "@/services/eagle/jobs"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Icons } from "./icons"

export function JobCollapsible({
  job,
  selectedPaper,
  setSelectedPaper,
  jobData,
  selectedPhase,
  setSelectedPhase,
}: any) {
  const { data = [], error, isLoading } = useGetJobPapersQuery(job.id)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible title={job.job_name}>
      <CollapsibleTrigger onClick={() => setIsOpen((prev: boolean) => !prev)}>
        <div className="flex flex-row items-center gap-2">
          {!isOpen ? (
            <Icons.chevronRight className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Icons.chevronDown className="h-6 w-6 text-muted-foreground" />
          )}
          {job.job_name}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 ml-8 cursor-pointer">
        {data.map((paper: any) => (
          <div className="flex flex-col flex-1 h-full gap-2 w-full">
            <div className="flex flex-row flex-1 gap-2 items-center w-full">
              {selectedPaper?.id === paper.id && (
                <Icons.chevronRight className="h-6 w-6 text-muted-foreground" />
              )}
              <div
                className={cn(
                  "rounded-md border px-4 py-2 font-mono text-sm shadow-sm w-full",
                  selectedPaper?.id === paper.id &&
                    "border-primary border-2 text-white"
                )}
                onClick={() => setSelectedPaper({ ...paper, job_id: job.id })}
              >
                <div className="flex flex-row items-center gap-2">
                  {paper.doi}
                </div>
              </div>
            </div>
            {selectedPaper && selectedPaper?.id === paper.id && (
              <div className="flex flex-col h-full gap-2 w-full ml-16">
                <div className="space-y-1 overflow-scroll h-full">
                  {jobData.map((job: any) => (
                    <div
                      key={job.id}
                      className="flex flex-row w-full items-center gap-2"
                      onClick={() => setSelectedPhase(job)}
                    >
                      {selectedPhase?.id === job.id && (
                        <Icons.chevronRight className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div
                        className={cn(
                          "rounded-full border px-4 py-2 font-mono text-sm shadow-sm w-[25rem]",
                          selectedPhase?.id === job.id &&
                            "border-primary border-2 text-white"
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
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
