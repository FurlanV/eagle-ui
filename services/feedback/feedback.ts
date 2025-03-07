import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const feedbackAPI = createApi({
    reducerPath: 'feedbackAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/eagle/api/feedback' }),
    endpoints: (builder) => ({
        addOrUpdateFeedback: builder.mutation<any, any>({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
        }),
        getFeedback: builder.query<any[], string>({
            query: (caseId) => `/case/${caseId}`,
        }),
    }),
})

export const { useAddOrUpdateFeedbackMutation, useGetFeedbackQuery } = feedbackAPI