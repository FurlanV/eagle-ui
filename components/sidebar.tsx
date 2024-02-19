"use client"

import { useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Icons } from "./icons"

export function Sidebar({ className }: any) {
  const [active, setActive] = useState<any>()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const handleButtonClick = (buttonName: string) => {
    setActive(buttonName)
  }

  return (
    <div
      className={cn(
        `pb-12 border-r transition-all duration-500 ease-in-out ${
          isExpanded ? "w-[230px]" : "w-[80px]"
        }`,
        className
      )}
      onMouseOver={() => setIsExpanded(true)}
      onMouseOut={() => setIsExpanded(false)}
    >
      <div className="sticky top-0 bg-background flex items-center justify-center h-16 border-b">
        <Link href="/" className="flex items-center">
          <Icons.database className="h-10 w-10" />
          {isExpanded && (
            <span className="inline-block font-bold">{siteConfig.name}</span>
          )}
        </Link>
      </div>
      {isExpanded ? (
        <div className="grid grid-rows-4 h-[calc(100vh-95px)]">
          <div className="grid row-start-1 row-span-2 px-3 py-2">
            <div className="space-y-1 divide-y-reverse">
              <Button
                variant={active === "Inbox" ? "outline" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Inbox")}
              >
                <Icons.search className="mr-2 h-4 w-4" />
                <Link href="/">Search</Link>
              </Button>
              <Button
                variant={active === "Inbox" ? "outline" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Inbox")}
              >
                <Icons.upload className="mr-2 h-4 w-4" />
                <Link href="/">Upload paper</Link>
              </Button>
            </div>
            <div className="space-y-1">
              <Button
                variant={active === "Inbox" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Inbox")}
              >
                <Icons.dna className="mr-2 h-4 w-4" />
                <Link href="/">Chromosomes</Link>
              </Button>
              <Button
                variant={active === "Projects" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Projects")}
              >
                <Icons.dna className="mr-2 h-4 w-4" />
                <Link href="/projects">Genes</Link>
              </Button>
              <Button
                variant={active === "Knowledge Base" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Knowledge Base")}
              >
                <Icons.dna className="mr-2 h-4 w-4" />
                <Link className="text-start" href="/knowledge-base">
                  Traits
                </Link>
              </Button>
              <Button
                variant={active === "Knowledge Base" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleButtonClick("Knowledge Base")}
              >
                <Icons.database className="mr-2 h-4 w-4" />
                <Link className="text-start" href="/knowledge-base">
                  Scoring
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-row-3 row-span-2 p-2 self-end">
            <div className="border" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-2 gap-2">
          <Button variant="outline" className="w-full">
            <Icons.dna className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full">
            <Icons.dna className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full">
            <Icons.dna className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full">
            <Icons.database className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
