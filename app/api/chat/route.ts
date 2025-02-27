import { openai } from '@ai-sdk/openai';
import { streamText, generateObject } from 'ai';
import { z } from 'zod';
import { deepResearch, writeFinalReport } from '@/services/deep-research/deep-research';
import { generateFeedback } from '@/services/deep-research/feedback';

// Allow streaming responses up to 30 seconds
export const maxDuration = 40;

export async function POST(req: Request) {
  const payload = await req.json();

  console.log(payload);

  // Check if deep research is enabled
  if (payload.useDeepResearch) {
    try {
      // Generate follow-up questions based on the initial query
      const followUpQuestions = await generateFeedback({
        query: payload.prompt,
      });

      // For API usage, we'll use default answers to follow-up questions
      const defaultAnswers = followUpQuestions.map(() => "No specific preference");

      // Combine all information for deep research
      const combinedQuery = `
Initial Query: ${payload.prompt}
Context: Research about gene ${payload.gene_name} and its relationship to autism spectrum disorder
Selected papers: ${payload.selectedContext.papers.join(', ')}
Selected variants: ${payload.selectedContext.variants.join(', ')}
Selected cases: ${payload.selectedContext.cases.join(', ')}
Follow-up Questions and Default Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${defaultAnswers[i]}`).join('\n')}
`;

      // Use moderate breadth and depth for web research
      const breadth = 3;
      const depth = 2;

      // Perform deep research
      const { learnings, visitedUrls } = await deepResearch({
        query: combinedQuery,
        breadth,
        depth,
        onProgress: (progress) => {
          // In a real app, you could send progress updates via SSE
          console.log('Research progress:', progress);
        },
      });

      // Add the deep research results to the context
      const deepResearchContext = `
## Deep Research Results

The following information was gathered from web research:

${learnings.join('\n\n')}

## Sources
${visitedUrls.map(url => `- ${url}`).join('\n')}
`;

      // Continue with regular processing but include deep research results
      const result = streamText({
        model: openai('o3-mini'),
        system: `You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
        Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
        Use both the provided context and the deep research results to answer the question comprehensively.
        When citing information from deep research, mention that it comes from web research.
        `,
        prompt: `
        You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders, particularly focused on autism spectrum disorder (ASD) genetics.
        
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
        ${payload.rag_context_str || ''}
        
        ${deepResearchContext}
        
        ================================================================================================================
  
        When answering, please:
        1. Prioritize information directly from the provided context
        2. Quote specific passages from the literature when relevant
        3. Clearly distinguish between established findings and hypotheses
        4. Cite specific papers when possible (e.g., "Smith et al. found...")
        5. Acknowledge limitations or contradictions in the evidence
        6. Use precise scientific terminology while maintaining clarity
        7. When applicable, refer to EAGLE's evidence classification system to indicate the strength of gene-ASD associations
        8. CRITICAL: First analyze the user's question - if it relates to the EAGLE framework, answer the question based on that framework. If not, focus on generating insights from the scientific context while still citing relevant sources.
        9. CRITICAL: Focus primarily on the ${payload.gene_name} gene and its relationship to autism spectrum disorder. Prioritize information specifically about ${payload.gene_name}.
        10. CRITICAL: For variant-specific questions, provide detailed information about the functional impact, inheritance patterns, and clinical significance when available.
        11. CRITICAL: When using information from the deep research results, clearly indicate that it comes from web research and cite the source if available.
        
        Additional guidelines:
        - Organize your response with clear sections and logical flow
        - Be comprehensive and detailed - the user is an expert who values thoroughness
        - When discussing evidence, specify the type (e.g., case reports, functional studies, animal models)
        - If multiple studies present conflicting findings, summarize the different perspectives
        - If information is limited or uncertain, acknowledge this explicitly
        - When appropriate, mention implications for diagnosis, prognosis, or treatment
        - For complex mechanisms, explain the molecular/cellular pathways involved
        
        - The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
        - Be highly organized.
        - Suggest solutions that I didn't think about.
        - Be proactive and anticipate my needs.
        - Treat me as an expert in all subject matter.
        - Mistakes erode my trust, so be accurate and thorough.
        - Provide detailed explanations, I'm comfortable with lots of detail.
        - Value good arguments over authorities.
        - Consider new technologies and contrarian ideas, not just the conventional wisdom.
        - You may use high levels of speculation or prediction, just flag it for me.
        
        
        Question: ${payload.prompt}
        `,
        maxTokens: 16384,
        providerOptions: {
          openai: {
            reasoningEffort: 'low',
          },
        },
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error('Deep research error:', error);
      // Fall back to regular processing if deep research fails
    }
  }

  // Regular processing (without deep research)
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      query: z.string(),
      custom_tags: z.array(z.string()),
    }),
    prompt: `
    You are a helpful assistant that generates optimized queries for a RAG database.
    
    Your task:
    1. Analyze the user's question: "${payload.prompt}" and the context:
    cases: ${payload.selectedContext.cases?.join(',') || ''} 
    variants: ${payload.selectedContext.variants.join(',') || ''}
    2. Extract key concepts, entities, and relationships from the question and context
    3. Identify relevant tags from the list below that match the question's content
    4. Reformulate the question to improve semantic matching with document chunks
    5. Return both the optimized query and the relevant tags
    
    The database uses the openai ext-embedding-3-large to find the most relevant chunks, so focus on:
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
    • If relevant to EAGLE curation, include the tag 'relevant_to_eagle_curation'

    EAGLE Curation Guidelines for relevance:
    Include 'relevant_to_eagle_curation' ONLY if the query relates to:
    1. Direct evidence linking a specific gene or genetic variant to ASD
    2. Evidence types used in EAGLE scoring (e.g., case_report)
    3. Detailed information about ASD phenotype, diagnostic method, or functional impact of variants
    4. Specific variant identifiers or detailed mutation descriptions

    You must output the tags in a comma separated list.
    eg. "DMD, SHANK1, SCN2A, case_report, functional_study, asd_diagnosis"
    `,
  });

  //&tags=${[].join(',')}
  const rag_context = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rag/query?question=${object.query}&paper_title=${payload.selectedContext.papers.join(',')}`, {
    method: "POST",
  });

  const rag_context_str = await rag_context.json();

  const prompt = `
  You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders, particularly focused on autism spectrum disorder (ASD) genetics.
  
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
  2. Quote specific passages from the literature when relevant
  3. Clearly distinguish between established findings and hypotheses
  4. Cite specific papers when possible (e.g., "Smith et al. found...")
  5. Acknowledge limitations or contradictions in the evidence
  6. Use precise scientific terminology while maintaining clarity
  7. When applicable, refer to EAGLE's evidence classification system to indicate the strength of gene-ASD associations
  8. CRITICAL: First analyze the user's question - if it relates to the EAGLE framework, answer the question based on that framework. If not, focus on generating insights from the scientific context while still citing relevant sources.
  9. CRITICAL: Focus primarily on the ${payload.gene_name} gene and its relationship to autism spectrum disorder. Prioritize information specifically about ${payload.gene_name}.
  10. CRITICAL: For variant-specific questions, provide detailed information about the functional impact, inheritance patterns, and clinical significance when available.
  
  Additional guidelines:
  - Organize your response with clear sections and logical flow
  - Be comprehensive and detailed - the user is an expert who values thoroughness
  - When discussing evidence, specify the type (e.g., case reports, functional studies, animal models)
  - If multiple studies present conflicting findings, summarize the different perspectives
  - If information is limited or uncertain, acknowledge this explicitly
  - When appropriate, mention implications for diagnosis, prognosis, or treatment
  - For complex mechanisms, explain the molecular/cellular pathways involved
  
  - The user is a highly experienced analyst, no need to simplify it, be as detailed as possible and make sure your response is correct.
  - Be highly organized.
  - Suggest solutions that I didn't think about.
  - Be proactive and anticipate my needs.
  - Treat me as an expert in all subject matter.
  - Mistakes erode my trust, so be accurate and thorough.
  - Provide detailed explanations, I'm comfortable with lots of detail.
  - Value good arguments over authorities.
  - Consider new technologies and contrarian ideas, not just the conventional wisdom.
  - You may use high levels of speculation or prediction, just flag it for me.
  
  
  Question: ${payload.prompt}
  `;


  const result = streamText({
    model: openai('o3-mini'),
    system: `You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
    Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
    use the context to answer the question.
    `,
    prompt: prompt,
    maxTokens: 16384,
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
      },
    },
  });

  return result.toDataStreamResponse();
}