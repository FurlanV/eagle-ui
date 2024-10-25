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