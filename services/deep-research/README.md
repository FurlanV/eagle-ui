# Deep Research Module

This module provides advanced web research capabilities for the AI chat interface. It allows the AI to search the web for information about a topic and incorporate that information into its responses.

## Features

- Multi-step research process with configurable breadth and depth
- Automatic generation of follow-up questions
- Progress tracking during research
- Final report generation
- Integration with the AI chat interface

## How It Works

1. The user toggles the "Deep Research" option in the chat interface
2. When the user submits a question, the deep research process is triggered
3. The system generates follow-up questions to better understand the research needs
4. The system performs a web search using the initial query and context
5. The system analyzes the search results and extracts key learnings
6. The system generates follow-up queries based on the initial results
7. The process repeats until the configured depth is reached
8. The final results are incorporated into the AI's response

## Configuration

The deep research process can be configured with the following parameters:

- `breadth`: The number of parallel search queries to run at each step (default: 3)
- `depth`: The number of recursive search steps to perform (default: 2)

## Integration with Chat

The deep research module is integrated with the AI chat interface through the following components:

- `AIInput`: Provides a toggle for enabling/disabling deep research
- `AIChatCard`: Displays a special loading indicator when deep research is in progress
- `api/chat/route.ts`: Handles the chat API requests and integrates deep research results

## Development

For development purposes, a mock implementation of the FirecrawlApp is provided. In production, this should be replaced with the actual `@mendable/firecrawl-js` package.

## Dependencies

- `ai`: For generating text with AI models
- `lodash-es`: For utility functions
- `p-limit`: For limiting concurrency
- `zod`: For schema validation

## Usage

To use deep research in your application:

1. Toggle the "Deep Research" option in the chat interface
2. Enter your question as usual
3. The system will perform a deep web search and incorporate the results into the AI's response
4. The response will include citations to the sources found during research 