"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Dna, Home, ChevronRight } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NewJobDialog } from "@/components/new-job-dialog"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  const split_pathname = pathname.split("/")
  const current = split_pathname[split_pathname.length - 1]
  const [isCollapsed, setIsCollapsed] = useState(true)

  if (current === "login") {
    return null
  }

  return (
    <aside 
      className={cn(
        "flex flex-col z-10 flex-col border-r bg-background/95 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out relative group overflow-hidden",
        isCollapsed ? "w-16" : "w-48"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div 
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-full p-1 cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronRight className={cn("h-4 w-4 transition-transform", !isCollapsed && "rotate-180")} />
      </div>
      
      <TooltipProvider>
        <nav className={cn(
          "flex flex-col items-center gap-5 px-2 pt-6",
          !isCollapsed && "items-start"
        )}>
          <div className={cn(
            "flex items-center justify-center w-full",
            !isCollapsed && "justify-start px-3"
          )}>
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-primary-foreground transition-all hover:scale-105 md:h-9 md:w-9 md:text-base"
            >
              <Dna className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">EAGLE</span>
            </Link>
            {!isCollapsed && (
              <span className="ml-3 font-semibold text-lg">EAGLE</span>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-3 w-full">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground md:h-9 md:w-9",
                      current === "" && "bg-accent text-accent-foreground font-medium shadow-sm"
                    )}
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/"
                className={cn(
                  "flex h-10 w-full items-center px-3 gap-3 rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground",
                  current === "" && "bg-accent text-accent-foreground font-medium shadow-sm"
                )}
              >
                <Home className="h-5 w-5 shrink-0" />
                <span>Dashboard</span>
              </Link>
            )}
            
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/curations"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground md:h-9 md:w-9",
                      current === "curations" && "bg-accent text-accent-foreground font-medium shadow-sm"
                    )}
                  >
                    <Dna className="h-5 w-5" />
                    <span className="sr-only">Genes</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Genes</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/curations"
                className={cn(
                  "flex h-10 w-full items-center px-3 gap-3 rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground",
                  current === "curations" && "bg-accent text-accent-foreground font-medium shadow-sm"
                )}
              >
                <Dna className="h-5 w-5 shrink-0" />
                <span>Genes</span>
              </Link>
            )}
            
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/papers"
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground md:h-9 md:w-9",
                      current === "papers" && "bg-accent text-accent-foreground font-medium shadow-sm"
                    )}
                  >
                    <Book className="h-5 w-5" />
                    <span className="sr-only">Papers</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Papers</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/papers"
                className={cn(
                  "flex h-10 w-full items-center px-3 gap-3 rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground",
                  current === "papers" && "bg-accent text-accent-foreground font-medium shadow-sm"
                )}
              >
                <Book className="h-5 w-5 shrink-0" />
                <span>Papers</span>
              </Link>
            )}
          </div>
        </nav>
        
        <div className={cn(
          "h-px bg-border/50 mx-auto my-6",
          isCollapsed ? "w-8" : "w-[calc(100%-24px)]"
        )}></div>
        
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 pb-6 w-full">
          {isCollapsed ? (
            <>
              <NewJobDialog />
              <ThemeToggle />
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground md:h-9 md:w-9"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip> */}
            </>
          ) : (
            <>
              <div className="w-full px-3 flex items-center gap-3">
                <NewJobDialog />
                <span className="text-sm">Upload Paper</span>
              </div>
              <div className="w-full px-3 flex items-center gap-3">
                <ThemeToggle />
                <span className="text-sm">Toggle theme</span>
              </div>
              {/* <Link
                href="#"
                className="flex h-10 w-full items-center px-3 gap-3 rounded-lg text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground"
              >
                <Settings className="h-5 w-5 shrink-0" />
                <span>Settings</span>
              </Link> */}
            </>
          )}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
