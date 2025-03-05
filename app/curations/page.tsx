"use client"

import { useGetGenesWithCasesQuery } from "@/services/gene/gene"

import { AuthWrapper } from "@/components/auth-wrapper"
import { GenesTable } from "@/components/genes-table"

export default function CurationsPage() {
  const { error, data: genesWithCasesData = [] } = useGetGenesWithCasesQuery()
  
  return (
    <AuthWrapper>
      <div className="flex flex-col p-4 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Genes</h1>
        </header>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error.toString()}</span>
          </div>
        )}
        <GenesTable data={genesWithCasesData} />
      </div>
    </AuthWrapper>
  )
}
