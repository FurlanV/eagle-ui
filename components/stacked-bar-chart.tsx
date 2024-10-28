import React from "react"
import { AxisBottom } from "@visx/axis"
import { localPoint } from "@visx/event"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { LegendOrdinal } from "@visx/legend"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { BarStack } from "@visx/shape"
import { SeriesPoint } from "@visx/shape/lib/types"
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip"
import { max } from "d3-array"

type InheritancePattern = "De novo" | "Inherited" | "Unknown"

type TooltipData = {
  bar: SeriesPoint<AggregationData>
  key: InheritancePattern
  index: number
  height: number
  width: number
  x: number
  y: number
  color: string
}

export type BarStackProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
  data: Array<{
    sex: string
    inheritance: InheritancePattern
  }>
  keys?: InheritancePattern[]
  colors?: string[]
}

const defaultMargin = { top: 40, right: 0, bottom: 60, left: 0 }
const background = "#fff"
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 80,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
}

const defaultKeys: InheritancePattern[] = [
  "De novo",
  "Inherited",
]
const defaultColors: string[] = ["#4caf50", "#ff9800"] // Green for De novo, Orange for Inherited

type AggregationData = {
  sex: string
  [key: string]: number | string
}

export function StackedBarChart({
  width,
  height,
  margin = defaultMargin,
  data,
  keys = defaultKeys,
  colors = defaultColors,
}: BarStackProps) {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  if (width < 10) return null

  // Data Aggregation: Count cases per sex and inheritance pattern
  const aggregatedData: AggregationData[] = Array.from(
    data.reduce((acc, curr) => {
      if (!acc.has(curr.sex)) {
        acc.set(curr.sex, {
          sex: curr.sex.toLowerCase().includes("female")
            ? "Female"
            : curr.sex.toLowerCase().includes("male")
            ? "Male"
            : "Unknown",
        })
        keys.forEach((key) => {
          acc.get(curr.sex)![key] = 0
        })
      }
      acc.get(curr.sex)![curr.inheritance] += 1
      return acc
    }, new Map<string, AggregationData>())
  ).map(([, value]) => value)

  // Accessors
  const getSex = (d: AggregationData) => d.sex

  // Scales
  const xScale = scaleBand<string>({
    domain: aggregatedData.map(getSex),
    padding: 0.2,
  })
  const yScale = scaleLinear<number>({
    domain: [
      0,
      max(aggregatedData, (d) => {
        return keys.reduce((sum, key) => sum + Number(d[key]), 0)
      }) || 0,
    ],
    nice: true,
  })
  const colorScale = scaleOrdinal<InheritancePattern, string>({
    domain: keys,
    range: colors,
  })

  // Set range for scales
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  xScale.rangeRound([0, xMax])
  yScale.range([yMax, 0])

  let tooltipTimeout: number

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          stroke="#e0e0e0"
          strokeOpacity={0.5}
        />
        <Group top={margin.top} left={margin.left}>
          <BarStack<AggregationData, InheritancePattern>
            data={aggregatedData}
            keys={keys}
            x={getSex}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onClick={() => {
                      // Optional: Handle click events
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip()
                      }, 300)
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout)
                      const eventSvgCoords = localPoint(event)
                      const left = bar.x + bar.width / 2
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      })
                    }}
                  />
                ))
              )
            }
          </BarStack>
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={xScale}
          stroke="#333"
          tickStroke="#333"
          tickLabelProps={() => ({
            fill: "#333",
            fontSize: 12,
            textAnchor: "middle",
          })}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: tooltipData.color }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]} Cases</div>
          <div>
            <small>{`Sex: ${tooltipData.bar.data.sex}`}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
