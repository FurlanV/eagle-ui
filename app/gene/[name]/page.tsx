"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileUploadArea } from "@/components/file-upload-area"
import { GeneCard } from "@/components/gene-card"
import { Icons } from "@/components/icons"
import { PaperSearch } from "@/components/paper-search"
import { PapersTable } from "@/components/papers-table"
import { DataTableDemo } from "@/components/reports-table"

export default function GenePage() {
  const [papers, setPapers] = useState<any[]>([])
  const [searchedPapers, setSearchedPapers] = useState<any[]>([])
  const [annotation, setAnnotation] = useState<any>({})
  const [geneInfo, setGeneInfo] = useState<any>({})

  const pathname = usePathname()

  const getGeneData = async (): Promise<any> => {
    const split_pathname = pathname.split("/")
    const gene_name = split_pathname[split_pathname.length - 1]
    if (!gene_name) return

    const res = await fetch(`/api/ensembl/xref?name=${gene_name}`)
    const json = await res.json()
    const ensemblId = json.data[0].id

    const gene = await fetch(`/api/ensembl/lookup?id=${ensemblId}`)
    const jsonData = await gene.json()
    const geneInfo = jsonData.data

    const phenotype = await fetch(`/api/ensembl/phenotypes?id=${ensemblId}`)
    const phenotypeData = await phenotype.json()
    geneInfo.phenotypes = phenotypeData.data

    return geneInfo
  }

  const getGeneReportData = async (): Promise<any> => {
    const split_pathname = pathname.split("/")
    const gene_name = split_pathname[split_pathname.length - 1]
    if (!gene_name) return

    const res = await fetch(`/api/report/gene?name=${gene_name}`)
    const json = await res.json()
    return json.data
  }

  const getGenePapers = async (): Promise<any> => {
    const split_pathname = pathname.split("/")
    const gene_name = split_pathname[split_pathname.length - 1]
    if (!gene_name) return

    const res = await fetch(`/api/papers/gene?name=${gene_name}`)
    const json = await res.json()
    return json.data
  }

  const getGeneAnnotation = async (): Promise<any> => {
    const split_pathname = pathname.split("/")
    const gene_name = split_pathname[split_pathname.length - 1]
    if (!gene_name) return

    const res = await fetch(`/api/genes/annotation?name=${gene_name}`)
    const json = await res.json()
    return json.data
  }

  useEffect(() => {
    searchPapers()

    getGeneData().then((data) => {
      setGeneInfo(data)
    })

    getGeneAnnotation().then((data) => {
      setAnnotation(data)
    })
  }, [])

  const searchPapers = async () => {
    const split_pathname = pathname.split("/")
    const gene_name = split_pathname[split_pathname.length - 1]

    const res = await fetch(`/api/papers/search?name=${gene_name}`)
    const json = await res.json()
    const pubmed = json.data.pubmed
    const scholar = json.data.scholar
    const data = [...pubmed, ...scholar]
    setSearchedPapers(data)
    //setShowPaperSearch(true)
  }

  console.log(searchedPapers)

  return (
    <div className="flex h-[calc(100vh-55px)] max-h-full flex-row p-4 gap-2">
      <GeneCard geneInfo={geneInfo} annotation={annotation} />
      <div className="flex flex-col flex-1 gap-2">
        <div className="grid grid-cols-3 gap-2 h-50">
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Eagle Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-center">
                <Label className="text-4xl font-bold">0.0</Label>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reported Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-center">
                <Label className="text-4xl font-bold">0.0</Label>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-center">
                <Label className="text-4xl font-bold">0.0</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full p-1">
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor="airplane-mode">On Queue</Label>
            <Switch id="airplane-mode" />
          </div>
        </Card>
        <div className="flex flex-row gap-2">
          <PapersTable data={searchedPapers} />
          <DataTableDemo data={papers} />
        </div>
      </div>
    </div>
  )
}
