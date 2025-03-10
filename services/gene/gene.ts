import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const geneAPI = createApi({
    reducerPath: 'geneAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/eagle/api/genes/' }),
    endpoints: (builder) => ({
        getGeneInformation: builder.query<any[], string>({
            query: (gene_symbol: string) => `?name=${gene_symbol}`,
        }),
        getGenesWithCases: builder.query<any[], void>({
            query: () => 'cases',
        }),
        getGenePapersAndVariants: builder.query<any[], string>({
            query: (gene_id: string) => `papers-variants?gene_id=${gene_id}`,
        }),
        updateGeneASDRelavance: builder.mutation<any[], string>({
            query: (gene_id: string) => `asd-relevance?gene_id=${gene_id}`,
        }),
    }),
})

export const { useGetGeneInformationQuery, useGetGenesWithCasesQuery, useGetGenePapersAndVariantsQuery, useUpdateGeneASDRelavanceMutation } = geneAPI