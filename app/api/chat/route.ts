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
    
    The database uses text-embedding-3-small to find the most relevant chunks, so focus on:
    - Including specific terminology and technical language
    - Maintaining key entities in their original form (especially gene names in ORIGINAL CASE)
    - Being concise but comprehensive
    - Emphasizing the core information need
    
    Available tags (select only those relevant to the query):
    • Gene names in ORIGINAL CASE (e.g., SCN2A, SHANK3, MECP2)
    • Variant identifiers (e.g., c.1234A>G, p.R123C)
    • Evidence types (e.g. functional_study, family_study, gwas)
    • Case report evidence types (e.g. case_report)
    • ASD-related phenotypes (e.g. asd_diagnosis, intellectual_disability, language_impairment, seizures, social_deficits)
    • Diagnostic tools used (e.g. dsm_v, adi_r, ados, clinical_diagnosis)
    • Mutation types (e.g., de_novo_mutation, cnv, missense, frameshift, nonsense, splice_site, deletion, duplication)
    • Functional consequences (e.g., loss_of_function, gain_of_function, altered_expression)
    • Study methodologies (e.g., case_control, cohort_study, family_based, genome_wide)
    • Animal models mentioned (e.g., mouse, rat, zebrafish)
    `,
  });

  const rag_context = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rag/query?question=${payload.prompt}&tags=${[payload.gene_name, ...object.custom_tags].join(',')}`, {
    method: "POST",
  });

  const rag_context_str = await rag_context.json();

  console.log(object);
  console.log(rag_context_str);

  const prompt = `
  You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
  
  Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
  
  Below is relevant scientific context from peer-reviewed literature:
  ${rag_context_str}
  
  When answering, please:
  1. Prioritize information directly from the provided context
  2. Clearly distinguish between established findings and hypotheses
  3. Cite specific papers when possible (e.g., "Smith et al. found...")
  4. Acknowledge limitations or contradictions in the evidence
  5. Use precise scientific terminology while remaining accessible
  
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