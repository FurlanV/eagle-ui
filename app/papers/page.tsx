"use client"

import { useGetAllPapersQuery } from "@/services/paper/paper"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthWrapper } from "@/components/auth-wrapper"
import { PapersTable } from "@/components/papers-table"

export default function PapersPage() {
  const { error, data: papersData = [], isLoading } = useGetAllPapersQuery()

  return (
    <AuthWrapper>
      <div className="flex flex-col p-4 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Papers</h1>
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
        <PapersTable data={papersData} isLoading={isLoading} />
      </div>
    </AuthWrapper>
  )
}
