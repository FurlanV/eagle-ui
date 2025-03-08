import React from 'react'
import { TableCell, TableRow } from "@/components/ui/table"
import { CaseData } from './types'

interface ExpandedRowProps {
  data: CaseData
}

export const ExpandedRow: React.FC<ExpandedRowProps> = ({ data }) => {
  return (
    <TableRow>
      <TableCell
        colSpan={7}
        className="p-4 bg-gray-50 border-t border-gray-200"
      >
        <div className="space-y-4">
          {data.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Case Description
              </h4>
              <p className="text-sm text-gray-700">{data.description}</p>
            </div>
          )}

          {data.phenotypes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Phenotypes</h4>
              <p className="text-sm text-gray-700">{data.phenotypes}</p>
            </div>
          )}

          {data.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
              <p className="text-sm text-gray-700">{data.notes}</p>
            </div>
          )}

          {data.genetic_evidence_score_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Genetic Evidence Score Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.genetic_evidence_score_rationale}
              </p>
            </div>
          )}

          {data.score_adjustment_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Score Adjustment Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.score_adjustment_rationale}
              </p>
            </div>
          )}

          {data.experimental_evidence_score_rationale && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                Experimental Evidence Score Rationale
              </h4>
              <p className="text-sm text-gray-700">
                {data.experimental_evidence_score_rationale}
              </p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
} 