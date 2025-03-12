import {
    createApi
} from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/eagle')

export const eagleCasesAPI = createApi({
    reducerPath: 'eagleCasesAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCasesByGene: builder.query<EagleJob[], string>({
            query: (gene_id: string) => `/cases?gene_name=${gene_id}`,
        }),
        deleteCase: builder.mutation<void, number>({
            query: (case_id: number) => `/case/delete?case_id=${case_id}`,
        }),
        softDeleteCase: builder.mutation<void, number>({
            query: (case_id: number) => `/case/soft-delete?case_id=${case_id}`,
        }),
        restoreCase: builder.mutation<void, number>({
            query: (case_id: number) => `/case/restore?case_id=${case_id}`,
        }),
        rescoreCase: builder.mutation<void, number>({
            query: (case_id: number) => `/case/rescore?case_id=${case_id}`,
        }),
    }),
})

export const { useGetCasesByGeneQuery, useDeleteCaseMutation, useSoftDeleteCaseMutation, useRestoreCaseMutation, useRescoreCaseMutation } = eagleCasesAPI