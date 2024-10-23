import {
    createApi
} from '@reduxjs/toolkit/query/react'
import { createBaseQueryWithReauth } from "@/services/base-query"

const baseQueryWithReauth = createBaseQueryWithReauth('/eagle/api/files')

export const filesAPI = createApi({
    reducerPath: 'filesAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAllFiles: builder.query<any[], string>({
            query: () => `/`,
        }),
        getFileContent: builder.query<string, string>({
            query: (file_name) => `/file/${file_name}`,
        }),
    }),
})

export const { useGetAllFilesQuery, useGetFileContentQuery } = filesAPI