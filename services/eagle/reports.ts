import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Report } from '@/types/report'
import { DashboardStats } from "@/types/dashboard"
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/eagle')

export const eagleReportAPI = createApi({
    reducerPath: 'eagleReportAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getReportsByGene: builder.query<Report[], string>({
            query: (geneId) => `/reports/gene/${geneId}`,
        }),
        getAllReports: builder.query<Report[], void>({
            query: () => `/reports`,
        }),
        getReportsByCaseId: builder.query<Report[], string>({
            query: (caseId) => `/reports/case/${caseId}`,
        }),
        getBasicReportInfo: builder.query<Report[], string>({
            query: (reportId) => `/reports/${reportId}/basic`,
        }),
        getFinalScorePerGene: builder.query<Report[], void>({
            query: () => `/reports/gene-scores`,
        }),
        getSankeyData: builder.query<Report[], void>({
            query: () => `/reports/sankey`,
        }),
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => `/dashboard`,
        }),
    }),
})

export const {
    useGetReportsByGeneQuery,
    useGetAllReportsQuery,
    useGetReportsByCaseIdQuery,
    useGetBasicReportInfoQuery,
    useGetFinalScorePerGeneQuery,
    useGetSankeyDataQuery,
    useGetDashboardStatsQuery,
} = eagleReportAPI