export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ReviewCategory {
  rating: Rating;
  comment: string;
}

export interface CurationReview {
  id?: number;
  job_id: string;
  paperAnalysis: ReviewCategory;
  evidenceSummary: ReviewCategory;
  evidenceScore: ReviewCategory;
  created_at?: string;
  updated_at?: string;
}

// Optional: Create a type for the form state
export type CurationReviewFormData = Omit<CurationReview, 'id' | 'created_at' | 'updated_at'>;

// Optional: Create a type for the API response
export type CurationReviewResponse = Required<CurationReview>;