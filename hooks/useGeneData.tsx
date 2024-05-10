import { useEffect, useState } from "react"

export const useGeneData = (pathname: string) => {
  const [geneInfo, setGeneInfo] = useState(null)
  const [reportsInfo, setReportsInfo] = useState(null)
  const [papers, setPapers] = useState(null)
  const [annotation, setAnnotation] = useState(null)

  useEffect(() => {
    const getGeneData = async () => {
      const split_pathname = pathname.split("/")
      const gene_name = split_pathname[split_pathname.length - 1]
      if (!gene_name) return null

      const res = await fetch(`/api/genes?name=${gene_name}`)
      const json = await res.json()
      return json.data
    }

    const getGeneReportData = async () => {
      const split_pathname = pathname.split("/")
      const gene_name = split_pathname[split_pathname.length - 1]
      if (!gene_name) return null

      const res = await fetch(`/api/report/gene?name=${gene_name}`)
      const json = await res.json()
      return json.data
    }

    const getGenePapers = async () => {
      const split_pathname = pathname.split("/")
      const gene_name = split_pathname[split_pathname.length - 1]
      if (!gene_name) return null

      const res = await fetch(`/api/papers/gene?name=${gene_name}`)
      const json = await res.json()
      return json.data
    }

    const getGeneAnnotation = async () => {
      const split_pathname = pathname.split("/")
      const gene_name = split_pathname[split_pathname.length - 1]
      if (!gene_name) return null

      const res = await fetch(`/api/genes/annotation?name=${gene_name}`)
      const json = await res.json()
      return json.data
    }

    getGeneData().then(setGeneInfo)
    getGeneReportData().then(setReportsInfo)
    getGenePapers().then(setPapers)
    getGeneAnnotation().then(setAnnotation)
  }, [pathname]) // Depend on pathname so that the hook re-runs when pathname changes

  return { geneInfo, reportsInfo, papers, annotation }
}