import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'

export const eagleAPI = createApi({
    reducerPath: 'eagleAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'api/eagle/' }),
    endpoints: (builder) => ({
        getUserJobs: builder.query<EagleJob[], string>({
            query: () => `jobs`,
        }),
        getJobPapers: builder.query<EagleJob[], string>({
            query: (id) => `job/papers?id=${id}`,
        }),
        getJobInformation: builder.query<EagleJob, any>({
            query: ({ job_id, paper_id }: any) => `job?id=${job_id}&paper_id=${paper_id}`,
        }),
    }),
})

export const { useGetUserJobsQuery, useGetJobInformationQuery, useGetJobPapersQuery } = eagleAPI