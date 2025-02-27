// gendex-ui/app/curations/[id]/types/index.ts
import { Task } from "@/types/eagle-job";

export interface InsightMetrics {
  totalReports: number;
  averageScore: number;
}

export interface WordCount {
  text: string;
  value: number;
}

export interface ReportData {
  reported_case_id: string;
  sex: string;
  inheritance: string;
  final_score: number;
  phenotype: string;
  variant_notes?: string;
  cognitive_ability_comment?: string;
  notes?: string;
  score_rationale?: string;
}

export interface Variant {
  id: number;
  variant: string;
  chromosome: string;
  position: string;
  variant_type: string;
  zygosity: string;
  rsid: string;
  inheritance_pattern?: string;
  linkage_to_asd?: boolean;
  sift_score?: number;
  polyphen_score?: number;
  cadd_score?: number;
}

export interface Paper {
  id: number;
  title: string;
  year: number;
  first_author: string;
  associated_disorders: string;
  asd_relevance_summary: string;
  variants: Variant[];
}

export interface GeneData {
  papers: Paper[];
  variants: Variant[];
}