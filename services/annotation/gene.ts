import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Report } from '@/types/report'

export const ensemblGeneAnnotationAPI = createApi({
    reducerPath: 'ensemblGeneAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/eagle/api/ensembl/' }),
    endpoints: (builder) => ({
        getGeneReferences: builder.query<any[], string>({
            query: (gene_symbol: string) => `xref?name=${gene_symbol}`,
        }),
        getGeneInformation: builder.query<any, string>({
            query: (ensembl_id: string) => `lookup?id=${ensembl_id}`,
        }),
        getGenePhenotypes: builder.query<any[], string>({
            query: (ensembl_id: string) => `phenotypes?id=${ensembl_id}`,
        }),
    }),
})

export const { useGetGeneReferencesQuery, useGetGeneInformationQuery, useGetGenePhenotypesQuery } = ensemblGeneAnnotationAPI