"use client"

import { useRef, useState } from "react"
import { Separator } from "@radix-ui/react-separator"

import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploadArea } from "@/components/file-upload-area"

import { Icons } from "./icons"
import { useToast } from "./ui/use-toast"

const MAXFILESIZE = 500 // in MB

export function NewJobDialog() {
  const jobIdRef = useRef<HTMLInputElement>(null)
  const genesOfInterestRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<File[]>([])

  const { toast } = useToast()

  const uploadFiles = async (selectedFiles: File[]) => {
    const formData = new FormData()
    selectedFiles.forEach((file) => {
      if (file.size > MAXFILESIZE * 1024 * 1024) {
        console.error(`File ${file.name} is too large`)
        return
      }

      formData.append("papers", file)
    })
    formData.append("job_id", jobIdRef.current?.value ?? "TEST")
    formData.append(
      "interest_gene",
      genesOfInterestRef.current?.value ?? "DMD, TP53"
    )

    const uploadResponse = await fetch(`/eagle/api/eagle`, {
      method: "POST",
      body: formData,
    })

    toast({
      title: "Job submitted",
      description: "Your job has been submitted for processing",
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Icons.upload className="w-4 h-4 mr-2" />
          New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>New Job</DialogTitle>
          <DialogDescription>
            Launch a new curation job to start reviewing cases
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job ID">Job ID [optional]</Label>
            <Input
              id="job_id"
              placeholder="my-curation"
              ref={jobIdRef}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genes of interes">Genes of interest</Label>
            <Input
              id="username"
              placeholder="BRCA1, TP53, ..."
              ref={genesOfInterestRef}
              className="col-span-3"
            />
          </div>
          <Separator orientation="horizontal" />
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="upload-files">Upload papers</Label>
            <FileUploadArea
              maxNumFiles={50}
              maxFileSizeMB={500}
              files={files}
              setFiles={setFiles}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={() => uploadFiles(files)}>
              Run
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
