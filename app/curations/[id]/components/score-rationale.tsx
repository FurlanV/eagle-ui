import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreRationaleProps {
  scoreRationale?: string
}

export const ScoreRationale: React.FC<any> = ({ scoreRationale }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Score Rationale</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {(scoreRationale &&
            scoreRationale.map(
              (caseItem: any) =>
                `Genetic Evidence: ${caseItem.genetic_evidence_score_rationale}\n\n
               Experimental Evidence Score: ${caseItem.experimental_evidence_score_rationale}\n\n
               Score Adjustment Rationale: ${caseItem.score_adjustment_rationale}`
            )) ||
            ""}
        </p>
      </CardContent>
    </Card>
  )
}
