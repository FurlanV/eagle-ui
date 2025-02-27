import { createApi } from '@reduxjs/toolkit/query/react'
import type { CurationReview } from '@/types/curation-review'
import { createBaseQueryWithReauth } from '@/services/base-query'

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/tasks/review') // remove trailing slash

export const curationReviewAPI = createApi({
    reducerPath: 'curationReviewAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCurationReviews: builder.query<CurationReview[], void>({
            query: () => '/',
        }),
        createCurationReview: builder.mutation<CurationReview, CurationReview>({
            query: (review) => ({
                url: '/',
                method: 'POST',
                body: review,
            }),
        }),
        updateCurationReview: builder.mutation<CurationReview, CurationReview>({
            query: (review) => ({
                url: '/task',
                method: 'POST',
                body: review,
            }),
        }),
        getCurationReviewsByJobId: builder.query<CurationReview, string>({
            query: (job_id: string) => `/task?job_id=${job_id}`,
        }),

    }),
})

export const { useGetCurationReviewsQuery, useCreateCurationReviewMutation, useUpdateCurationReviewMutation, useGetCurationReviewsByJobIdQuery } = curationReviewAPI
