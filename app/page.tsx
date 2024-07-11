"use client"

import { useEffect, useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CurationReviewDialog } from "@/components/curation-review-dialog"
import { DashboardCards } from "@/components/dashboard-cards"
import { Icons } from "@/components/icons"
import { NewJobDialog } from "@/components/new-job-dialog"
import { SearchInput } from "@/components/search-input"

export default function IndexPage() {
  const [jobs, setJobs] = useState([])

  const fetchEagleJobs = async () => {
    const response = await fetch("/api/eagle/jobs")
    const res = await response.json()
    return res.data
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await fetchEagleJobs()
      setJobs(data)
    }
    fetchJobs()
  }, [])

  return (
    <main className="flex h-full flex-row">
      <div className="flex flex-row w-full">
        <div className="flex flex-col border w-full">
          <section className="flex flex-row items-center w-full p-3">
            <div className="w-full justify-between flex flex-row items-center">
              <SearchInput />
              <Button variant="ghost" size="icon">
                <Icons.bell className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-row gap-4 w-18 ml-4">
              <Avatar>
                <AvatarFallback>VF</AvatarFallback>
              </Avatar>
            </div>
          </section>
          <Separator orientation="horizontal" />
          <section className="flex flex-col w-full  p-4 gap-2">
            <div className="gap-2 flex flex-row justify-between items-center w-full">
              <div>
                <h1 className="text-2xl font-bold">EAGLE Dashboard</h1>
                <h4 className="text-sm text-md">Hello, VF! Welcome back</h4>
              </div>
              <NewJobDialog />
            </div>
            <DashboardCards />
          </section>
          <Separator orientation="horizontal" />
          <section className="flex flex-row w-full h-full">
            <div className="flex flex-col w-full p-4">
              <h2 className="text-lg font-bold">Recent Scores</h2>
              <div className="flex flex-col gap-4"></div>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col w-[25rem] p-4 overflow-scroll h-[42rem] gap-2">
              <h2 className="text-lg font-bold">Active Jobs</h2>
              {jobs.map((job) => {
                return (
                  <CurationReviewDialog
                    key={job.id}
                    job_id={job.id}
                    job_name={job.job_id}
                    job_status={job.status}
                  />
                )
              })}
            </div>
          </section>
        </div>
        {/* <div className="flex flex-col p-4 border w-[30rem]"></div> */}
      </div>
    </main>
  )
}
