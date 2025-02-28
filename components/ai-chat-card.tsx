import { useEffect, useRef, useState } from "react"
import {
  Check,
  CheckCheck,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Users,
  Search,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'

import { cn } from "@/lib/utils"
import AIInput from "./ai-input"

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar: string
    isOnline: boolean
  }
  timestamp: string
  status: "sent" | "delivered" | "read"
  reactions?: Array<{
    emoji: string
    count: number
    reacted: boolean
  }>
  tokenUsage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

interface ChatContext {
  papers: string[]
  variants: string[]
  cases: string[]
}

interface AIChatCardProps {
  chatName?: string
  predefinedMessages?: Message[]
  gene_name: string
  context?: ChatContext
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

export default function AIChatCard({
  chatName,
  predefinedMessages = [],
  gene_name,
  context,
  isMaximized = false,
  onToggleMaximize,
}: AIChatCardProps) {
  const [messages, setMessages] = useState<Message[]>([...predefinedMessages])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedContext, setSelectedContext] = useState<{
    papers: string[];
    variants: string[];
    cases: string[];
  }>({ papers: [], variants: [], cases: [] })
  const [useDeepResearch, setUseDeepResearch] = useState<boolean>(false)
  const [streamingMessage, setStreamingMessage] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [isDeepResearching, setIsDeepResearching] = useState<boolean>(false)

  // Scroll to bottom whenever messages change or streaming content updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  // Custom function to call the API directly
  const callChatAPI = async (prompt: string) => {
    try {
      setIsStreaming(true);
      setStreamingMessage("");
      
      if (useDeepResearch) {
        setIsDeepResearching(true);
      }
      
      const response = await fetch("/eagle/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          gene_name,
          selectedContext,
          useDeepResearch,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");
      
      const decoder = new TextDecoder();
      let result = "";
      let tokenUsage: Message['tokenUsage'] = undefined;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Extract text content from the chunk
        const textContent = extractTextFromChunk(chunk);
        if (textContent) {
          result += textContent;
          setStreamingMessage(result);
        }
        
        // Try to extract token usage information
        const usageInfo = extractTokenUsage(chunk);
        if (usageInfo) {
          tokenUsage = usageInfo;
        }
      }
      
      // Add the AI response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: String(prevMessages.length + 1),
          content: result,
          sender: { name: "AI", avatar: "", isOnline: true },
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sent",
          tokenUsage: tokenUsage,
        },
      ]);
      
      // Reset streaming state
      setIsStreaming(false);
      setStreamingMessage("");
      setIsDeepResearching(false);
      
    } catch (error) {
      console.error("Error calling chat API:", error);
      setIsStreaming(false);
      setIsDeepResearching(false);
      
      // Add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: String(prevMessages.length + 1),
          content: "Sorry, there was an error processing your request. Please try again.",
          sender: { name: "AI", avatar: "", isOnline: true },
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sent",
        },
      ]);
    }
  };

  // Helper function to extract text from the specific format we're seeing
  const extractTextFromChunk = (chunk: string): string => {
    try {
      // The format we're seeing is like: f:{...} 0:"text" 0:" more" 0:" text" e:{...} d:{...}
      // We need to extract all the text parts
      
      // Extract all text parts using regex
      const regex = /\d+:"([^"]+)"/g;
      let match;
      let text = '';
      
      while ((match = regex.exec(chunk)) !== null) {
        text += match[1];
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from chunk:', error);
      return '';
    }
  };

  // Helper function to extract token usage from the response
  const extractTokenUsage = (chunk: string): { promptTokens: number, completionTokens: number, totalTokens: number } | undefined => {
    try {
      // Look for usage information in the chunk
      // The format is typically like: e:{"finishReason":"stop","usage":{"promptTokens":13743,"completionTokens":1738},"isContinued":false}
      const usageMatch = chunk.match(/e:{"finishReason":"[^"]+","usage":({[^}]+}),"isContinued":/);
      if (usageMatch && usageMatch[1]) {
        try {
          const usageStr = usageMatch[1];
          const usage = JSON.parse(usageStr);
          
          if (usage.promptTokens !== undefined && usage.completionTokens !== undefined) {
            return {
              promptTokens: usage.promptTokens,
              completionTokens: usage.completionTokens,
              totalTokens: usage.promptTokens + usage.completionTokens
            };
          }
        } catch (e) {
          console.error('Error parsing usage JSON:', e);
        }
      }
      
      // Alternative format: d:{"finishReason":"stop","usage":{"promptTokens":13743,"completionTokens":1738}}
      const altUsageMatch = chunk.match(/d:{"finishReason":"[^"]+","usage":({[^}]+})}/);
      if (altUsageMatch && altUsageMatch[1]) {
        try {
          const usageStr = altUsageMatch[1];
          const usage = JSON.parse(usageStr);
          
          if (usage.promptTokens !== undefined && usage.completionTokens !== undefined) {
            return {
              promptTokens: usage.promptTokens,
              completionTokens: usage.completionTokens,
              totalTokens: usage.promptTokens + usage.completionTokens
            };
          }
        } catch (e) {
          console.error('Error parsing alternative usage JSON:', e);
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('Error extracting token usage:', error);
      return undefined;
    }
  };

  // Custom submit handler
  const handleMessageSubmit = (value: string) => {
    if (!value.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: String(prevMessages.length + 1),
        content: value,
        sender: { name: "User", avatar: "", isOnline: true },
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      },
    ]);
    
    // Call the API directly
    callChatAPI(value);
  };

  // Handle Escape key to minimize the chat
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMaximized && onToggleMaximize) {
        onToggleMaximize()
      }
    }

    if (isMaximized) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isMaximized, onToggleMaximize])

  // Toggle selection of a context item
  const toggleContextItem = (type: 'papers' | 'variants' | 'cases', item: string) => {
    setSelectedContext(prev => {
      const currentItems = [...prev[type]];
      const index = currentItems.indexOf(item);
      
      if (index >= 0) {
        // Remove item if already selected
        currentItems.splice(index, 1);
      } else {
        // Add item if not selected
        currentItems.push(item);
      }
      
      return {
        ...prev,
        [type]: currentItems
      };
    });
  };

  // Helper function to preprocess message content for proper markdown rendering
  const preprocessMarkdown = (content: string): string => {
    if (!content) return '';
    
    // Replace escaped newlines with actual newlines
    let processed = content.replace(/\\n/g, '\n');
    
    // Replace special dividers with markdown horizontal rules
    processed = processed.replace(/─+/g, '---');
    
    // Handle section dividers (common in AI responses)
    processed = processed.replace(/^(.*?)─+$(.*?)$/gm, '## $1\n\n$2');
    
    // Ensure proper spacing for lists and headings
    processed = processed.replace(/•\s*/g, '* ');
    
    // Convert numbered lists with dot notation to markdown format
    processed = processed.replace(/(\d+)\.\s+/g, '$1. ');
    
    // Ensure headers have space after the # symbol
    processed = processed.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');
    
    // Convert sections with titles to proper markdown headers
    processed = processed.replace(/^(\d+)\.\s+([^\n]+)$/gm, '### $1. $2');
    
    // Ensure proper spacing after horizontal rules
    processed = processed.replace(/---\n([^\n])/g, '---\n\n$1');
    
    // Ensure proper spacing before horizontal rules
    processed = processed.replace(/([^\n])\n---/g, '$1\n\n---');
    
    // Handle lettered lists (a., b., etc.)
    processed = processed.replace(/^([a-z])\.\s+/gm, '* ');
    
    // Add extra newlines before headers for better spacing
    processed = processed.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
    
    return processed;
  };

  return (
    <div
      className={cn(
        "w-full mx-auto transition-all duration-300",
        isMaximized
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          : "max-w-md"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden flex flex-col",
          "bg-card text-card-foreground",
          "backdrop-blur-xl",
          "border border-border",
          "rounded-2xl",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/10",
          "hover:border-primary/20",
          isMaximized
            ? "w-[95%] h-[95%] md:w-[90%] md:h-[90%] max-w-8xl"
            : "w-full"
        )}
      >
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "flex items-center justify-center",
                    "text-primary-foreground font-medium text-sm"
                  )}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5",
                    "w-3 h-3 rounded-full",
                    "bg-emerald-500",
                    "ring-2 ring-background"
                  )}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {chatName || "AI Assistant"}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onToggleMaximize && (
                <button
                  type="button"
                  onClick={onToggleMaximize}
                  className={cn(
                    "p-2 rounded-xl",
                    "hover:bg-accent text-muted-foreground hover:text-foreground",
                    "transition-colors duration-200",
                    "relative group"
                  )}
                  aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
                >
                  {isMaximized ? (
                    <>
                      <Minimize2 className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Press ESC to exit
                      </span>
                    </>
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
              )}
              <button
                type="button"
                className={cn(
                  "p-2 rounded-xl",
                  "hover:bg-accent text-muted-foreground hover:text-foreground",
                  "transition-colors duration-200"
                )}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Context selection section */}
        {context && (Object.values(context).some(arr => arr.length > 0)) && (
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-muted-foreground">Available Context</h4>
                {selectedContext.papers.length > 0 || 
                 selectedContext.variants.length > 0 || 
                 selectedContext.cases.length > 0 ? (
                  <button
                    onClick={() => setSelectedContext({ papers: [], variants: [], cases: [] })}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear All
                  </button>
                ) : null}
              </div>
              
              {/* Context categories */}
              <div className="flex flex-wrap gap-2">
                {context.papers && context.papers.length > 0 && (
                  <div className="relative group inline-block">
                    <button
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        selectedContext.papers.length > 0
                          ? "bg-primary/20 text-primary"
                          : "bg-accent text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => {
                        const dropdown = document.getElementById('papers-dropdown');
                        if (dropdown) dropdown.classList.toggle('hidden');
                      }}
                    >
                      Papers ({selectedContext.papers.length}/{context.papers.length})
                    </button>
                    <div 
                      id="papers-dropdown"
                      className="hidden absolute left-0 mt-1 w-64 max-h-48 overflow-y-auto z-10 bg-card border border-border rounded-md shadow-lg"
                    >
                      {context.papers.map((paper, index) => (
                        <div 
                          key={`paper-${index}`}
                          className={cn(
                            "px-3 py-2 text-xs cursor-pointer hover:bg-accent",
                            selectedContext.papers.includes(paper) ? "bg-primary/10" : ""
                          )}
                          onClick={() => toggleContextItem('papers', paper)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={selectedContext.papers.includes(paper)}
                                readOnly
                                className="rounded text-primary"
                              />
                            </div>
                            <span className="line-clamp-2">{paper}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {context.variants && context.variants.length > 0 && (
                  <div className="relative group inline-block">
                    <button
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        selectedContext.variants.length > 0
                          ? "bg-primary/20 text-primary"
                          : "bg-accent text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => {
                        const dropdown = document.getElementById('variants-dropdown');
                        if (dropdown) dropdown.classList.toggle('hidden');
                      }}
                    >
                      Variants ({selectedContext.variants.length}/{context.variants.length})
                    </button>
                    <div 
                      id="variants-dropdown"
                      className="hidden absolute left-0 mt-1 w-64 max-h-48 overflow-y-auto z-10 bg-card border border-border rounded-md shadow-lg"
                    >
                      {context.variants.map((variant, index) => (
                        <div 
                          key={`variant-${index}`}
                          className={cn(
                            "px-3 py-2 text-xs cursor-pointer hover:bg-accent",
                            selectedContext.variants.includes(variant) ? "bg-primary/10" : ""
                          )}
                          onClick={() => toggleContextItem('variants', variant)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={selectedContext.variants.includes(variant)}
                                readOnly
                                className="rounded text-primary"
                              />
                            </div>
                            <span className="line-clamp-2">{variant}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {context.cases && context.cases.length > 0 && (
                  <div className="relative group inline-block">
                    <button
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium",
                        selectedContext.cases.length > 0
                          ? "bg-primary/20 text-primary"
                          : "bg-accent text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => {
                        const dropdown = document.getElementById('cases-dropdown');
                        if (dropdown) dropdown.classList.toggle('hidden');
                      }}
                    >
                      Cases ({selectedContext.cases.length}/{context.cases.length})
                    </button>
                    <div 
                      id="cases-dropdown"
                      className="hidden absolute left-0 mt-1 w-64 max-h-48 overflow-y-auto z-10 bg-card border border-border rounded-md shadow-lg"
                    >
                      {context.cases.map((caseItem, index) => (
                        <div 
                          key={`case-${index}`}
                          className={cn(
                            "px-3 py-2 text-xs cursor-pointer hover:bg-accent",
                            selectedContext.cases.includes(caseItem) ? "bg-primary/10" : ""
                          )}
                          onClick={() => toggleContextItem('cases', caseItem)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="pt-0.5">
                              <input 
                                type="checkbox" 
                                checked={selectedContext.cases.includes(caseItem)}
                                readOnly
                                className="rounded text-primary"
                              />
                            </div>
                            <span className="line-clamp-2">{caseItem}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "overflow-y-auto p-5 space-y-5 flex-grow",
            isMaximized ? "h-[calc(100%-160px)]" : "h-[350px]"
          )}
        >
          {messages.map((message) => (
            <div key={message.id} className="group/message">
              <div className="flex items-start gap-3 mb-1">
                {message.sender.name === "AI" ? (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl",
                      "bg-gradient-to-br from-primary to-primary/80",
                      "flex items-center justify-center",
                      "text-primary-foreground font-medium text-sm"
                    )}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl",
                      "bg-accent text-accent-foreground",
                      "flex items-center justify-center",
                      "font-medium text-sm"
                    )}
                  >
                    {message.sender.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-xl text-sm",
                      message.sender.name === "AI"
                        ? "bg-accent/50 text-foreground"
                        : "bg-primary/10 text-foreground"
                    )}
                  >
                    <ReactMarkdown 
                      className="markdown prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-hr:my-3 prose-hr:border-border/30 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
                      remarkPlugins={[remarkGfm]}
                    >
                      {preprocessMarkdown(message.content)}
                    </ReactMarkdown>
                    
                    {message.tokenUsage && (
                      <div className="mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                        <span>Tokens: {message.tokenUsage.completionTokens} generated | {message.tokenUsage.promptTokens} prompt | {message.tokenUsage.totalTokens} total</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {message.status === "read" && (
                    <CheckCheck className="w-4 h-4 text-primary" />
                  )}
                  {message.status === "delivered" && (
                    <Check className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {message.reactions && (
                <div className="flex items-center gap-1.5 ml-11">
                  {message.reactions.map((reaction) => (
                    <button
                      type="button"
                      key={reaction.emoji}
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs",
                        "transition-colors duration-200",
                        reaction.reacted
                          ? "bg-primary/20 text-primary"
                          : "bg-accent text-accent-foreground",
                        "hover:bg-primary/30"
                      )}
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Display streaming message in real-time */}
          {isStreaming && (
            <div className="group/message">
              <div className="flex items-start gap-3 mb-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "flex items-center justify-center",
                    "text-primary-foreground font-medium text-sm"
                  )}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">
                      AI
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {isDeepResearching && !streamingMessage ? (
                    <div className="p-3 rounded-xl bg-accent/50 text-foreground text-sm">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Search className="w-4 h-4 text-green-500 animate-pulse" />
                          <span className="font-medium">Deep Research in progress...</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Searching the web for information about {gene_name}. This may take a moment.
                        </p>
                      </div>
                    </div>
                  ) : streamingMessage ? (
                    <div className="p-3 rounded-xl bg-accent/50 text-foreground text-sm">
                      <ReactMarkdown 
                        className="markdown prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-hr:my-3 prose-hr:border-border/30 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
                        remarkPlugins={[remarkGfm]}
                      >
                        {preprocessMarkdown(streamingMessage)}
                      </ReactMarkdown>
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary/50 animate-pulse rounded-sm"></span>
                    </div>
                  ) : (
                    <div className="flex space-x-1 mt-1 p-3 rounded-xl bg-accent/50">
                      <div
                        className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border">
          <AIInput 
            onSubmit={handleMessageSubmit}
            useDeepResearch={useDeepResearch}
            setUseDeepResearch={setUseDeepResearch}
          />
        </div>
      </div>
    </div>
  )
}