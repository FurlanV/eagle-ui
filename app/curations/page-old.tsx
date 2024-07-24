"use client"

import { useState } from "react"
import {
  useGetJobInformationQuery,
  useGetUserJobsQuery,
} from "@/services/eagle/jobs"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { EagleJob } from "@/types/eagle-job"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { JobCollapsible } from "@/components/job-collapsible"
import { LoadingCard } from "@/components/loading-card"

export default function CurationsPage() {
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
  } = useGetJobInformationQuery({
    job_id: selectedPaper?.job_id ?? null,
    paper_id: selectedPaper?.id ?? null,
  })

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-4 p-4 gap-4 overflow-scroll">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col gap-2">
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
          <Separator orientation="vertical" className="h-full" />
        </div>
      </div>
      <div className="p-4 gap-3 h-full w-full col-span-8">
        <div className="flex flex-col gap-2 h-[58rem] w-full">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Relevant Cases
                </CardTitle>
                <Icons.testTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Not Relevant Papers
                </CardTitle>
                <Icons.testTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Curated Genes
                </CardTitle>
                <Icons.testTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Final Score
                </CardTitle>
                <Icons.testTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
          </div>
          <h2 className="text-xl font-bold">{selectedPhase?.name}</h2>
          <Card className="p-2">
            <Markdown
              className="w-full markdown overflow-scroll h-[45rem]"
              remarkPlugins={[remarkGfm]}
            >
              {selectedPhase?.output}
            </Markdown>
          </Card>
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
