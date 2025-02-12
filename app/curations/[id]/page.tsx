"use client"

import React from "react"

// A badge to highlight the Eagle Score with contrasting colors based on its value.
function EagleScoreBadge({ score, label }: { score: number; label: string }) {
  const badgeColor =
    score > 40 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}
    >
      {label}
    </span>
  )
}

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
      <div className="mt-2 text-2xl font-semibold text-gray-900">{children}</div>
    </div>
  )
}

export default function GeneDetailsPage() {
  const eagleScore = 41.5;
  // Determine the label based on the eagleScore
  const eagleScoreLabel = eagleScore > 40 ? "Strong" : "Moderate";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold">ADNP</h1>
          <p className="mt-2 text-lg">Activity-dependent neuroprotector homeobox</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Gene Highlights Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Key Gene Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HighlightCard
              title="EAGLE Score"
              accentClass={eagleScore > 40 ? "border-green-500" : "border-orange-500"}
            >
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-900">
                  {eagleScore}
                </span>
                <span className="text-sm text-gray-500">
                  {eagleScoreLabel}
                </span>
              </div>
            </HighlightCard>

            <HighlightCard
              title="Autism Reports / Total Reports"
              accentClass="border-blue-500"
            >
              44 / 90
            </HighlightCard>

            <HighlightCard
              title="Rare Variants / Common Variants"
              accentClass="border-red-500"
            >
              192 / 0
            </HighlightCard>

            <HighlightCard title="Chromosome Band" accentClass="border-purple-500">
              20q13.13
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
              <p className="mt-1 text-base text-gray-800">ADNP, ADNP1</p>
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
                Associated Syndromes
              </span>
              <p className="mt-1 text-base text-gray-800">
                Helsmoortel-Van der Aa syndrome, ASD, ID, Helsmoortel-van der Aa syndrome,
                Helsmoortel-Van der Aa syndrome, DD, ID, Helsmoortel-van der Aa syndrome, DD,
                Helsmoortel-van der Aa syndrome, ASD, DD, Helsmoortel-van der Aa syndrome,
                ASD, DD, ID, Helsmoortel-van der Aa syndrome, ASD, DD, epilepsy,
                Helsmoortel-Van der Aa syndrome, ASD, ADHD, DD, ID
              </p>
            </div>
          </div>
        </section>

        {/* Relevance to Autism Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Relevance to Autism
          </h2>
          <p className="text-base leading-relaxed text-gray-800">
            Recurrent mutations in the ADNP gene have been identified in multiple individuals
            with ASD as described below. Two de novo frameshift variants in ADNP were identified
            in unrelated simplex ASD cases in two reports by O'Roak and colleagues in 2012 (PMIDs
            22495309 and 23160955). An additional seven de novo LoF variants were identified in patients
            with ASD in Helsmoortel et al., 2014, giving a current total of nine de novo LoF variants
            in ADNP gene in ASD cases; the probability of detecting eight or more de novo truncating events
            in ADNP was given as P=2.65 x 10⁻¹⁸ in this report (PMID 24531329). Furthermore, the frequency
            of shared clinical characteristics in ASD cases with LoF variants in ADNP (intellectual disability,
            facial dysmorphisms) led Helsmoortel and colleagues to conclude that ADNP mutations resulted in an
            autism syndrome. Analysis of rare coding variation in 3,871 ASD cases and 9,937 ancestry-matched or
            paternal controls from the Autism Sequencing Consortium (ASC) in De Rubeis et al., 2014 identified
            ADNP as a gene meeting high statistical significance with an FDR of 0.01, meaning that this gene had
            a 99% chance of being a true autism gene (PMID 25363760). This gene was identified in Iossifov et al.
            2015 as a strong candidate to be an ASD risk gene based on a combination of de novo mutational evidence
            and the absence or very low frequency of mutations in controls (PMID 26401017). A two-stage analysis of
            rare de novo and inherited coding variants in 42,607 ASD cases, including 35,130 new cases from the
            SPARK cohort, in Zhou et al., 2022 identified ADNP as a gene reaching exome-wide significance (P &lt; 2.5E-06).
          </p>
        </section>

        {/* Molecular Function Section */}
        <section>
          <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6">
            Molecular Function
          </h2>
          <p className="text-base leading-relaxed text-gray-800">
            Potential transcription factor that may mediate some of the neuroprotective peptide VIP-associated
            effects involving normal growth and cancer proliferation. In brain, expression is stronger in the cerebellum
            and cortex regions.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            Data &amp; analysis based on curated research. Please refer to the original publications for additional
            details.
          </p>
        </div>
      </footer>
    </div>
  )
}