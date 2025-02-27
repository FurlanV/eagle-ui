"use client"

import React, { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import {
  useGetGeneInformationQuery,
  useGetGenePapersAndVariantsQuery,
} from "@/services/gene/gene"
import { ColumnDef } from "@tanstack/react-table"
import { BotMessageSquare, ExternalLink, X } from "lucide-react"

import { useAppSelector } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIChatCard from "@/components/ai-chat-card"
import { FileStatusList } from "@/components/file-status-list"

import { CaseDetailsTable } from "./components/case-details-table"
import { PapersTable } from "./components/papers-table"
import { VariantsTable } from "./components/variants-table"
import { useCurationData } from "./hooks/useCurationData"
import { Paper, Variant } from "./types"

// A reusable component to present each gene highlight in a card style.
// The colored left-border (accent) immediately draws the user's eye to important values.
type HighlightCardProps = {
  title: string
  children: React.ReactNode
  accentClass: string // A valid Tailwind border accent color class, e.g., "border-green-500"
}

function HighlightCard({ title, children, accentClass }: HighlightCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 border-l-4 ${accentClass}`}
    >
      <span className="block text-sm font-medium text-gray-500">{title}</span>
      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {children}
      </div>
    </div>
  )
}

// A component to display external database references with proper links
type DatabaseReference = {
  db: string
  id: string
  url: string
}

function parseOtherRefs(otherRefs?: string): DatabaseReference[] {
  if (!otherRefs) return []

  return otherRefs.split("|").map((ref) => {
    const [db, id] = ref.split(":")

    // Define URLs for different database types
    let url = "#"
    switch (db) {
      case "MIM":
        url = `https://www.omim.org/entry/${id}`
        break
      case "HGNC":
        url = `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`
        break
      case "Ensembl":
        url = `https://ensembl.org/Homo_sapiens/Gene/Summary?g=${id}`
        break
      case "AllianceGenome":
        url = `https://www.alliancegenome.org/gene/${id}`
        break
      default:
        url = `#${db}-${id}`
    }

    return { db, id, url }
  })
}

function DatabaseReferences({ otherRefs }: { otherRefs?: string }) {
  const references = parseOtherRefs(otherRefs)

  if (references.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {references.map((ref, index) => (
        <a
          key={index}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        >
          {ref.db}
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      ))}
    </div>
  )
}

// Define interfaces for the API response data
interface GeneInfo {
  id?: string;
  description?: string;
  map_location?: string;
  synonyms?: string;
  summary?: string;
  other_refs?: string;
}

interface GenePapersAndVariants {
  papers: Paper[];
  variants: Variant[];
}

export default function GeneDetailsPage() {
  const pathname = usePathname()
  const split_pathname = pathname.split("/")
  const gene_name = split_pathname[split_pathname.length - 1]
  if (!gene_name) return

  const selectedJob = useAppSelector((state) => state.jobs.selectedJob)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMaximized, setIsChatMaximized] = useState(false)



  //const { data: annotationData } = useGetGeneReferencesQuery(gene_name)
  const { data: geneInfo } = useGetGeneInformationQuery(gene_name)
  // Safely cast the data to GeneInfo type
  const geneInfoData = (geneInfo || {}) as GeneInfo
  
  // Only fetch variants if we have a gene ID
  const { data: variantData } = useGetGenePapersAndVariantsQuery(
    geneInfoData?.id || "", 
    { skip: !geneInfoData?.id }
  )
  
  // Default empty data if nothing is returned
  const papers = Array.isArray(variantData) ? [] : 
    (variantData as any)?.papers || []
  
  const variants = Array.isArray(variantData) ? [] : 
    (variantData as any)?.variants || []

  const cases = Array.isArray(variantData) ? [] : 
    (variantData as any)?.cases || []
  
  const genePapersAndVariantsData = {
    papers,
    variants,
    cases
  }

  // let scoreRelevance = ""
  // switch (true) {
  //   case totalFinalScore >= 12:
  //     scoreRelevance = "Definitive"
  //     break
  //   case totalFinalScore >= 9:
  //     scoreRelevance = "Strong"
  //     break
  //   case totalFinalScore >= 6:
  //     scoreRelevance = "Moderate"
  //     break
  //   case totalFinalScore >= 3:
  //     scoreRelevance = "Limited"
  //     break
  //   default:
  //     scoreRelevance = "No Support"
  // }

  // console.log(geneInfoData)
  // console.log(genePapersAndVariantsData)


  const eagleScore = 41.5
  // Determine the label based on the eagleScore
  const eagleScoreLabel = eagleScore > 40 ? "Strong" : "Moderate"

  const columns: ColumnDef<any, any>[] = useMemo(
    () => [
      {
        accessorKey: "case_id",
        header: "Case ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "sex",
        header: "Sex",
        cell: (info) => info.getValue() || "Not specified",
      },
    ],
    []
  )

  return (
    <div className="relative min-w-full min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold">{gene_name}</h1>
          <p className="mt-2 text-lg">
            {geneInfoData?.description?.split("[")[0]}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Gene Highlights Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Gene Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HighlightCard
              title="EAGLE Score"
              accentClass={
                0 > 12 ? "border-green-500" : "border-orange-500"
              }
            >
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-900">
                  {0}
                </span>
                <span className="text-sm text-gray-500">{"No Support"}</span>
              </div>
            </HighlightCard>

            <HighlightCard
              title="Total Autism Reports"
              accentClass="border-blue-500"
            >
              {cases.length}
            </HighlightCard>

            <HighlightCard
              title="Rare Variants / Common Variants"
              accentClass="border-red-500"
            >
              {variants.length} / {cases.length}
            </HighlightCard>

            <HighlightCard
              title="Chromosome Band"
              accentClass="border-purple-500"
            >
              {geneInfoData?.map_location}
            </HighlightCard>
          </div>
        </section>

        {/* Overview Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <span className="block text-sm font-medium text-gray-500">
                Gene Aliases
              </span>
              <p className="mt-1 text-base text-gray-800">
                {geneInfoData?.synonyms?.replaceAll("|", ", ")}
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">
                Associated Disorders
              </span>
              <p className="mt-1 text-base text-gray-800">
                DD/NDD, ADHD, ID, EPS, ASD
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-sm font-medium text-gray-500">
                Genetic Category
              </span>
              <p className="mt-1 text-base text-gray-800">
                Rare Single Gene Mutation, Syndromic, Functional
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-sm font-medium text-gray-500">
                Gene Summary
              </span>
              <p className="mt-1 text-base text-gray-800">
                {geneInfoData?.summary}
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-sm font-medium text-gray-500">
                External Database References
              </span>
              <div className="mt-2">
                <DatabaseReferences otherRefs={geneInfoData?.other_refs} />
              </div>
            </div>
          </div>
        </section>

        {/* Relevance to Autism Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Relevance to Autism
          </h2>
          <p className="text-base leading-relaxed text-gray-800">
            Recurrent mutations in the ADNP gene have been identified in
            multiple individuals with ASD as described below. Two de novo
            frameshift variants in ADNP were identified in unrelated simplex ASD
            cases in two reports by O'Roak and colleagues in 2012 (PMIDs
            22495309 and 23160955). An additional seven de novo LoF variants
            were identified in patients with ASD in Helsmoortel et al., 2014,
            giving a current total of nine de novo LoF variants in ADNP gene in
            ASD cases; the probability of detecting eight or more de novo
            truncating events in ADNP was given as P=2.65 x 10⁻¹⁸ in this report
            (PMID 24531329). Furthermore, the frequency of shared clinical
            characteristics in ASD cases with LoF variants in ADNP (intellectual
            disability, facial dysmorphisms) led Helsmoortel and colleagues to
            conclude that ADNP mutations resulted in an autism syndrome.
            Analysis of rare coding variation in 3,871 ASD cases and 9,937
            ancestry-matched or paternal controls from the Autism Sequencing
            Consortium (ASC) in De Rubeis et al., 2014 identified ADNP as a gene
            meeting high statistical significance with an FDR of 0.01, meaning
            that this gene had a 99% chance of being a true autism gene (PMID
            25363760). This gene was identified in Iossifov et al. 2015 as a
            strong candidate to be an ASD risk gene based on a combination of de
            novo mutational evidence and the absence or very low frequency of
            mutations in controls (PMID 26401017). A two-stage analysis of rare
            de novo and inherited coding variants in 42,607 ASD cases, including
            35,130 new cases from the SPARK cohort, in Zhou et al., 2022
            identified ADNP as a gene reaching exome-wide significance (P &lt;
            2.5E-06).
          </p>
        </section>

        {/* Molecular Function Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Molecular Function
          </h2>
          <p className="text-base leading-relaxed text-gray-800">
            Potential transcription factor that may mediate some of the
            neuroprotective peptide VIP-associated effects involving normal
            growth and cancer proliferation. In brain, expression is stronger in
            the cerebellum and cortex regions.
          </p>
        </section>
      </main>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Tabs defaultValue="papers">
          <TabsList>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="case-details">Cases</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="protein-interactions">
              Protein Interactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="papers">
            <PapersTable 
              papers={papers} 
              isLoading={false} 
            />
          </TabsContent>
          <TabsContent value="case-details">
            <CaseDetailsTable
              caseDetailsData={cases || []}
              columns={columns}
              isLoading={false}
            />
          </TabsContent>
          <TabsContent value="variants">
            <VariantsTable 
              variants={variants} 
              isLoading={false} 
            />
          </TabsContent>
          <TabsContent value="protein-interactions">
            <div className="py-8 text-center text-gray-500">
              Protein interaction data coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            Data &amp; analysis based on curated research. Please refer to the
            original publications for additional details.
          </p>
        </div>
      </footer>

      {/* Chat button and card */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
        {isChatOpen && (
          <>
            {/* Chat card with animation */}
            <div
              className={cn(
                "mb-2 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 scale-100",
                isChatMaximized
                  ? "fixed inset-0 z-[90] flex items-center justify-center w-full h-full"
                  : "max-w-[90vw] sm:max-w-md z-50"
              )}
              role="dialog"
              aria-labelledby="chat-title"
              aria-modal="true"
            >
              <div
                className={cn(
                  "relative",
                  isChatMaximized
                    ? "w-full h-full flex items-center justify-center"
                    : ""
                )}
              >
                {/* Close button for mobile accessibility */}
                {!isChatMaximized && (
                  <button
                    className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 rounded-full p-1 shadow-md sm:hidden"
                    onClick={() => setIsChatOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <AIChatCard
                  chatName={`${gene_name} Assistant`}
                  gene_name={gene_name}
                  isMaximized={isChatMaximized}
                  onToggleMaximize={() => setIsChatMaximized(!isChatMaximized)}
                  predefinedMessages={[
                    {
                      id: "1",
                      content: `Welcome to the ${gene_name} gene information page. I can help you understand this gene and its relevance to autism.`,
                      sender: {
                        name: "AI Assistant",
                        avatar: "",
                        isOnline: true,
                      },
                      timestamp: "Just now",
                      status: "read",
                    },
                    {
                      id: "2",
                      content: `You can ask me about ${gene_name}'s function, associated disorders, or specific research findings. What would you like to know?`,
                      sender: {
                        name: "AI Assistant",
                        avatar: "",
                        isOnline: true,
                      },
                      timestamp: "Just now",
                      status: "read",
                    },
                  ]}
                />
              </div>
            </div>
          </>
        )}
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`rounded-full p-3 shadow-lg transition-all duration-300 ${
            isChatOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } ${isChatMaximized ? "hidden" : ""}`}
          aria-label={isChatOpen ? "Close chat" : "Open chat"}
          aria-expanded={isChatOpen}
          aria-controls="gene-assistant-chat"
        >
          {isChatOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <BotMessageSquare className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
