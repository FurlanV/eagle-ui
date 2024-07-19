"use client"

import { useState } from "react"
import {
  useGetJobInformationQuery,
  useGetUserJobsQuery,
} from "@/services/eagle/jobs"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { EagleJob } from "@/types/eagle-job"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { JobCollapsible } from "@/components/job-collapsible"
import { LoadingCard } from "@/components/loading-card"

export default function CurationsPage() {
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [selectedPhase, setSelectedPhase] = useState<any>(null)
  const { data = [], error, isLoading } = useGetUserJobsQuery()
  const {
    data: jobData = [],
    error: jobError,
    isLoading: jobIsLoading,
  } = useGetJobInformationQuery({
    job_id: selectedPaper?.job_id ?? null,
    paper_id: selectedPaper?.id ?? null,
  })

  return (
    <section className="flex flex-row h-full w-full">
      <div className="w-1/2 p-4 gap-2 overflow-scroll h-full">
        <div className="flex flex-row items-center gap-2 w-full h-full">
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="h-2/3">
              <h2 className="text-lg font-bold">Jobs</h2>
              {!isLoading ? (
                data.map((job: EagleJob) => {
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
                })
              ) : (
                <LoadingCard />
              )}
            </div>

            {/* <Separator orientation="horizontal" />
            <div>
              {selectedPaper && (
                <div className="flex flex-col h-full gap-2 w-full h-[300px]">
                  <h2 className="text-lg font-bold">Phases</h2>
                  <div className="space-y-1 overflow-scroll h-full">
                    {jobData.map((job: any) => (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedPhase(job)}
                      >
                        {job.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div> */}
          </div>
          <Separator orientation="vertical" className="h-full" />
        </div>
      </div>

      {/* <div className="h-full gap-6 w-[30rem] p-4">
        <div className="flex flex-row items-center gap-2 w-full h-full">
          {selectedPaper && (
            <div className="flex flex-col h-full gap-2 w-full">
              <h2 className="text-lg font-bold">Curation Phases</h2>
              <div className="space-y-1 overflow-scroll h-full">
                {jobData.map((job: any) => (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedPhase(job)}
                  >
                    {job.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Separator orientation="vertical" className="ml-4" />
        </div>
      </div> */}

      <div className="p-4 gap-3 h-full w-full col-span-5">
        <div className="flex flex-col gap-2 overflow-scroll h-[58rem] w-full">
          <h2 className="text-xl font-bold">{selectedPhase?.name}</h2>
          <Markdown className="w-full markdown" remarkPlugins={[remarkGfm]}>
            {selectedPhase?.output}
          </Markdown>
        </div>
      </div>
      {/* <div className="flex flex-col w-[25rem] p-4 gap-3 h-full">
          <h2 className="text-lg font-bold">Active Jobs</h2>
          <div className="flex flex-col gap-2 overflow-scroll h-[37rem]">

          </div>
        </div> */}
    </section>
  )
}
