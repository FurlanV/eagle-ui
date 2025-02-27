"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TopVariantsChartProps {
  data: any[]
}

// Custom tooltip component to avoid TypeScript errors
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-medium">{`Variant: ${label}`}</p>
        <p className="text-sm text-muted-foreground">{`Type: ${data.type || 'Unknown'}`}</p>
        <p className="text-sm">{`Genetic Evidence: ${data.genetic || 0}`}</p>
        <p className="text-sm">{`Experimental Evidence: ${data.experimental || 0}`}</p>
        <p className="text-sm">{`Total Score: ${data.total || 0}`}</p>
        <p className="text-sm">{`Cases: ${data.cases || 0}`}</p>
      </div>
    );
  }
  return null;
};

export function TopVariantsChart({ data }: TopVariantsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Variants by Evidence Score</CardTitle>
          <CardDescription>Variants with highest evidence scores and their breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(variant => {
    // Format variant name to be more readable
    let variantName = variant.variant || `Variant ${variant.id}`
    if (variantName.length > 30) {
      variantName = variantName.substring(0, 27) + '...'
    }
    
    return {
      name: variantName,
      type: variant.variant_type || 'Unknown',
      genetic: parseFloat((variant.avg_genetic_score || 0).toFixed(2)),
      experimental: parseFloat((variant.avg_experimental_score || 0).toFixed(2)),
      total: parseFloat((variant.avg_total_score || 0).toFixed(2)),
      cases: variant.case_count
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Variants by Evidence Score</CardTitle>
        <CardDescription>Variants with highest evidence scores and their breakdown</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ left: 120, right: 20, top: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 'dataMax + 1']} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="genetic" 
              fill="hsl(var(--primary))" 
              name="Genetic Evidence"
              radius={[0, 0, 0, 0]}
              barSize={15}
              stackId="a"
            />
            <Bar 
              dataKey="experimental" 
              fill="hsl(var(--secondary))" 
              name="Experimental Evidence"
              radius={[0, 0, 0, 0]}
              barSize={15}
              stackId="a"
            />
            <Bar 
              dataKey="cases" 
              fill="hsl(var(--accent))" 
              name="Case Count"
              radius={[0, 4, 4, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 