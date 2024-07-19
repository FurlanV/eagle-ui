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
const chartData = [
  { gene: "SHANK3", score: 71 },
  { gene: "DMD", score: 30 },
]

const chartConfig = {
  gene: {
    label: "gene",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GeneScoresChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eagle Scores</CardTitle>
        <CardDescription>Computed Gene Scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
          >
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
