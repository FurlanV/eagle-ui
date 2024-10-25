// gendex-ui/app/curations/[id]/components/WordClouds.tsx
import React from "react"
import ParentSize from "@visx/responsive/lib/components/ParentSize"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { WordCloudGraph } from "@/components/word-cloud-graph"

import { WordCount } from "../types"

interface WordCloudsProps {
  words: WordCount[]
  evidenceTypeWords: WordCount[]
  isLoading: boolean
}

export const WordClouds: React.FC<WordCloudsProps> = ({
  words,
  evidenceTypeWords,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          {isLoading ? (
            <Spinner size="lg" />
          ) : words.length > 0 ? (
            <ParentSize>
              {({ width, height }) => (
                <WordCloudGraph
                  width={width}
                  height={height}
                  words={words}
                  sizeRange={[15, 30]}
                />
              )}
            </ParentSize>
          ) : (
            <p className="text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Variant Types</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          {isLoading ? (
            <Spinner size="lg" />
          ) : evidenceTypeWords.length > 0 ? (
            <ParentSize>
              {({ width, height }) => (
                <WordCloudGraph
                  width={width}
                  height={height}
                  words={evidenceTypeWords}
                  sizeRange={[15, 30]}
                />
              )}
            </ParentSize>
          ) : (
            <p className="text-muted-foreground">No data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
