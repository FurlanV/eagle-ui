import {
    createApi
} from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/tasks')

export const tasksAPI = createApi({
    reducerPath: 'tasksAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserTasks: builder.query<any[], string>({
            query: () => `/`,
        }),
        getTaskChildren: builder.query<EagleJob[], string>({
            query: (id) => `children?task_id=${id}`,
        }),
        getTaskInfo: builder.query<any, string>({
            query: (id) => `/current?task_id=${id}`,
        }),
        getJobInformation: builder.query<EagleJob, any>({
            query: ({ job_id, paper_id }: any) => `job?id=${job_id}&paper_id=${paper_id}`,
        }),
        deleteTask: builder.mutation<any, string>({
            query: (id) => `/delete?id=${id}`,
        }),
    }),
})

export const { useGetUserTasksQuery, useGetJobInformationQuery, useGetTaskChildrenQuery, useGetTaskInfoQuery, useDeleteTaskMutation } = tasksAPI