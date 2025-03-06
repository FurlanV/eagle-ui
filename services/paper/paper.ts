import { createApi } from "@reduxjs/toolkit/query/react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createBaseQueryWithReauth } from "../base-query"

export interface Paper {
  id: number
  doi: string | null
  title: string
  abstract: string | null
  link: string | null
  year: number | null
  associated_disorders: string | null
  pmid: string | null
  first_author: string | null
  path: string | null
  autism_report: boolean
  asd_relevance_summary: string | null
}

// Create base query with the API URL
const baseQuery = createBaseQueryWithReauth("/eagle/api")

export const paperApi = createApi({
  reducerPath: "paperApi",
  baseQuery,
  tagTypes: ["Papers"],
  endpoints: (builder) => ({
    getAllPapers: builder.query<Paper[], void>({
      query: () => ({
        url: "/papers",
        method: "GET",
      }),
      providesTags: ["Papers"],
    }),
    getPaperById: builder.query<Paper, number>({
      query: (id: number) => ({
        url: `/paper/${id}`,
        method: "GET",
      }),
      providesTags: (result: Paper | undefined, error: any, id: number) => [{ type: "Papers", id }],
    }),
  }),
})

export const { useGetAllPapersQuery, useGetPaperByIdQuery } = paperApi 