"use client"

import { useEffect, useState } from "react"
import {
  useGetJobInformationQuery,
  useGetUserJobsQuery,
} from "@/services/eagle/jobs"
import { Star } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { EagleJob } from "@/types/eagle-job"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthWrapper } from "@/components/auth-wrapper"
import { JobCollapsible } from "@/components/job-collapsible"
import { ReportCard } from "@/components/report-card"
import { Stepper } from "@/components/stepper"

export default function CurationsPage({ defaultLayout = [10, 50, 15] }) {
  const [selectedPaper, setSelectedPaper] = useState<any>(null)
  const [selectedPhase, setSelectedPhase] = useState<any>(null)
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [ratings, setRatings] = useState({
    consistency: 0,
    relevancy: 0,
    clarity: 0,
  })

  const {
    data = [],
    error,
    isLoading,
  } = useGetUserJobsQuery("", {
    pollingInterval: 15000, //15s
    skipPollingIfUnfocused: true,
  })
  const {
    data: jobData = [],
    error: jobError,
    isLoading: jobIsLoading,
  } = useGetJobInformationQuery(
    {
      job_id: selectedPaper?.job_id,
      paper_id: selectedPaper?.id,
    },
    {
      skip: !selectedPaper,
    }
  )

  useEffect(() => {
    if (selectedPaper && jobData && !selectedPhase) {
      setSelectedPhase(jobData[jobData.length - 1])
    }
  }, [selectedPaper, jobData, selectedPhase])

  return (
    <AuthWrapper>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes
            )}`
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsible={true}
            minSize={20}
            maxSize={28}
            onResize={() => {
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`
            }}
          >
            <div className="flex items-center px-4 py-2 h-[45px]">
              <h1 className="text-xl font-bold">Jobs</h1>
            </div>
            <Separator className="my-2" />
            {!jobIsLoading &&
              data.map((job: EagleJob) => {
                return (
                  <JobCollapsible
                    key={job.id}
                    job={job}
                    selectedPaper={selectedPaper}
                    setSelectedPaper={setSelectedPaper}
                    setSelectedPhase={setSelectedPhase}
                    selectedPhase={selectedPhase}
                    jobData={jobData}
                  />
                )
              })}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={defaultLayout[1]}
            minSize={30}
            className="p-4"
          >
            <div className="grid grid-cols-2 grid-rows-auto gap-2">
              {selectedPhase &&
                selectedPhase.pipeline_run.reports.map(
                  (report: any, index: number) => <ReportCard report={report} />
                )}
            </div>
            <div className="grid grid-cols-2 grid-rows-auto gap-2 w-full"></div>

            {selectedPaper && (
              <div className="flex flex-row gap-2">
                <Card className="hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <Stepper
                        data={jobData}
                        selectedPhase={selectedPhase}
                        setSelectedPhase={setSelectedPhase}
                      />
                      <Separator />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-md shadow-sm">
                      <h1 className="text-2xl font-semibold">
                        {selectedPhase?.name}
                      </h1>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsReviewFormOpen(true)}
                      >
                        Open Review
                      </Button>
                    </div>
                    <div className="p-2">
                      <div className="overflow-scroll h-[calc(100vh-80px)]">
                        <Markdown
                          className="prose markdown"
                          remarkPlugins={[remarkGfm]}
                        >
                          {selectedPhase?.output}
                        </Markdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {isReviewFormOpen && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Review</CardTitle>
                    </CardHeader>
                    <CardContent className="w-[350px]">
                      <form className="space-y-4">
                        <div className="gap-2">
                          <label className="block text-sm font-medium">
                            How good is this analysis (0-10):
                          </label>
                          <Slider
                            max={10}
                            step={1}
                            onChange={(e) =>
                              setRatings((prev) => ({
                                ...prev,
                                score: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Do you think the analysis makes sense?
                          </label>
                          <Textarea
                            onChange={(e) =>
                              setRatings((prev) => ({
                                ...prev,
                                feedback: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            The assigned score is relevant:
                          </label>
                          <Input
                            type="text"
                            value={ratings.score || ""}
                            readOnly
                          />
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </AuthWrapper>
  )
}

interface StarRatingProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function StarRating({ label, value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center">
      <span className="mr-2">{label}:</span>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1
        return (
          <Star
            key={index}
            className={`cursor-pointer ${
              ratingValue <= (hover || value)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          />
        )
      })}
    </div>
  )
}
