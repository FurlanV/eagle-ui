import { createApi } from '@reduxjs/toolkit/query/react'
import type { Report } from '@/types/report'
import { createBaseQueryWithReauth } from '@/services/base-query'

const baseQueryWithReauth = createBaseQueryWithReauth('/api/report/')

export const eagleReportAPI = createApi({
    reducerPath: 'eagleReportAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getReportsByGene: builder.query<Report[], string>({
            query: (gene_symbol: string) => `gene?symbol=${gene_symbol}`,
        }),
        getReportsByCaseId: builder.query<Report[], string>({
            query: (caseId: string) => `cases?case_id=${caseId}`,
        }),
        getAllReports: builder.query<Report[], void>({
            query: () => '',
        }),
    }),
})

export const { useGetReportsByGeneQuery, useGetAllReportsQuery, useGetReportsByCaseIdQuery } = eagleReportAPI