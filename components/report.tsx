import React from "react"

interface ReportProps {
  reportData: ReportItem[]
}

interface ReportItem {
  genotyping_method: string
  cognitive_ability_comment: string
  variant: string
  initial_score: number
  task_id: number
  impact: string
  phenotype_adjustment_score: number
  reported_case_id: string
  gnomad: string
  final_score: number
  sex: string
  inheritance: string
  score_rationale: string
  gene_id: number
  phenotype: string
  variant_notes: string
  notes: string
  id: number
  cognition: string
  asd: string
  created_at: string
  paper_id: number
  evidence_type: string
  asd_phenotype_confidence: string
}

export function Report({ reportData }: ReportProps) {
  if (!reportData || reportData.length === 0) {
    return <p className="text-muted-foreground">No report data available.</p>
  }

  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Analysis Report</h2>
      {reportData.map((item) => (
        <div key={item.id} className="mb-6 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2">Report ID: {item.id}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Genotyping Method:</strong> {item.genotyping_method}</p>
            <p><strong>Variant:</strong> {item.variant}</p>
            <p><strong>Impact:</strong> {item.impact}</p>
            <p><strong>Final Score:</strong> {item.final_score}</p>
            <p><strong>Cognition:</strong> {item.cognition}</p>
            <p><strong>ASD:</strong> {item.asd}</p>
            <p><strong>Phenotype:</strong> {item.phenotype}</p>
            <p><strong>Inheritance:</strong> {item.inheritance}</p>
            <p><strong>Evidence Type:</strong> {item.evidence_type}</p>
            <p><strong>ASD Phenotype Confidence:</strong> {item.asd_phenotype_confidence}</p>
          </div>
          <div className="mt-2">
            <p><strong>Score Rationale:</strong></p>
            <p className="text-muted-foreground">{item.score_rationale}</p>
          </div>
          {/* Additional fields can be added here */}
        </div>
      ))}
    </div>
  )
}