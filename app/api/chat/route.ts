import { openai } from '@ai-sdk/openai';
import { streamText, generateObject } from 'ai';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 40;

export async function POST(req: Request) {
  const payload = await req.json();

  console.log(payload);

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      query: z.string(),
      custom_tags: z.array(z.string()),
    }),
    prompt: `
    You are a helpful assistant that generates optimized queries for a RAG database.
    
    Your task:
    1. Analyze the user's question: "${payload.prompt}"
    2. Extract key concepts, entities, and relationships from the question
    3. Identify relevant tags from the list below that match the question's content
    4. Reformulate the question to improve semantic matching with document chunks
    5. Return both the optimized query and the relevant tags
    
    The database uses the openai ext-embedding-3-large to find the most relevant chunks, so focus on:
    - Including specific terminology and technical language
    - Maintaining key entities in their original form (especially gene names in ORIGINAL CASE)
    - Being concise but comprehensive
    - Emphasizing the core information need
    
    Available tags (select only those relevant to the query):
    • Gene names (e.g., SCN2A, SHANK3, MECP2)
    • Variant identifiers (e.g., c.1234A>G, p.R123C)
    • Evidence types (e.g. functional_study, family_study, gwas)
    • Case report evidence types (e.g. case_report)
    • ASD-related phenotypes (e.g. asd_diagnosis, intellectual_disability, language_impairment, seizures, social_deficits)
    • Diagnostic tools used (e.g. dsm_v, adi_r, ados, clinical_diagnosis)
    • Mutation types (e.g., de_novo_mutation, cnv, missense, frameshift, nonsense, splice_site, deletion, duplication)
    • Functional consequences (e.g., loss_of_function, gain_of_function, altered_expression)
    • Study methodologies (e.g., case_control, cohort_study, family_based, genome_wide)
    • Animal models mentioned (e.g., mouse, rat, zebrafish)

    You must output the tags in a comma separated list.
    eg. "DMD, SHANK1, case_report, functional_study"
    `,
  });

  //&tags=${[].join(',')}
  const rag_context = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rag/query?question=${payload.prompt}`, {
    method: "POST",
  });

  const rag_context_str = await rag_context.json();

  console.log(object);
  console.log(rag_context_str);
  console.log(payload.gene_name);

  const prompt = `
  You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
  
  Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
  
  Important context about EAGLE (Evaluation of Autism Gene Link Evidence):
  EAGLE is a structured framework for evaluating the evidence linking genes to Autism Spectrum Disorder (ASD). The EAGLE curation process:
  1. Curates evidence from studies on neurodevelopmental disorders (NDDs) and specifically ASD
  2. Classifies evidence strength as Limited, Moderate, Strong, or Definitive
  3. Analyzes both phenotype (confidence in ASD diagnosis, intellectual ability context) and genotype (genetic variants)
  4. Uses a detailed scoring system for genetic evidence (variant types, inheritance patterns)
  5. Evaluates experimental evidence (functional studies, animal models)
  6. Considers contradictory evidence (disputed vs. refuted associations)
  
  Below is relevant scientific context from peer-reviewed literature:
  ${rag_context_str}
  
  ================================================================================================================
  
  When answering, please:
  1. Prioritize information directly from the provided context
  2. Use the tags to find the most relevant chunks
  3. Quote the source of the information
  4. Clearly distinguish between established findings and hypotheses
  5. Cite specific papers when possible (e.g., "Smith et al. found...")
  6. Acknowledge limitations or contradictions in the evidence
  7. Use precise scientific terminology while remaining accessible
  8. When applicable, refer to EAGLE's evidence classification system to indicate the strength of gene-ASD associations
  9. CRITICAL: First analyze the user's question - if it relates to the EAGLE answer the question based on the EAGLE framework. If the question doesn't directly relate to evidence classification, focus on generating insights and answers from the scientific context while still quoting the relevant papers and sources. Always cite the specific papers or sources from which you're drawing information.
  10. CRITICAL: Pay special attention to the ${payload.gene_name} gene specifically. Your response should focus primarily on this gene and its relationship to autism spectrum disorder. Filter and prioritize all information (from both the EAGLE framework and scientific context) that relates specifically to ${payload.gene_name}.
  
  Question: ${payload.prompt}
  `;

  console.log(prompt);

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
    Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
    use the context to answer the question.
    `,
    prompt: prompt,
  });

  return result.toDataStreamResponse();
}