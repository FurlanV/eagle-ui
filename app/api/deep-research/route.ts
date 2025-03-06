import { NextResponse } from 'next/server';
import { deepResearch, writeFinalReport } from '@/services/deep-research/deep-research';
import { generateFeedback } from '@/services/deep-research/feedback';

// Allow longer responses for deep research
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { prompt, gene_name, selectedContext } = payload;

    // Generate follow-up questions based on the initial query
    const followUpQuestions = await generateFeedback({
      query: prompt,
    });

    // For API usage, we'll use default answers to follow-up questions
    // In a more interactive version, we could ask the user to answer these
    const defaultAnswers = followUpQuestions.map(() => "No specific preference");

    // Combine all information for deep research
    const combinedQuery = `
    Initial Query: ${prompt}
    Context: Research about gene ${gene_name} and its relationship to autism spectrum disorder
    Selected papers: ${selectedContext.papers.join(', ')}
    Selected variants: ${selectedContext.variants.join(', ')}
    Selected cases: ${selectedContext.cases.join(', ')}
    Follow-up Questions and Default Answers:
    ${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${defaultAnswers[i]}`).join('\n')}
    `;

    // Use moderate breadth and depth for web research
    const breadth = 3;
    const depth = 2;

    // Track progress (in a real app, this could be sent via SSE)
    const progressUpdates: any[] = [];

    // Perform deep research
    const { learnings, visitedUrls } = await deepResearch({
      query: combinedQuery,
      breadth,
      depth,
      onProgress: (progress) => {
        progressUpdates.push(progress);
        // In a real app, you could send progress updates via SSE
      },
    });

    // Generate final report
    const report = await writeFinalReport({
      prompt: combinedQuery,
      learnings,
      visitedUrls,
    });

    return NextResponse.json({
      report,
      learnings,
      visitedUrls,
      progressUpdates,
    });
  } catch (error: any) {
    console.error('Deep research error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during deep research' },
      { status: 500 }
    );
  }
} 