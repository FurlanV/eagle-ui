import {
    createApi
} from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/api/')

export const eagleAPI = createApi({
    reducerPath: 'eagleAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserJobs: builder.query<EagleJob[], string>({
            query: () => `eagle/jobs`,
        }),
        getJobPapers: builder.query<EagleJob[], string>({
            query: (id) => `eagle/job/papers?id=${id}`,
        }),
        getJobInformation: builder.query<EagleJob, any>({
            query: ({ job_id, paper_id }: any) => `eagle/job?id=${job_id}&paper_id=${paper_id}`,
        }),
    }),
})

export const { useGetUserJobsQuery, useGetJobInformationQuery, useGetJobPapersQuery } = eagleAPI