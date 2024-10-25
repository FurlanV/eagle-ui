// gendex-ui/app/curations/[id]/components/ReportMetrics.tsx
import React from "react";
import { Card } from "@/components/ui/card";

interface ReportMetricsProps {
  reportData: any[];
  finalScoreSum: number;
  variants: string[];
  impacts: string[];
}

export const ReportMetrics: React.FC<ReportMetricsProps> = ({
  reportData,
  finalScoreSum,
  variants,
  impacts,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Cases</span>
        <span className="text-3xl font-bold">{reportData.length}</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Final Score</span>
        <span className="text-3xl font-bold">{finalScoreSum}</span>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Variants</span>
        <ul className="list-disc list-inside text-center">
          {variants.map((variant, index) => (
            <li key={index}>{variant}</li>
          ))}
        </ul>
      </Card>
      <Card className="flex flex-col items-center p-4">
        <span className="text-lg font-semibold">Impact</span>
        <ul className="list-disc list-inside text-center">
          {impacts.map((impact, index) => (
            <li key={index}>{impact}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};