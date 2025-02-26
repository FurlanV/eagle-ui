import { useEffect, useRef, useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import {
  Check,
  CheckCheck,
  MoreHorizontal,
  Send,
  SmilePlus,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

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
}

interface AIChatCardProps {
  chatName?: string
  predefinedMessages?: Message[]
  gene_name: string
}

export default function AIChatCard({
  chatName,
  predefinedMessages = [],
  gene_name,
}: AIChatCardProps) {
  const [messages, setMessages] = useState<Message[]>([...predefinedMessages])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
    error,
  } = useCompletion({
    api: "/eagle/api/chat",
    body: {
      gene_name,
    },
  })

  const [streamingMessage, setStreamingMessage] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState<boolean>(false)

  // Scroll to bottom whenever messages change or streaming content updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  // Handle streaming completion
  useEffect(() => {
    if (isLoading) {
      // Start streaming
      if (!isStreaming) {
        setIsStreaming(true)
        setStreamingMessage("")
      }

      // Update the streaming message
      setStreamingMessage(completion)
    } else if (isStreaming && completion) {
      // Streaming finished, add the complete message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: String(prevMessages.length + 1),
          content: completion,
          sender: { name: "AI", avatar: "", isOnline: true },
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sent",
        },
      ])

      // Reset streaming state
      setIsStreaming(false)
      setStreamingMessage("")
    }
  }, [isLoading, completion, isStreaming])

  // Custom submit handler
  const handleMessageSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: String(prevMessages.length + 1),
        content: input,
        sender: { name: "User", avatar: "", isOnline: true },
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      },
    ])

    // Submit to AI
    handleSubmit()
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleMessageSubmit()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-card text-card-foreground",
          "backdrop-blur-xl",
          "border border-border",
          "rounded-2xl",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/10",
          "hover:border-primary/20"
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

        <div className="h-[350px] overflow-y-auto p-5 space-y-5">
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
                    {message.content}
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
                  {streamingMessage ? (
                    <div className="p-3 rounded-xl bg-accent/50 text-foreground text-sm">
                      {streamingMessage}
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

        <div className="p-4 border-t border-border">
          <form
            onSubmit={handleMessageSubmit}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Write a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full px-4 py-2.5 pr-10",
                  "bg-accent/50",
                  "border border-input",
                  "rounded-xl",
                  "text-sm text-foreground",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                  "transition-all duration-200"
                )}
              />
              <button
                type="button"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  "p-1.5 rounded-lg",
                  "hover:bg-accent text-muted-foreground hover:text-foreground",
                  "transition-colors duration-200"
                )}
              >
                <SmilePlus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              className={cn(
                "p-2.5 rounded-xl",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              )}
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
