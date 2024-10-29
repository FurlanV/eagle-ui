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

export function GeneScoresChart({ data }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eagle Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[765px] w-full">
          <BarChart accessibilityLayer data={data} layout="vertical">
            <XAxis type="number" dataKey="score" hide />
            <YAxis
              dataKey="gene"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
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
