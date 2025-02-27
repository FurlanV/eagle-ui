import React, { useState } from "react"
import { ColumnDef, Row, CellContext } from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Info } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Updated interface to match the new data structure
export interface CaseData {
  id: number;
  case_id: string;
  sex: string | null;
  age: string | null;
  phenotypes: string;
  notes: string | null;
  description: string;
}

interface CaseDetailsTableProps {
  caseDetailsData: CaseData[];
  columns: ColumnDef<any, any>[];
  isLoading: boolean;
}

// Component to render the expanded row content
const ExpandedRow = ({ data }: { data: CaseData }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4 mt-2 mb-4">
      {data.description && (
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Case Description</h4>
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
    </div>
  );
};

export const CaseDetailsTable: React.FC<CaseDetailsTableProps> = ({
  caseDetailsData,
  columns,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Function to toggle row expansion
  const toggleRowExpanded = (id: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Enhanced columns with expand/collapse functionality
  const enhancedColumns: ColumnDef<any, any>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        const isExpanded = expandedRows[row.original.id] || false;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRowExpanded(row.original.id)}
            className="p-0 h-8 w-8"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    // Include all columns except any that might have phenotypes as accessorKey
    ...columns.filter(col => {
      if ('accessorKey' in col) {
        return col.accessorKey !== 'phenotypes';
      }
      return true;
    }),
    {
      id: 'age',
      header: 'Age',
      cell: ({ row }) => row.original.age || 'Not specified',
    },
    {
      id: 'phenotypes',
      header: 'Phenotypes',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate cursor-help">
                {row.original.phenotypes || 'Not specified'}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>{row.original.phenotypes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      id: 'details',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRowExpanded(row.original.id)}
          className="p-0 h-8 w-8"
        >
          <Info className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <DataTable 
        columns={enhancedColumns} 
        data={caseDetailsData} 
        initialPageSize={10} 
      />
      
      {/* Render expanded rows */}
      {caseDetailsData.map(row => (
        expandedRows[row.id] && (
          <div key={`expanded-${row.id}`}>
            <ExpandedRow data={row} />
          </div>
        )
      ))}
    </div>
  );
};
