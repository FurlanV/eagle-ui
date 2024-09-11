"use client"

import {
  useGetJobInformationQuery,
  useGetUserTasksQuery,
} from "@/services/tasks"
import { setSelectedJob } from "@/store/eagle/job-slice"

import { EagleJob } from "@/types/eagle-job"
import { useAppDispatch } from "@/lib/hooks"
import { AuthWrapper } from "@/components/auth-wrapper"
import { JobsTable } from "@/components/jobs-table"

export default function CurationsPage() {
  const {
    data = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserTasksQuery("", {
    pollingInterval: 10000,
    skipPollingIfUnfocused: true,
  })

  const dispatch = useAppDispatch()

  return (
    <AuthWrapper>
      <div className="flex flex-col p-4 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Curations</h1>
        </header>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error.toString()}</span>
          </div>
        )}

        <JobsTable
          data={data}
          setJob={(job: EagleJob) => dispatch(setSelectedJob(job))}
          isLoading={isFetching}
          refetch={() => refetch()}
        />
      </div>
    </AuthWrapper>
  )
}
