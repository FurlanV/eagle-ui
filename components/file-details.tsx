import { useState } from "react"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Star } from "lucide-react"
import ReactMarkdown from "react-markdown"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface FileDetailsProps {
  selectedFile: any | null
  tasks: any[]
  handleRating: (stepIndex: number, rating: number) => void
  onBack: () => void
  isLoading: boolean
}

export function FileDetails({
  selectedFile,
  tasks,
  handleRating,
  onBack,
  isLoading,
}: FileDetailsProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const getStepStatus = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
          text: "Completed",
        }
      case "running":
        return {
          icon: <Clock className="w-4 h-4 text-yellow-500 animate-spin" />,
          text: "In Progress",
        }
      case "failed":
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          text: "Error",
        }
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-500" />,
          text: "Pending",
        }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          File: {selectedFile?.task_name}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Files
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        ) : selectedFile && selectedFile.steps ? (
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <Accordion
              type="single"
              collapsible
              value={expandedStep !== null ? `step-${expandedStep}` : undefined}
              onValueChange={(value) =>
                setExpandedStep(value ? parseInt(value.split("-")[1]) : null)
              }
              className="space-y-2"
            >
              {selectedFile.steps.map((step, index) => {
                const { icon, text } = getStepStatus(step.status)
                return (
                  <AccordionItem
                    value={`step-${index}`}
                    key={index}
                    className="border rounded-md bg-white/5"
                  >
                    <AccordionTrigger className="px-4 py-2 hover:bg-white/10">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{step.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {icon}
                            <span className="ml-1">{text}</span>
                          </Badge>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                className={`h-4 w-4 cursor-pointer ${
                                  rating <= (step.rating || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRating(index, rating)
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      {step.output ? (
                        <ReactMarkdown className="markdown prose prose-sm max-w-none dark:prose-invert">
                          {step.output}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">
                          No output available for this step
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">
            No details available for this file
          </p>
        )}
      </CardContent>
    </Card>
  )
}
