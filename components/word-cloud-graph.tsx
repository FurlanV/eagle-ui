import React, { useState } from "react"
import { scaleLog } from "@visx/scale"
import { Text } from "@visx/text"
import Wordcloud from "@visx/wordcloud/lib/Wordcloud"

interface ExampleProps {
  width: number
  height: number
  showControls?: boolean
  words: WordData[]
  sizeRange?: [number, number]
}

export interface WordData {
  text: string
  value: number
}

function getThemeColors() {
  return [
    `hsl(var(--chart-1))`,
    `hsl(var(--chart-2))`,
    `hsl(var(--chart-3))`,
    `hsl(var(--chart-4))`,
    `hsl(var(--chart-5))`,
  ]
}

function getRotationDegree() {
  const rand = Math.random()
  const degree = rand > 0.5 ? 60 : -60
  return rand * degree
}

const fixedValueGenerator = () => 0.5

type SpiralType = "archimedean" | "rectangular"

export function WordCloudGraph({
  width,
  height,
  showControls,
  words,
  sizeRange,
}: ExampleProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean")
  const [withRotation, setWithRotation] = useState(false)

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: sizeRange || [10, 60],
  })

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value)

  const colors = getThemeColors()

  return (
    <div className="wordcloud">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={2}
        spiral={spiralType}
        rotate={withRotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      {showControls && (
        <div>
          <label>
            Spiral type &nbsp;
            <select
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
              value={spiralType}
            >
              <option key={"archimedean"} value={"archimedean"}>
                archimedean
              </option>
              <option key={"rectangular"} value={"rectangular"}>
                rectangular
              </option>
            </select>
          </label>
          <label>
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          <br />
        </div>
      )}
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  )
}
