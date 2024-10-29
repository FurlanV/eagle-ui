import { createApi } from '@reduxjs/toolkit/query/react'
import type { Report } from '@/types/report'
import { createBaseQueryWithReauth } from '@/services/base-query'

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api')

export const eagleReportAPI = createApi({
    reducerPath: 'eagleReportAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getReportsByGene: builder.query<Report[], string>({
            query: (gene_symbol: string) => `/report/gene?symbol=${gene_symbol}`,
        }),
        getReportsByCaseId: builder.query<Report[], string>({
            query: (caseId: string) => `/report/cases?case_id=${caseId}`,
        }),
        getAllReports: builder.query<Report[], void>({
            query: () => '/report',
        }),
        getBasicReportInfo: builder.query<Report[], void>({
            query: () => '/report/dashboard',
        }),
        getFinalScorePerGene: builder.query<Report[], void>({
            query: () => '/report/dashboard/score',
        }),
        getSankeyData: builder.query<Report[], void>({
            query: () => '/report/dashboard/sankey',
        }),
    }),
})

export const { useGetReportsByGeneQuery, useGetAllReportsQuery, useGetReportsByCaseIdQuery, useGetBasicReportInfoQuery, useGetFinalScorePerGeneQuery, useGetSankeyDataQuery } = eagleReportAPI