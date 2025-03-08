export interface CaseData {
  id: number
  case_id: string
  sex: string | null
  age: string | null
  phenotypes: string
  notes: string | null
  description: string
  total_case_score: number
  genetic_evidence_score_rationale: string | null
  score_adjustment_rationale: string | null
  experimental_evidence_score_rationale: string | null
  likes_count: number
  dislikes_count: number
}

export interface FeedbackState {
  likedCases: Record<number, boolean>
  dislikedCases: Record<number, boolean>
  flaggedCases: Record<number, boolean>
  flaggedForRescoring: Record<number, boolean>
  likeComments: Record<number, string>
  dislikeComments: Record<number, string>
  flagComments: Record<number, string>
  activeCommentType: Record<number, string | null>
  tempComment: string
  activeFlagModal: {
    id: number | null
    type: string | null
  }
}

export interface FeedbackHandlers {
  handleLike: (id: number, comment?: string) => void
  handleDislike: (id: number, comment?: string) => void
  flagCase: (id: number, flagType: string, comment?: string) => void
  setActiveCommentType: React.Dispatch<React.SetStateAction<Record<number, string | null>>>
  setTempComment: React.Dispatch<React.SetStateAction<string>>
  setActiveFlagModal: React.Dispatch<React.SetStateAction<{
    id: number | null
    type: string | null
  }>>
} 