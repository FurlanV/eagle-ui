import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Report } from '@/types/report'

export const eagleReportAPI = createApi({
    reducerPath: 'eagleReportAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/report/' }),
    endpoints: (builder) => ({
        getReportsByGene: builder.query<Report[], string>({
            query: (gene_symbol: string) => `gene?symbol=${gene_symbol}`,
        }),
    }),
})

export const { useGetReportsByGeneQuery } = eagleReportAPI