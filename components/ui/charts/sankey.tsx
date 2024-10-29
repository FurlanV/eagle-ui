import React from "react"
import { Group } from "@visx/group"
import { HierarchyDefaultNode as DefaultNode } from "@visx/hierarchy"
import cx from "classnames"
import { SankeyGraph, sankey as d3Sankey } from "d3-sankey"

interface SankeyProps {
  top?: number
  left?: number
  className?: string
  data: SankeyGraph<any, any>
  size?: [number, number]
  nodeId?: (node: any) => string
  nodeAlign?: (node: any) => number
  nodeWidth?: number
  nodePadding?: number
  nodePaddingRatio?: number
  extent?: [[number, number], [number, number]]
  iterations?: number
  circularLinkGap?: number
  children?: (props: { data: SankeyGraph<any, any> }) => React.ReactNode
  nodeComponent?: typeof DefaultNode
}

export default function Sankey({
  top,
  left,
  className,
  data,
  size,
  nodeId,
  nodeAlign,
  nodeWidth,
  nodePadding,
  nodePaddingRatio,
  extent,
  iterations,
  circularLinkGap,
  children,
  nodeComponent = DefaultNode,
  ...restProps
}: SankeyProps): React.ReactElement | null {
  const sankey = d3Sankey()
  if (size) sankey.size(size)
  if (nodeId) sankey.nodeId(nodeId)
  if (nodeAlign) sankey.nodeAlign(nodeAlign)
  if (nodeWidth) sankey.nodeWidth(nodeWidth)
  if (nodePadding) sankey.nodePadding(nodePadding)
  if (extent) sankey.extent(extent)
  if (iterations) sankey.iterations(iterations)
  if (circularLinkGap) sankey.circularLinkGap(circularLinkGap)

  const sankeyData = sankey(data)

  console.log("sankeyData", sankeyData)

  if (children) {
    return (
      <Group top={top} left={left} className={cx("vx-sankey", className)}>
        {children({ data: sankeyData })}
      </Group>
    )
  }

  return null
}
