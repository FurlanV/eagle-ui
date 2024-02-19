"use client"

import {
  Bar,
  BarChart,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  {
    name: "Paper A",
    uv: 4000,
    score: 2,
    amt: 7.5,
  },
  {
    name: "Paper B",
    uv: 3000,
    score: 1.5,
    amt: 7.5,
  },
  {
    name: "Paper C",
    uv: 2000,
    score: 1.5,
    amt: 7.5,
  },
  {
    name: "Paper D",
    uv: 2780,
    score: 1.25,
    amt: 7.5,
  },
  {
    name: "Paper E",
    uv: 1890,
    score: 1,
    amt: 7.5,
  },
]

export function ScoreChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        width={320}
        height={300}
        data={data}
        margin={{
          left: -30,
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#888888" tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="score"
          className="fill-primary"
          radius={[4, 4, 0, 0]}
          fill="currentColor"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
