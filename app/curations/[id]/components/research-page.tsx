"use client"

import React, { useMemo, useState } from "react"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  DnaIcon,
  FileText,
  Users,
} from "lucide-react"
import { Bar, Doughnut, Pie, Scatter } from "react-chartjs-2"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"
import { FileDetails } from "@/components/file-details"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
)

interface PayloadVariant {
  region: string
  population_frequency: Record<string, any>
  linkage_to_asd: boolean
  variant_id: string
  transcripts: {
    transcripts: string[]
  }
  impact: string
  id: number
  genomic_hgvs: string
  inheritance_pattern: string
  gene_id: number
  cdna_hgvs: string
  segregation_data: string
  genotyping_method: string
  protein_hgvs: string
  sift_score: number
  reference_genome: string
  rsid: string
  polyphen_score: number
  chromosome: string
  variant_type: string
  cadd_score: number
  position: string
  zygosity: string
  other_scores: Record<string, any>
}

interface PayloadData {
  paper_id: number
  expert_clinical_diagnosis: boolean
  cognitive_assessment_results?: string | null
  contains_variant?: boolean | null
  total_case_score: number
  variant_id: number
  multidisciplinary_team?: string | null
  cognitive_ability?: string
  notes?: string | null
  contradictory_evidence?: string | null
  task_id: number
  validated_assessment_methods: boolean
  cognitive_ability_cautionary_comment?: string
  rationale?: string | null
  age?: number | null
  assessment_tools_used?: string
  developmental_milestones?: string | null
  genetic_evidence_score: number
  case_id: string
  sex: string
  explicit_mention_of_dsm_icd?: string | null
  comorbidities?: string | null
  genetic_evidence_score_rationale: string
  id: number
  ethnicity?: string | null
  description_of_core_asd_symptoms?: string | null
  phenotype_quality: string
  experimental_evidence_score: number
  gene_id: number
  family_history: string
  age_at_diagnosis?: number | null
  experimental_evidence_score_rationale: string
  phenotype_score_adjustments: number
  diagnostic_criteria_used: string
  core_asd_symptoms?: string | null
  phenotype_quality_rationale: string
  score_adjustment_rationale?: string | null
  variant: PayloadVariant
}

/**
 * Props for the PayloadVisualization component
 */
interface PayloadVisualizationProps {
  payload?: PayloadData[] | PayloadData
  isLoading?: boolean
  selectedFile?: any
  onBack?: () => void
}

export function PayloadVisualization({
  payload,
  isLoading,
  selectedFile,
  onBack,
}: PayloadVisualizationProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Convert single payload to array if necessary - do this before any hooks
  const casesData = useMemo(() => {
    if (!payload) return []
    return Array.isArray(payload) ? payload : [payload]
  }, [payload])

  const currentCase = casesData[selectedIndex]

  // Move populationFrequencyBarData up here with other hooks
  const populationFrequencyBarData = useMemo(() => {
    if (!currentCase?.variant?.population_frequency) return null
    const popFreqs = currentCase.variant.population_frequency
    const labels = Object.keys(popFreqs)
    const values = labels.map((label) => popFreqs[label])

    return {
      labels,
      datasets: [
        {
          label: "Population Frequency",
          data: values,
          backgroundColor: "#36A2EB",
        },
      ],
    }
  }, [currentCase])

  // Move all useMemo hooks here, before any conditional returns
  const variantTypes = useMemo(() => {
    const types: Record<string, number> = {}
    casesData.forEach((c) => {
      const type = c.variant?.variant_type || "Unknown"
      types[type] = (types[type] || 0) + 1
    })
    return types
  }, [casesData])

  const inheritancePatterns = useMemo(() => {
    const patterns: Record<string, number> = {}
    casesData.forEach((c) => {
      const pattern = c.variant?.inheritance_pattern || "Unknown"
      patterns[pattern] = (patterns[pattern] || 0) + 1
    })
    return patterns
  }, [casesData])

  // Scatter data for correlation between CADD and Polyphen scores
  const caddPolyphenScatterData = useMemo(() => {
    const dataPoints = casesData
      .filter(
        (c) =>
          c.variant?.cadd_score != null && c.variant?.polyphen_score != null
      )
      .map((c) => ({
        x: c.variant.cadd_score,
        y: c.variant.polyphen_score,
      }))

    return {
      datasets: [
        {
          label: "CADD vs Polyphen",
          data: dataPoints,
          backgroundColor: "#4BC0C0",
        },
      ],
    }
  }, [casesData])

  // Now we can have our conditional returns
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    )
  }

  if (!payload || casesData.length === 0) {
    return <div>No payload data available.</div>
  }

  // Chart Data
  const variantTypePieData = {
    labels: Object.keys(variantTypes),
    datasets: [
      {
        data: Object.values(variantTypes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  }

  const inheritancePieData = {
    labels: Object.keys(inheritancePatterns),
    datasets: [
      {
        data: Object.values(inheritancePatterns),
        backgroundColor: [
          "#FF9F40",
          "#4BC0C0",
          "#FF6384",
          "#36A2EB",
          "#9966FF",
        ],
      },
    ],
  }

  const scoresBarData = {
    labels: casesData.map((c) => c.case_id),
    datasets: [
      {
        label: "Genetic Evidence Score",
        data: casesData.map((c) => c.genetic_evidence_score),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Phenotype Adjustment Score",
        data: casesData.map((c) => c.phenotype_score_adjustments),
        backgroundColor: "#FFCE56",
      },
      {
        label: "Experimental Evidence Score",
        data: casesData.map((c) => c.experimental_evidence_score),
        backgroundColor: "#FF6384",
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Cases</p>
                <p className="text-2xl font-bold">{casesData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DnaIcon className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Variant Types
                </p>
                <p className="text-2xl font-bold">
                  {Object.keys(variantTypes).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Average Score
                </p>
                <p className="text-2xl font-bold">
                  {(
                    casesData.reduce((acc, c) => acc + c.total_case_score, 0) /
                    casesData.length
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Papers</p>
                <p className="text-2xl font-bold">
                  {new Set(casesData.map((c) => c.paper_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Navigation */}
      {casesData.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : casesData.length - 1
                  )
                }
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Case
              </Button>
              <span className="font-medium">
                Case {selectedIndex + 1} of {casesData.length}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev < casesData.length - 1 ? prev + 1 : 0
                  )
                }
              >
                Next Case
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Case Details */}
      <Card>
        <CardHeader>
          <CardTitle>Case Information - {currentCase.case_id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Clinical Details</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Sex:</strong> {currentCase.sex}
                </li>
                <li>
                  <strong>Ethnicity:</strong>{" "}
                  {currentCase.ethnicity || "Not specified"}
                </li>
                <li>
                  <strong>Cognitive Ability:</strong>{" "}
                  {currentCase.cognitive_ability}
                </li>
                <li>
                  <strong>Development:</strong>{" "}
                  {currentCase.developmental_milestones}
                </li>
                {currentCase.comorbidities && (
                  <li>
                    <strong>Comorbidities:</strong> {currentCase.comorbidities}
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Variant Details</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Variant ID:</strong>{" "}
                  {currentCase.variant.cdna_hgvs !== "N/A" ||
                  currentCase.variant.protein_hgvs !== "N/A"
                    ? currentCase.variant.cdna_hgvs +
                      "-" +
                      currentCase.variant.protein_hgvs
                    : "No variant extracted"}
                </li>
                <li>
                  <strong>Type:</strong> {currentCase.variant.variant_type}
                </li>
                <li>
                  <strong>Impact:</strong> {currentCase.variant.impact}
                </li>
                <li>
                  <strong>Inheritance:</strong>{" "}
                  {currentCase.variant.inheritance_pattern}
                </li>
                <li>
                  <strong>Zygosity:</strong> {currentCase.variant.zygosity}
                </li>
              </ul>
            </div>
          </div>
          <div className="flex mt-4">
            <Drawer>
              <DrawerTrigger>
                <Button size="sm" variant="outline">
                  Extraction Rationale
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <FileDetails
                  selectedFile={selectedFile}
                  handleRating={() => {}}
                  onBack={onBack}
                  isLoading={isLoading}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Scores & Rationale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                Genetic Evidence Score: {currentCase.genetic_evidence_score}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentCase.genetic_evidence_score_rationale}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                Phenotype Adjustment Score:{" "}
                {currentCase.phenotype_score_adjustments}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentCase.score_adjustment_rationale ??
                  "No Phenotype adjustment needed"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                Experimental Evidence Score:{" "}
                {currentCase.experimental_evidence_score}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentCase.experimental_evidence_score_rationale}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">
                Total Case Score: {currentCase.total_case_score}
              </h3>
              <p className="text-sm text-muted-foreground">
                Phenotype Quality: {currentCase.phenotype_quality} -{" "}
                {currentCase.phenotype_quality_rationale}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Population Frequency Chart for Current Case (if present) */}
      {populationFrequencyBarData && (
        <Card>
          <CardHeader>
            <CardTitle>Population Frequencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar
                data={populationFrequencyBarData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aggregate Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Variant Types Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-[300px]">
              <Pie
                data={variantTypePieData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inheritance Patterns</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-[300px]">
              <Pie
                data={inheritancePieData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Scores by Case</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Bar
              data={scoresBarData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Analysis: Scatter Plot (CADD vs Polyphen) */}
      <Card>
        <CardHeader>
          <CardTitle>CADD vs Polyphen Score</CardTitle>
        </CardHeader>
        <CardContent>
          {caddPolyphenScatterData.datasets[0].data.length > 0 ? (
            <div className="h-[400px]">
              <Scatter
                data={caddPolyphenScatterData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: "CADD Score",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Polyphen Score",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>No CADD and Polyphen data available to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
