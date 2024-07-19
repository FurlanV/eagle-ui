"use client"

import { useGetJobPapersQuery } from "@/services/eagle/jobs"
import { Separator } from "@radix-ui/react-separator"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CurationReviewDialog({ job_id, job_name, job_status }: any) {
  const { data, error, isLoading } = useGetJobPapersQuery(job_id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card key={job_id}>
          <CardHeader>
            <h3 className="text-sm font-bold">{job_name}</h3>
            <p className="text-sm text-muted-foreground">{job_status}</p>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[calc(100vw-100px)] sm:max-h-[780px] m-4">
        <DialogHeader>
          <DialogTitle>{job_name}</DialogTitle>
          <DialogDescription>{job_status}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-row  w-full">
            <div className="flex flex-col w-[480px] gap-2 overflow-scroll h-72">
              {data &&
                data.map((paper: any) => (
                  <div
                    key={paper.id}
                    className="flex items-center justify-between space-x-4 px-4"
                  >
                    <div
                      className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm cursor-pointer w-full text-center"
                      onClick={() => {}}
                    >
                      {paper.title}
                    </div>
                  </div>
                ))}
            </div>
            <Separator orientation="vertical" asChild />
            <div className="rounded-md border overflow-scroll w-full h-[620px]">
              <Markdown
                className="flex flex-col overflow-scroll p-4 markdown"
                remarkPlugins={[remarkGfm]}
              >
                {/* {selectedOutput?.output} */}
              </Markdown>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
