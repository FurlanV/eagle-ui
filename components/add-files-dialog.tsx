"use client"

import { useCallback, useRef, useState } from "react"
import { Separator } from "@radix-ui/react-separator"
import axios from "axios"
import Cookies from "js-cookie"

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
import { Progress } from "@/components/ui/progress"
import { FileUploadArea } from "@/components/file-upload-area"

import { Icons } from "./icons"
import { useToast } from "./ui/use-toast"

const MAXFILESIZE = 500 // in MB

export function AddFilesDialog({ parent_task_id }: any) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const { toast } = useToast()

  const uploadFiles = useCallback(
    async (selectedFiles: File[]) => {
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      selectedFiles.forEach((file) => {
        if (file.size > MAXFILESIZE * 1024 * 1024) {
          console.error(`File ${file.name} is too large`)
          return
        }
        formData.append("papers", file)
      })
      formData.append("job_id", parent_task_id)
      formData.append("parent_task_id", parent_task_id)
      formData.append("interest_gene", parent_task_id)

      const authToken = Cookies.get("AUTH_TOKEN")
      const token = Buffer.from(authToken, "base64").toString("ascii")
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/eagle/new-job`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
              )
              setUploadProgress(percentCompleted)
            },
          }
        )

        toast({
          title: "Files submitted",
          description: "Your files have been submitted for processing",
        })
      } catch (error) {
        console.error("Upload failed:", error)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your files",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [toast]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add Files</DialogTitle>
          <DialogDescription>Add files to the curation</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col w-full gap-4">
            <Label htmlFor="upload-files">Upload papers</Label>
            <FileUploadArea
              maxNumFiles={50}
              maxFileSizeMB={500}
              files={files}
              setFiles={setFiles}
            />
          </div>
          {isUploading && (
            <div className="flex flex-col gap-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
              <span className="text-sm text-gray-500 text-right">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => uploadFiles(files)}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUploading}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
