"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Dna, Home, Settings, TestTubeDiagonal } from "lucide-react"

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

  if (current === "login") {
    return null
  }

  return (
    <aside className="flex flex-col z-10 w-14 flex-col border-r bg-background">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Dna className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">EAGLE</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  current === "" && "text-accent-foreground bg-accent"
                )}
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/curations"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  current === "curations" && "text-accent-foreground bg-accent"
                )}
              >
                <Dna className="h-5 w-5" />
                <span className="sr-only">Genes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Genes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/papers"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  current === "papers" && "text-accent-foreground bg-accent"
                )}
              >
                <Book className="h-5 w-5" />
                <span className="sr-only">Papers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Papers</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <NewJobDialog />
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
