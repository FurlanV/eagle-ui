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