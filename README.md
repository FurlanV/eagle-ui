## Project Structure

gendex-ui/
├── app/
│   └── curations/
│       └── [id]/
│           ├── components/
│           │   ├── Header.tsx
│           │   ├── OverviewCards.tsx
│           │   ├── Alerts.tsx
│           │   ├── WordClouds.tsx
│           │   ├── InheritancePatternsChart.tsx
│           │   ├── CaseDetailsTable.tsx
│           │   ├── ReportMetrics.tsx
│           │   └── ScoreRationale.tsx
│           ├── hooks/
│           │   └── useCurationData.ts
│           ├── types/
│           │   └── index.ts
│           └── page.tsx
├── components/
│   └── ui/
│       ├── alert/
│       ├── badge/
│       ├── button/
│       └── ... (other UI components)
├── services/
│   └── tasks.ts
├── lib/
│   └── hooks.ts
└── types/
    └── eagle-job.ts