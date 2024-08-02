import { useState } from "react"
import { Brain, ChevronDown, ChevronUp, Dna, Star, PersonStanding } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Report {
  id: number
  reported_case_id: string
  gene_id: number
  variant: string
  asd_phenotype_confidence: string
  final_score: number
  asd: string
  cognition: string
  cognitive_ability_comment: string
  created_at: string
  eagle_run_id: number
  evidence_type: string
  genotyping_method: string
  gnomad: string
  impact: string
  inheritance: string
  initial_score: number
  notes: string
  paper_id: number
  phenotype: string
  phenotype_adjustment_score: number
  score_rationale: string
  sex: string
  variant_notes: string
}

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Case ID: {report.reported_case_id}
            </CardTitle>
            <div className="mt-2 flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Gene ID: {report.gene_id}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Score: {report.final_score.toFixed(2)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="items-center pt-4">
        <div className="grid grid-cols-2 gap-6">
          <InfoItem
            icon={<Dna className="h-5 w-5 text-green-500" />}
            label="Variant"
            value={report.variant}
          />
          <InfoItem
            icon={<Brain className="h-5 w-5 text-purple-500" />}
            label="ASD Phenotype Confidence"
            value={
              <Badge
                variant={
                  report.asd_phenotype_confidence.toLowerCase() === "low"
                    ? "destructive"
                    : "default"
                }
                className="mt-1"
              >
                {report.asd_phenotype_confidence}
              </Badge>
            }
          />
          <InfoItem
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            label="Evidence Type"
            value={report.evidence_type}
          />
          <InfoItem
            icon={<PersonStanding className="h-5 w-5 text-yellow-500" />}
            label="Inheritance"
            value={report.inheritance}
          />
        </div>

        {isExpanded && (
          <div className="mt-6 border-t pt-4">
            <h3 className="mb-2 font-semibold">
              Score Rationale:
            </h3>
            <p className="text-sm">{report.score_rationale}</p>
            <div className="mt-4 grid grid-cols-2 gap-6">
              <InfoItem
                labelTop
                smText
                label="Cognition"
                value={report.cognition}
              />
              <InfoItem
                labelTop
                smText
                label="Cognitive Ability Comment"
                value={report.cognitive_ability_comment}
              />
              <InfoItem smText label="Inheritance" value={report.inheritance} />
              {/* ... other fields ... */}
              <InfoItem smText labelTop label="Variant Impact" value={report.impact} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon,
  label,
  value,
  labelTop,
  smText,
}: {
  icon?: React.ReactNode
  label: string
  value: React.ReactNode
  labelTop?: boolean
  smText?: boolean
}) {
  return (
    <div className="flex items-start space-x-3">
      {icon && <div className="mt-1">{icon}</div>}
      <div className={cn("flex flex-row gap-2", labelTop && "flex-col")}>
        <p className={cn("font-semibold text-md", smText && "text-sm")}>{label}:</p>
        <p className={cn("text-md", smText && "text-sm")}>{value}</p>
      </div>
    </div>
  )
}
