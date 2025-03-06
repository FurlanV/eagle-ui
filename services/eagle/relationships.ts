
import {
    createApi
} from '@reduxjs/toolkit/query/react'
import type { EagleJob } from '@/types/eagle-job'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/eagle/')

export const eagleRelationshipsAPI = createApi({
    reducerPath: 'eagleRelationshipsAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPaperRelationships: builder.query<EagleJob[], string>({
            query: (paper_id: string) => `relationships?id=${paper_id}`,
        }),
    }),
})

export const { useGetPaperRelationshipsQuery } = eagleRelationshipsAPI