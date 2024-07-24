"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CandlestickChart,
  Dna,
  Home,
  PersonStanding,
  Settings,
  TestTubeDiagonal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  const split_pathname = pathname.split("/")
  const current = split_pathname[split_pathname.length - 1]

  return (
    <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
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
                <TestTubeDiagonal className="h-5 w-5" />
                <span className="sr-only">Curations</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Curations</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/eval"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  current === "analyses" && "text-accent-foreground bg-accent"
                )}
              >
                <CandlestickChart className="h-5 w-5" />
                <span className="sr-only">Evaluations</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Evaluations</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
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
