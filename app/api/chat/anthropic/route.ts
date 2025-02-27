import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 40;

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = streamText({
        model: anthropic('claude-3-7-sonnet-2025021'),
        prompt,
        providerOptions: {
            anthropic: {
                thinking: { type: 'enabled', budgetTokens: 12000 },
            },
        },
    });

    return result.toDataStreamResponse({ sendReasoning: true });
}