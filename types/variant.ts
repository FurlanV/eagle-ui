enum VariantType {
    SNP = "Single Nucleotide Polymorphism",
    INDEL = "Insertion/Deletion",
    CNV = "Copy Number Variation",
    SV = "Structural Variant",
    OTHER = "Other",
  }
  
  enum ClinicalSignificance {
    BENIGN = "Benign",
    LIKELY_BENIGN = "Likely Benign",
    UNCERTAIN = "Uncertain Significance",
    LIKELY_PATHOGENIC = "Likely Pathogenic",
    PATHOGENIC = "Pathogenic",
  }
  
  export interface Variant {
    id: number;
    variant_id: string;
    gene_id: number;
    position?: string;
    reference_allele?: string;
    alternate_allele?: string;
    variant_type: string;
    zygosity?: string;
    allele_frequency?: number;
    clinical_significance?: ClinicalSignificance;
    phenotype_association?: string;
    functional_impact?: string;
    protein_change?: string;
    genome_assembly?: string;
  }

  interface PayloadVariant {
    region: string
    population_frequency: Record<string, any>
    linkage_to_asd: boolean
    variant_id: string
    transcripts: {
      transcripts: string[]
    }
    impact: string
    id: number
    genomic_hgvs: string
    inheritance_pattern: string
    gene_id: number
    cdna_hgvs: string
    segregation_data: string
    genotyping_method: string
    protein_hgvs: string
    sift_score: number
    reference_genome: string
    rsid: string
    polyphen_score: number
    chromosome: string
    variant_type: string
    cadd_score: number
    position: string
    zygosity: string
    other_scores: Record<string, any>
  }
  
  interface PayloadData {
    paper_id: number
    expert_clinical_diagnosis: boolean
    cognitive_assessment_results?: string | null
    contains_variant?: boolean | null
    total_case_score: number
    variant_id: number
    multidisciplinary_team?: string | null
    cognitive_ability?: string
    notes?: string | null
    contradictory_evidence?: string | null
    task_id: number
    validated_assessment_methods: boolean
    cognitive_ability_cautionary_comment?: string
    rationale?: string | null
    age?: number | null
    assessment_tools_used?: string
    developmental_milestones?: string | null
    genetic_evidence_score: number
    case_id: string
    sex: string
    explicit_mention_of_dsm_icd?: string | null
    comorbidities?: string | null
    genetic_evidence_score_rationale: string
    id: number
    ethnicity?: string | null
    description_of_core_asd_symptoms?: string | null
    phenotype_quality: string
    experimental_evidence_score: number
    gene_id: number
    family_history: string
    age_at_diagnosis?: number | null
    experimental_evidence_score_rationale: string
    phenotype_score_adjustments: number
    diagnostic_criteria_used: string
    core_asd_symptoms?: string | null
    phenotype_quality_rationale: string
    score_adjustment_rationale?: string | null
    variant: PayloadVariant
  }
  