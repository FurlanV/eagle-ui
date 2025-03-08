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
        getUserFeedbackForCases: builder.mutation({
            query: (data) => ({
                url: '/user_cases',
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const { useAddOrUpdateFeedbackMutation, useGetUserFeedbackForCasesMutation } = feedbackAPI