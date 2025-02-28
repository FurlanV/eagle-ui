import { openai } from '@ai-sdk/openai';
import { streamText, generateObject } from 'ai';
import { z } from 'zod';
import { deepResearch } from '@/services/deep-research/deep-research';
import { generateFeedback } from '@/services/deep-research/feedback';

// Types
interface SelectedContext {
  papers: string[];
  variants: string[];
  cases: string[];
}

interface ChatPayload {
  prompt: string;
  gene_name: string;
  useDeepResearch?: boolean;
  selectedContext: SelectedContext;
  rag_context_str?: string;
}

// Constants
const MAX_DURATION = 60;
const DEFAULT_BREADTH = 3;
const DEFAULT_DEPTH = 2;
const MAX_TOKENS = 16384;

// Configuration
const MODELS = {
  chat: 'o3-mini',
  queryGeneration: 'gpt-4o'
};

// Allow streaming responses
export const maxDuration = MAX_DURATION;

// Prompt templates
const getSystemPrompt = (gene_name: string, includeDeepResearch = false) => {
  let prompt = `You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders.
  Your task is to provide accurate, evidence-based answers about the ${gene_name} gene and its associations with autism spectrum disorder and related conditions.
  use the context to answer the question.`;

  if (includeDeepResearch) {
    prompt += `
    Use both the provided context and the deep research results to answer the question comprehensively.
    When citing information from deep research, mention from where the information comes from as in a research paper.`;
  }

  return prompt;
};

const getEagleContextPrompt = () => `
Important context about EAGLE (Evaluation of Autism Gene Link Evidence):
EAGLE is a structured framework for evaluating the evidence linking genes to Autism Spectrum Disorder (ASD). The EAGLE curation process:
1. Curates evidence from studies on neurodevelopmental disorders (NDDs) and specifically ASD
2. Classifies evidence strength as Limited, Moderate, Strong, or Definitive
3. Analyzes both phenotype (confidence in ASD diagnosis, intellectual ability context) and genotype (genetic variants)
4. Uses a detailed scoring system for genetic evidence (variant types, inheritance patterns)
5. Evaluates experimental evidence (functional studies, animal models)
6. Considers contradictory evidence (disputed vs. refuted associations)
`;

const getGuidelinesPrompt = (gene_name: string, includeDeepResearch = false) => {
  let guidelines = `
When answering, please:
1. Prioritize information directly from the provided context
2. Quote specific passages from the literature when relevant
3. Clearly distinguish between established findings and hypotheses
4. Cite specific papers when possible (e.g., "Smith et al. found...")
5. Acknowledge limitations or contradictions in the evidence
6. Use precise scientific terminology while maintaining clarity
7. When applicable, refer to EAGLE's evidence classification system to indicate the strength of gene-ASD associations
8. CRITICAL: First analyze the user's question - if it relates to the EAGLE framework, answer the question based on that framework. If not, focus on generating insights from the scientific context while still citing relevant sources.
9. CRITICAL: Focus primarily on the ${gene_name} gene and its relationship to autism spectrum disorder. Prioritize information specifically about ${gene_name}.
10. CRITICAL: For variant-specific questions, provide detailed information about the functional impact, inheritance patterns, and clinical significance when available.`;

  if (includeDeepResearch) {
    guidelines += `
11. CRITICAL: When using information from the deep research results, clearly indicate that it comes from web research and cite the source if available.`;
  }

  guidelines += `

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
- You may use high levels of speculation or prediction, just flag it for me.`;

  return guidelines;
};

const getQueryGenerationPrompt = (userPrompt: string, selectedContext: SelectedContext) => `
  You are a helpful assistant that generates optimized queries for a RAG database.

  Your task:
  1. Analyze the user's question: "${userPrompt}" and the context:
  cases: ${selectedContext.cases?.join(',') || ''} 
  variants: ${selectedContext.variants.join(',') || ''}
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
`;

/**
 * Performs deep research based on the user's query and context
 */
async function performDeepResearch(payload: ChatPayload) {
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

    // Perform deep research
    const { learnings, visitedUrls } = await deepResearch({
      query: combinedQuery,
      breadth: DEFAULT_BREADTH,
      depth: DEFAULT_DEPTH,
      onProgress: (progress) => {
        // In a real app, you could send progress updates via SSE
        console.log('Research progress:', progress);
      },
    });

    // Format the deep research results
    return {
      deepResearchContext: `
      ## Deep Research Results

      The following information was gathered from web research:

      ${learnings.join('\n\n')}

      ## Sources
      ${visitedUrls.map(url => `- ${url}`).join('\n')}
      `,
      success: true
    };
  } catch (error) {
    console.error('Deep research error:', error);
    return { success: false };
  }
}

/**
 * Fetches relevant context from the RAG system
 */
async function fetchRagContext(query: string, papers: string[]) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rag/query?question=${query}&paper_title=${papers.join(',')}`,
      { method: "POST" }
    );
    
    if (!response.ok) {
      throw new Error(`RAG API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching RAG context:', error);
    return "Error fetching relevant context. Please try again.";
  }
}

/**
 * Generates a response using the AI model
 */
async function generateResponse(payload: ChatPayload, context: string, includeDeepResearch = false) {
  const userPrompt = `
  You are a specialized scientific assistant with expertise in genetics and neurodevelopmental disorders, particularly focused on autism spectrum disorder (ASD) genetics.
  
  Your task is to provide accurate, evidence-based answers about the ${payload.gene_name} gene and its associations with autism spectrum disorder and related conditions.
  
  ${getEagleContextPrompt()}
  
  Below is relevant scientific context from peer-reviewed literature:
  ${context}
  
  ================================================================================================================

  ${getGuidelinesPrompt(payload.gene_name, includeDeepResearch)}
  
  Question: ${payload.prompt}
  `;

  return streamText({
    model: openai(MODELS.chat),
    system: getSystemPrompt(payload.gene_name, includeDeepResearch),
    prompt: userPrompt,
    maxTokens: MAX_TOKENS,
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
      },
    },
  });
}

/**
 * Main API handler
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json() as ChatPayload;

    // For debugging purposes
    console.log('Chat API request:', {
      prompt: payload.prompt,
      gene_name: payload.gene_name,
      useDeepResearch: payload.useDeepResearch,
      selectedContextSize: {
        papers: payload.selectedContext.papers?.length || 0,
        variants: payload.selectedContext.variants?.length || 0,
        cases: payload.selectedContext.cases?.length || 0,
      }
    });

    // Handle deep research if enabled
    if (payload.useDeepResearch) {
      const { deepResearchContext, success } = await performDeepResearch(payload);
      
      if (success) {
        // Combine existing context with deep research results
        const combinedContext = `${payload.rag_context_str || ''}\n\n${deepResearchContext}`;
        const result = await generateResponse(payload, combinedContext, true);
        return result.toDataStreamResponse();
      }
      // If deep research fails, fall back to regular processing
    }

    // Regular processing (without deep research)
    const { object } = await generateObject({
      model: openai(MODELS.queryGeneration),
      schema: z.object({
        query: z.string(),
        custom_tags: z.array(z.string()),
      }),
      prompt: getQueryGenerationPrompt(payload.prompt, payload.selectedContext),
    });

    // Fetch context from RAG system
    const ragContextStr = await fetchRagContext(
      object.query, 
      payload.selectedContext.papers
    );

    // Generate response
    const result = await generateResponse(payload, ragContextStr);
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}