import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Gene } from '@/types/report';
import { Paper } from '@/types/paper';
import { Variant } from '@/types/variant';

export interface EagleReport {
    id: number;
    gene_id?: number;
    paper_id?: number;
    eagle_run_id?: number;
    reported_case_id: string;
    sex: string;
    phenotype: string;
    cognition: string;
    evidence_type: string;
    genotyping_method: string;
    variant: string;
    impact: string;
    gnomad: string;
    inheritance: string;
    variant_notes: string;
    asd: string;
    asd_phenotype_confidence: string;
    cognitive_ability_comment: string;
    initial_score: number;
    phenotype_adjustment_score: number;
    final_score: number;
    score_rationale: string;
    notes: string;
    created_at: Date;
    associated_gene: Gene;
    paper: Paper;
    variants: Variant[];
}

const initialState: EagleReport[] = []

const reportSlice = createSlice({
    name: 'eagleReports',
    initialState,
    reducers: {
        setReports(state, action: PayloadAction<EagleReport[]>) {
            return action.payload
        },
    },
})

export const { setReports } = reportSlice.actions

export default reportSlice.reducer