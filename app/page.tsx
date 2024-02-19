"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableDemo } from "@/components/ui/papers-table"
import { FileUploadArea } from "@/components/file-upload-area"
import { Icons } from "@/components/icons"
import { ScoreChart } from "@/components/score-chart"
import { Sidebar } from "@/components/sidebar"

export default function IndexPage() {
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  return (
    <div className="flex h-full flex-row">
      {/* <Sidebar /> */}
      <div className="flex flex-row flex-1 p-2 gap-2 h-full">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-full gap-2">
            <Card className="flex flex-col border gap-2 flex-1 items-center justify-center gap-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Gene Score
              </h3>
              <h4 className="text-2xl font-semibold leading-none tracking-tight">
                1.2
              </h4>
            </Card>
            <Card className="flex flex-col gap-2 border flex-1 h-full items-center justify-center gap-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Syndromic
              </h3>
              <h4 className="text-2xl font-semibold leading-none tracking-tight">
                No
              </h4>
            </Card>
            <Card className="flex flex-col gap-2 border flex-1 h-full items-center justify-center gap-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Reports
              </h3>
              <h4 className="text-2xl font-semibold leading-none tracking-tight">
                5
              </h4>
            </Card>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full h-40">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Gene</CardTitle>
                <Icons.database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-2xl font-bold">DMD</div>
                <p className="text-sm text-muted-foreground">
                  Dystrophin (Muscular Dystrophy, Duchenne And Becker Types)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-lg">Chromosome</CardTitle>
                <Icons.dna className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-2xl font-bold">X</div>
                <p className="text-sm text-muted-foreground">
                  Orientation: Minus strand
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Position</CardTitle>
                <Icons.database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-2xl font-bold">p31.11</div>
                <p className="text-sm text-muted-foreground">2,241,765 bases</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-4 h-full gap-2">
            <div className="flex flex-col w-full gap-2">
              <Card className="w-full h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-medium">
                    Eagle Score
                  </CardTitle>
                  <Icons.dna className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <h2 className="font-bold text-5xl mb-16">7.5</h2>
                </CardContent>
              </Card>
              <Card className="w-full h-full">
                <CardContent className="flex items-center h-full">
                  <ScoreChart />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3 h-full">
              {showFileUpload ? (
                <FileUploadArea
                  files={files}
                  setFiles={setFiles}
                  maxFileSizeMB={30}
                  maxNumFiles={10}
                  setShowFileUpload={setShowFileUpload}
                />
              ) : (
                <DataTableDemo
                  className="col-span-3 h-full"
                  setShowFileUpload={setShowFileUpload}
                />
              )}
            </div>
          </div>
          {/* <div className="flex flex-1 border h-40"></div> */}
        </div>
      </div>
    </div>
  )
}
