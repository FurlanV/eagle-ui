"use client"

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react"
import { compact } from "lodash"

import { FileUploadItem } from "./file-upload-item"
import { Button } from "./ui/button"

type FileUploadAreaProps = {
  setFiles: Dispatch<SetStateAction<any[]>>
  maxNumFiles: number
  maxFileSizeMB: number
  files: any[]
  setShowFileUpload: (open: boolean) => void
}

export function FileUploadArea({
  setFiles,
  maxNumFiles,
  maxFileSizeMB,
  files,
  setShowFileUpload,
}: FileUploadAreaProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const dropzoneRef = useRef<HTMLLabelElement>(null)

  const handleFileChange = useCallback(
    async (selectedFiles: FileList | null) => {
        if (selectedFiles && selectedFiles.length > 0) {
          setError("")

          if (files.length + selectedFiles.length > maxNumFiles) {
            setError(`You can only upload up to ${maxNumFiles} files.`)
            if (dropzoneRef.current) {
              ;(dropzoneRef.current as any).value = ""
            }
            return
          }

          setLoading(true)

          const uploadedFiles = await Promise.all(
            Array.from(selectedFiles).map(async (file) => {
              // Check the file type
              if (file.size < maxFileSizeMB * 1024 * 1024) {
                // Check if the file name already exists in the files state
                if (files.find((f) => f.name === file.name)) {
                  return null // Skip this file
                }

                const formData = new FormData()
                formData.append("file", file)

                const uploadResponse = await fetch(`/api/papers`, {
                  method: "POST",
                  body: formData,
                })

                try {
                  if (uploadResponse.status === 200) {
                    const fileObject = {
                      name: file.name,
                    }
                    return fileObject
                  } else {
                    console.log("Error processing file")
                    return null
                  }
                } catch (err: any) {
                  console.log(`error processing file: ${err}`)
                  return null
                }
              }
            })
          )

          // Filter out any null values from the uploadedFiles array
          const validFiles = compact(uploadedFiles)

          // Set the files state with the valid files and the existing files
          setFiles((prevFiles) => [...prevFiles, ...validFiles])

          setLoading(false)
        }
    },

    [files, setFiles, maxFileSizeMB, maxNumFiles]
  )

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setDragOver(false)
      const droppedFiles = event.dataTransfer.files
      handleFileChange(droppedFiles)
    },
    [handleFileChange]
  )

  return (
    <div className="flex items-center justify-center w-full flex-col h-full gap-2">
      <div className="flex items-center justify-center w-full flex-col border-4 border-dotted rounded-md h-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center cursor-pointer relative`}
          ref={dropzoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <div className="flex flex-col rounded shadow-md w-60 sm:w-80 animate-pulse">
                <div className="flex-1 px-4 py-8 space-y-4 sm:p-8 dark:bg-gray-900">
                  <div className="w-full h-6 rounded dark:bg-gray-700"></div>
                  <div className="w-full h-6 rounded dark:bg-gray-700"></div>
                  <div className="w-3/4 h-6 rounded dark:bg-gray-700"></div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>

                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs">max {maxFileSizeMB}MB per file</p>
                <p className="text-xs mt-1">
                  You can upload up to {maxNumFiles - files.length} more{" "}
                  {maxNumFiles - files.length === 1 ? "file" : "files"}
                </p>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(event) => handleFileChange(event.target.files)}
                />
              </div>
            )}
          </div>
        </label>

        {error && (
          <div className="flex items-center justify-center w-full mt-4">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>
      <div className="grid grid-rows-2 w-full h-30 2 gap-2">
        {files.length > 0 ? (
          files.map((file, index) => (
            <FileUploadItem key={index} fileName={file.name} progress={100} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No files selected for upload
            </p>
          </div>
        )}
        <div className="mt-2 place-self-end">
          <Button
            variant="outline"
            className="w-[150px] self-end mr-2"
            disabled={files.length === 0}
          >
            Upload
          </Button>
          <Button
            variant="destructive"
            className="w-[150px] self-end justiy-self-end"
            onClick={() => {
              setFiles([])
              setShowFileUpload(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
