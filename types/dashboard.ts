export interface DashboardCounts {
  genes: number;
  papers: number;
  cases: number;
  variants: number;
}

export interface TopGene {
  id: number;
  name: string;
  case_count: number;
}

export interface TopVariant {
  id: number;
  name: string;
  case_count: number;
}

export interface RecentPaper {
  id: number;
  title: string;
  author: string;
  year: number;
  doi: string;
}

export interface ScoreRange {
  range: string;
  count: number;
}

export interface DashboardStats {
  counts: DashboardCounts;
  top_genes: TopGene[];
  top_variants: TopVariant[];
  recent_papers: RecentPaper[];
  score_distribution: ScoreRange[];
} 