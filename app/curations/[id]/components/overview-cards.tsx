// gendex-ui/app/curations/[id]/components/OverviewCards.tsx
import React from "react"
import { CheckCircle2, FileText, Terminal } from "lucide-react"

import { Card } from "@/components/ui/card"

interface OverviewCardsProps {
  totalFinalScore: number
  totalFiles: number
  totalReports: number
  scoreRelevance: string
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totalFinalScore,
  totalFiles,
  totalReports,
  scoreRelevance,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="flex flex-col items-center p-4">
        <Terminal className="w-8 h-8 mb-2 " />
        <span className="text-2xl font-bold">{totalFinalScore}</span>
        <span className="text-sm text-muted-foreground">EAGLE Score</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <FileText className="w-8 h-8 mb-2 " />
        <span className="text-2xl font-bold">{totalFiles}</span>
        <span className="text-sm text-muted-foreground">Number of Papers</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <FileText className="w-8 h-8 mb-2 " />
        <span className="text-2xl font-bold">{totalReports}</span>
        <span className="text-sm text-muted-foreground">Number of Cases</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <CheckCircle2 className="w-8 h-8 mb-2 " />
        <span className="text-2xl font-bold">{scoreRelevance}</span>
        <span className="text-sm text-muted-foreground">
          ASD Gene Relevance
        </span>
      </Card>
    </div>
  )
}
