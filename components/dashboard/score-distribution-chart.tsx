"use client"

import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ScoreDistributionChartProps {
  data: any[]
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Score Distribution</CardTitle>
          <CardDescription>Distribution of cases by score range</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    name: item.range,
    value: item.count
  }))

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Score Distribution</CardTitle>
        <CardDescription>Distribution of cases by score range</CardDescription>
      </CardHeader>
      <CardContent className="h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} cases`, 'Count']}
              labelFormatter={(label) => `Score Range: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 