"use client"

import { useState } from "react"
import {
  useGetJobInformationQuery,
  useGetUserJobsQuery,
} from "@/services/eagle/jobs"
import { PopoverTrigger } from "@radix-ui/react-popover"

import { EagleJob } from "@/types/eagle-job"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CurationReviewDialog } from "@/components/curation-review-dialog"
import { DashboardCards } from "@/components/dashboard-cards"
import { Icons } from "@/components/icons"
import { LoadingCard } from "@/components/loading-card"
import { NewJobDialog } from "@/components/new-job-dialog"
import { SearchInput } from "@/components/search-input"

export default function IndexPage() {
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [selectedPhase, setSelectedPhase] = useState<any>(null)
  const { data = [], error, isLoading } = useGetUserJobsQuery()
  const {
    data: jobData = [],
    error: jobError,
    isLoading: jobIsLoading,
  } = useGetJobInformationQuery(selectedPaper?.id ?? null)

  return (
    <main className="flex h-full flex-row">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col border w-full h-full">
          <section className="flex flex-row items-center w-full p-3">
            <div className="w-full justify-between flex flex-row items-center">
              <SearchInput />
              <div className="flex flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icons.play className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="end">
                    <h2 className="text-lg font-bold p-2">Active Jobs</h2>
                    <div className="flex flex-col gap-1 h-72 overflow-scroll">
                      {!isLoading && data ? (
                        data.map((job: EagleJob) => {
                          return (
                            <CurationReviewDialog
                              key={job.id}
                              job_id={job.id}
                              job_name={job.job_name}
                              job_status={job.status}
                            />
                          )
                        })
                      ) : (
                        <LoadingCard />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="ghost" size="icon">
                  <Icons.bell className="h-6 w-6 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-row gap-4 w-18 ml-4">
              <Avatar>
                <AvatarFallback>VF</AvatarFallback>
              </Avatar>
            </div>
          </section>
          <Separator orientation="horizontal" />
          <section className="flex flex-col w-full p-4 gap-2 col-span-2">
            <div className="gap-2 flex flex-row justify-between items-center w-full">
              <div>
                <h1 className="text-2xl font-bold">EEVE Dashboard</h1>
                <h4 className="text-sm text-md">Hello, VF! Welcome back</h4>
              </div>
              <NewJobDialog />
            </div>
            <DashboardCards />
          </section>
          <Separator orientation="horizontal" />
          <section className="flex flex-row h-full w-full">

          </section>
        </div>
        {/* <div className="flex flex-col p-4 border w-[30rem]"></div> */}
      </div>
    </main>
  )
}
