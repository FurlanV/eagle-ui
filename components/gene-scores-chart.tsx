"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  gene: {
    label: "gene",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GeneScoresChart({ chartData }: any) {

  const parsedChartData = [...chartData]
    .sort((a: any, b: any) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return dateB.getTime() - dateA.getTime()
    })
    .map((data: any) => {
      return {
        gene: data.reported_case_id,
        score: data.final_score,
      }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eagle Scores</CardTitle>
        <CardDescription>
          Score Mean:{" "}
          {parsedChartData.length > 0
            ? (
                parsedChartData.reduce(
                  (sum, item) => sum + (item.score || 0),
                  0
                ) / parsedChartData.length
              ).toFixed(2)
            : "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[485px]">
          <BarChart accessibilityLayer data={parsedChartData} layout="vertical">
            <XAxis type="number" dataKey="score" hide />
            <YAxis
              dataKey="gene"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="score" fill="var(--color-gene)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing Top 10 Genes <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
