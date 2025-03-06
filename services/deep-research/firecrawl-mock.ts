// This is a mock implementation of the FirecrawlApp for development purposes
// Replace this with the actual @mendable/firecrawl-js package in production

export interface SearchResponse {
  data: Array<{
    url: string;
    title?: string;
    markdown?: string;
    html?: string;
    text?: string;
  }>;
  meta?: {
    total?: number;
    took?: number;
  };
}

interface FirecrawlOptions {
  apiKey?: string;
  apiUrl?: string;
}

interface SearchOptions {
  timeout?: number;
  limit?: number;
  scrapeOptions?: {
    formats?: Array<'markdown' | 'html' | 'text'>;
  };
}

export default class FirecrawlApp {
  private apiKey: string;
  private apiUrl: string;

  constructor(options: FirecrawlOptions = {}) {
    this.apiKey = options.apiKey || '';
    this.apiUrl = options.apiUrl || 'https://api.firecrawl.dev';
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    console.log(`[MOCK] Searching for: ${query}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data
    return {
      data: [
        {
          url: 'https://example.com/result1',
          title: 'Example Result 1',
          markdown: `# ${query} - Result 1\n\nThis is a mock search result for the query "${query}". In a real implementation, this would contain actual content scraped from the web.`,
        },
        {
          url: 'https://example.com/result2',
          title: 'Example Result 2',
          markdown: `# ${query} - Result 2\n\nThis is another mock search result for the query "${query}". In a real implementation, this would contain actual content scraped from the web.`,
        },
        {
          url: 'https://example.com/result3',
          title: 'Example Result 3',
          markdown: `# ${query} - Result 3\n\nThis is a third mock search result for the query "${query}". In a real implementation, this would contain actual content scraped from the web.`,
        },
      ],
      meta: {
        total: 3,
        took: 1.5,
      },
    };
  }
} 