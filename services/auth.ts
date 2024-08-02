import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '@/types/user'

export interface UserResponse {
    user: User
    token: string
    refresh_token: string
}

export interface LoginRequest {
    email: string
    password: string
}

export const authAPI = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
    }),
    endpoints: (builder) => ({
        login: builder.mutation<UserResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'auth',
                method: 'POST',
                body: credentials,
            }),
        }),
        verifyAuthentication: builder.query<User | null, { token: string }>({
            query: ({ token }) => ({
                url: 'auth/verify',
                method: 'POST',
                body: JSON.stringify({ token }),
            }),
        }),
        refresh: builder.mutation<UserResponse, { token: string, refresh_token: string }>({
            query: ({ token, refresh_token }) => ({
                url: 'auth/refresh',
                method: 'POST',
                body: JSON.stringify({ token, refresh_token }),
            }),
        }),
    })
})

export const { useLoginMutation, useVerifyAuthenticationQuery } = authAPI
