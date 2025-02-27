import React from "react"
import ParentSize from "@visx/responsive/lib/components/ParentSize"

import { Task } from "@/types/eagle-job"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { StackedBarChart } from "@/components/stacked-bar-chart"

interface InheritancePatternsChartProps {
  childrenData: Task[] | undefined
  isLoading: boolean
}

export const InheritancePatternsChart: React.FC<
  InheritancePatternsChartProps
> = ({ childrenData, isLoading }) => {
  const chartData =
    childrenData?.flatMap(
      (task) =>
        task.reports?.map((report: any) => ({
          inheritance: report.inheritance.toLowerCase().includes("de novo")
            ? "De novo"
            : report.inheritance.toLowerCase().includes("inherited")
            ? "Inherited"
            : "Unknown",
          sex: report.sex,
        })) || []
    ) || []

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Inheritance Patterns by Sex</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <ParentSize>
            {({ width, height }) => (
              <StackedBarChart width={width} height={height} data={chartData} />
            )}
          </ParentSize>
        )}
      </CardContent>
    </Card>
  )
}
