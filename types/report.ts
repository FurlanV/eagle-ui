export interface Report {
    id: number;
    gene_id: number | null;
    paper_id: number | null;
    eagle_run_id: number | null;
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
}