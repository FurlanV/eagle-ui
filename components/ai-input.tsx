"use client"

import { useState } from "react"
import {
  ArrowRight,
  Brain,
  Mic,
  Paperclip,
  Search,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { Textarea } from "@/components/ui/textarea"

interface ToolbarButton {
  icon: LucideIcon
  onClick?: () => void
  className: string | ((isRecording: boolean) => string)
  isFileInput?: boolean
  isRecording?: boolean
}

export default function AIInput({
  onSubmit,
  useDeepResearch,
  setUseDeepResearch,
  useMemory,
  setUseMemory,
}: {
  onSubmit?: (value: string) => void
  useDeepResearch?: boolean
  setUseDeepResearch?: (value: boolean) => void
  useMemory?: boolean
  setUseMemory?: (value: boolean) => void
}) {
  const [value, setValue] = useState("")
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 96,
    maxHeight: 300,
  })
  const [localUseMemory, setLocalUseMemory] = useState(false)
  const effectiveUseMemory = useMemory !== undefined ? useMemory : localUseMemory
  const effectiveSetUseMemory = setUseMemory || setLocalUseMemory
  const [isRecording, setIsRecording] = useState(false)

  const TOOLBAR_BUTTONS: ToolbarButton[] = [
    {
      icon: Mic,
      onClick: () => setIsRecording(!isRecording),
      className: (isRecording: boolean) =>
        cn(
          "rounded-lg p-2 transition-all",
          isRecording
            ? "bg-red-500 text-white"
            : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
        ),
      isRecording,
    },
    {
      icon: Paperclip,
      isFileInput: true,
      className: "rounded-lg p-2 bg-black/5 dark:bg-white/5",
    },
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && onSubmit) {
        onSubmit(value)
        setValue("")
        adjustHeight()
      }
    }
  }

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value)
      setValue("")
      adjustHeight()
    }
  }

  return (
    <div className="w-full p-2">
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        {/* Toggles section */}
        <div className="flex items-center justify-start gap-4 mb-3">
          <button
            type="button"
            onClick={() => effectiveSetUseMemory(!effectiveUseMemory)}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Brain
              className={cn(
                "w-3.5 h-3.5",
                effectiveUseMemory
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-muted-foreground"
              )}
            />
            <span>Memory</span>
            <div
              className={cn(
                "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
                effectiveUseMemory ? "bg-blue-500 dark:bg-blue-400" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute h-3 w-3 transform rounded-full bg-white transition-transform",
                  effectiveUseMemory ? "translate-x-3.5" : "translate-x-0.5"
                )}
              />
            </div>
          </button>

          {/* Deep Research toggle */}
          {setUseDeepResearch !== undefined && (
            <button
              type="button"
              onClick={() => setUseDeepResearch(!useDeepResearch)}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search
                className={cn(
                  "w-3.5 h-3.5",
                  useDeepResearch
                    ? "text-green-500 dark:text-green-400"
                    : "text-muted-foreground"
                )}
              />
              <span>Deep Research</span>
              <div
                className={cn(
                  "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
                  useDeepResearch
                    ? "bg-green-500 dark:bg-green-400"
                    : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute h-3 w-3 transform rounded-full bg-white transition-transform",
                    useDeepResearch ? "translate-x-3.5" : "translate-x-0.5"
                  )}
                />
              </div>
            </button>
          )}
        </div>

        {/* Input area */}
        <div className="relative bg-muted/30 rounded-xl overflow-hidden border border-border/50">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
              <Textarea
                id="ai-input-15"
                value={value}
                placeholder={
                  isRecording ? "Listening..." : "What would you like to know?"
                }
                className={cn(
                  "w-full px-4 py-3 bg-transparent border-none dark:text-white placeholder:text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[96px]"
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setValue(e.target.value)
                  adjustHeight()
                }}
              />
            </div>

            {/* Toolbar area */}
            <div className="h-12 bg-muted/40 border-t border-border/50">
              <div className="h-full px-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {TOOLBAR_BUTTONS.map((button, index) =>
                    button.isFileInput ? (
                      <label
                        key={index}
                        className={cn(
                          typeof button.className === "string"
                            ? button.className
                            : button.className(isRecording),
                          "flex items-center justify-center"
                        )}
                      >
                        <input type="file" className="hidden" />
                        <button.icon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </label>
                    ) : (
                      <button
                        key={index}
                        type="button"
                        onClick={button.onClick}
                        className={cn(
                          typeof button.className === "string"
                            ? button.className
                            : button.className(isRecording),
                          "flex items-center justify-center"
                        )}
                      >
                        <button.icon className="w-4 h-4" />
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  className={cn(
                    "rounded-lg p-2 bg-primary text-primary-foreground transition-all",
                    !value.trim() && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Optional disclaimer */}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground justify-center">
          <TriangleAlert className="w-3 h-3" />
          <span>AI responses may not always be accurate.</span>
        </div>
      </div>
    </div>
  )
}
