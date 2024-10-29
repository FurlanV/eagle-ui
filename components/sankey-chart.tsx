import React, { useState, useMemo } from "react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { scaleOrdinal } from "@visx/scale";
import { linkHorizontal } from "d3-shape";
import Sankey from "./ui/charts/sankey";

interface SankeyNode {
  name: string;
  index?: number;
  depth?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  sourceLinks?: SankeyLink[];
  targetLinks?: SankeyLink[];
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  width?: number;
  index?: number;
  y0?: number;
  y1?: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface SankeyChartProps {
  data: SankeyData;
  width: number;
  height: number;
  margin?: Margin;
}

const path = linkHorizontal()
  .source((d) => [d.source.x1, d.y0])
  .target((d) => [d.target.x0, d.y1]);

const getChartColors = () => [
  `hsl(var(--chart-1))`,
  `hsl(var(--chart-2))`,
  `hsl(var(--chart-3))`,
  `hsl(var(--chart-4))`,
  `hsl(var(--chart-5))`,
];

export const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  width,
  height,
  margin = { top: 20, left: 20, right: 320, bottom: 80 }
}) => {
  const [highlightLinkIndexes, setHighlightLinkIndexes] = useState<number[]>([]);
  const [nodePadding] = useState<number>(15);

  const color = useMemo(() => 
    scaleOrdinal({
      domain: data.nodes.map(n => n.name),
      range: getChartColors(),
    }), [data.nodes]);

  if (width < 10 || !data.nodes.length) return null;

  const sankeyData = {
    nodes: data.nodes.map((node, i) => ({
      ...node,
      index: i,
    })),
    links: data.links.map(link => ({
      ...link,
      width: link.value,
    }))
  };

  return (
    <svg width={width} height={height}>
      <Sankey
        top={margin.top}
        left={margin.left}
        data={sankeyData}
        size={[
          width - margin.left - margin.right,
          height - margin.top - margin.bottom
        ]}
        nodeWidth={20}
        nodePadding={nodePadding}
        extent={[
          [1, 1],
          [width - margin.right, height - margin.bottom - 6]
        ]}
      >
        {({ data }: { data: SankeyData }) => (
          <Group>
            {data.nodes.map((node, i) => (
              <Group 
                top={node.y0} 
                left={node.x0} 
                key={`node-${i}`}
                className="cursor-pointer"
              >
                <rect
                  id={`rect-${i}`}
                  width={node.x1! - node.x0!}
                  height={node.y1! - node.y0!}
                  fill={color(node.name)}
                  opacity={0.8}
                  stroke="#fff"
                  strokeWidth={1}
                  onMouseOver={() => {
                    setHighlightLinkIndexes([
                      ...node.sourceLinks!.map((l) => l.index!),
                      ...node.targetLinks!.map((l) => l.index!)
                    ]);
                  }}
                  onMouseOut={() => setHighlightLinkIndexes([])}
                />

                <Text
                  x={node.x1! - node.x0! + 6}
                  y={(node.y1! - node.y0!) / 2}
                  verticalAnchor="middle"
                  style={{
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                    fill: "currentColor",
                    opacity: 0.8
                  }}
                >
                  {node.name}
                </Text>
              </Group>
            ))}

            <Group>
              {data.links.map((link, i) => (
                <path
                  key={`link-${i}`}
                  d={path(link as any) ?? undefined}
                  stroke={highlightLinkIndexes.includes(i) ? "#ff6b6b" : "#888"}
                  strokeWidth={Math.max(1, link.width!)}
                  strokeOpacity={highlightLinkIndexes.includes(i) ? 0.5 : 0.2}
                  fill="none"
                  onMouseOver={() => setHighlightLinkIndexes([i])}
                  onMouseOut={() => setHighlightLinkIndexes([])}
                />
              ))}
            </Group>
          </Group>
        )}
      </Sankey>
    </svg>
  );
};
