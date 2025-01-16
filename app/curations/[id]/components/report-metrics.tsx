// gendex-ui/app/curations/[id]/components/ReportMetrics.tsx
import React from "react"

import { Card } from "@/components/ui/card"

interface ReportMetricsProps {
  reportData: any[]
  finalScoreSum: number
  variants: string[]
  impacts: string[]
}

export const ReportMetrics: React.FC<ReportMetricsProps> = ({
  reportData,
  finalScoreSum,
  variants,
  impacts,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
      <div className="flex flex-col items-center w-full gap-2">
        <Card className="flex flex-col items-center p-4 w-full h-full">
          <span className="text-lg font-semibold mt-4">Final Score</span>
          {finalScoreSum !== null && finalScoreSum !== undefined ? (
            <span className="text-3xl font-bold">{finalScoreSum}</span>
          ) : (
            <span className="text-gray-500">No score available</span>
          )}
        </Card>
        <Card className="flex flex-col items-center p-4 w-full h-full">
          <span className="text-lg font-semibold">Number of Cases</span>
          {reportData && reportData.length > 0 ? (
            <span className="text-3xl font-bold">{reportData.length}</span>
          ) : (
            <span className="text-gray-500">No cases available</span>
          )}
        </Card>
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        <Card className="flex flex-col items-center w-full p-4 h-full">
          <span className="text-lg font-semibold">Variants</span>
          {variants && variants.length > 0 ? (
              <ul className="list-disc list-inside text-center max-h-40 md:max-h-48 overflow-y-auto w-full">
              {variants.map((variant, index) => (
                <li key={index}>{variant.cdna_hgvs}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">No variants available</span>
          )}
        </Card>
        <Card className="flex flex-col items-center w-full p-4 h-full">
          <span className="text-lg font-semibold">Impact</span>
          {impacts && impacts.length > 0 ? (
              <ul className="list-disc list-inside text-center max-h-40 md:max-h-48 lg:max-h-60 overflow-y-auto w-full">
              {impacts.map((impact, index) => (
                <li key={index}>{impact}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">No impacts available</span>
          )}
        </Card>
      </div>
    </div>
  )
}
