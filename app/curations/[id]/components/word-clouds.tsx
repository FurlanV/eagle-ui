import React, { useState } from "react"
import ParentSize from "@visx/responsive/lib/components/ParentSize"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [selectedCloud, setSelectedCloud] = useState<string>("variants")

  const renderWordCloud = () => {
    switch (selectedCloud) {
      case "variants":
        return words.length > 0 ? (
          <ParentSize>
            {({ width, height }) => (
              <WordCloudGraph
                width={width}
                height={height}
                words={words}
                sizeRange={[20, 40]}
              />
            )}
          </ParentSize>
        ) : (
          <p className="text-muted-foreground">No variants data available.</p>
        )
      case "variantTypes":
        return evidenceTypeWords.length > 0 ? (
          <ParentSize>
            {({ width, height }) => (
              <WordCloudGraph
                width={width}
                height={height}
                words={evidenceTypeWords}
                sizeRange={[20, 40]}
              />
            )}
          </ParentSize>
        ) : (
          <p className="text-muted-foreground">
            No variant types data available.
          </p>
        )
      default:
        return null
    }
  }

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <Card className="h-full">
          <CardHeader>
            <Select onValueChange={setSelectedCloud} value={selectedCloud}>
              <SelectTrigger className="w-[10rem]">
                <SelectValue placeholder="Select Word Cloud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variants">Variants</SelectItem>
                <SelectItem value="variantTypes">Variant Types</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-full max-h-[350px] flex items-center justify-center">
            {renderWordCloud()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
