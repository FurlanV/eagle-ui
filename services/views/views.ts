import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CaseOverview {
    case_id: string;
    age: string;
    sex: string;
    age_at_diagnosis: string;
    diagnostic_criteria_used: string;
    core_asd_symptoms: string;
    genetic_evidence_score: number;
    experimental_evidence_score: number;
    total_case_score: number;
    variant: string | null;
    variant_type: string | null;
    impact: string | null;
    paper_titles: string[];
    paper_years: number[];
    paper_dois: string[];
}

export interface VariantAnalysis {
    variant: string;
    variant_type: string;
    genomic_hgvs: string;
    protein_hgvs: string;
    impact: string;
    sift_score: number;
    polyphen_score: number;
    cadd_score: number;
    population_frequency: any;
    inheritance_pattern: string;
    total_cases: number;
    supporting_papers: number;
    has_contradictory_evidence: boolean;
}

export interface ResearchSummary {
    title: string;
    first_author: string;
    year: number;
    doi: string;
    pmid: string;
    autism_report: boolean;
    asd_relevance_summary: string;
    associated_disorders: string;
    cited_variants: Array<{
        variant_id: string;
        impact: string;
    }>;
    cases: Array<{
        case_id: string;
        phenotype_quality: string;
        total_score: number;
    }>;
}

export interface EvidenceStrength {
    variant_id: string;
    literature_evidence: Array<{
        publication: string;
        findings: string;
    }>;
    database_evidence: Array<{
        database: string;
        classification: string;
        evidence_strength: string;
    }>;
    conflicting_data: Array<{
        report: string;
        reconciliation: string;
    }>;
}

export const viewsAPI = createApi({
    reducerPath: 'viewsAPI',
    baseQuery: fetchBaseQuery({ baseUrl: '/eagle/api/views/' }),
    endpoints: (builder) => ({
        getCaseOverview: builder.query<CaseOverview, string>({
            query: () => `case-overview/`,
        }),
        getVariantAnalysis: builder.query<VariantAnalysis, string>({
            query: () => `variant-analysis/`,
        }),
        getResearchSummary: builder.query<ResearchSummary, number>({
            query: () => `research-summary/`,
        }),
        getEvidenceStrength: builder.query<EvidenceStrength, string>({
            query: () => `evidence-strength/`,
        }),
    }),
})

export const {
    useGetCaseOverviewQuery,
    useGetVariantAnalysisQuery,
    useGetResearchSummaryQuery,
    useGetEvidenceStrengthQuery,
} = viewsAPI 