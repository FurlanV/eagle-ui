import {
    createApi
} from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/eagle/')

export const eagleCasesAPI = createApi({
    reducerPath: 'eagleCasesAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCasesByGene: builder.query<EagleJob[], string>({
            query: (gene_id: string) => `cases?gene_name=${gene_id}`,
        }),
    }),
})

export const { useGetCasesByGeneQuery } = eagleCasesAPI