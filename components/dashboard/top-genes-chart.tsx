"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TopGenesChartProps {
  data: any[]
}

export function TopGenesChart({ data }: TopGenesChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Genes by Case Count</CardTitle>
          <CardDescription>Genes with the most associated cases</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(gene => ({
    name: gene.symbol,
    value: gene.case_count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Genes by Case Count</CardTitle>
        <CardDescription>Genes with the most associated cases</CardDescription>
      </CardHeader>
      <CardContent className="h-[390px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 70 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip 
              formatter={(value) => [`${value} cases`, 'Count']}
              labelFormatter={(label) => `Gene: ${label}`}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 