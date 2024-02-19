"use client"

import { useState } from "react"
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  ReaderIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function SearchBar({ className }: any) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  return (
    <div className="relative w-full">
      <Command>
        <CommandInput
          placeholder="Enter a Gene/Keyword"
          onClick={() => setIsExpanded(true)}
          className={cn(className)}
        />
        {isExpanded && (
          <CommandList
            className="absolute top-14 w-full bg-background"
            onMouseLeave={() => setIsExpanded(false)}
          >
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <ReaderIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-row gap-2 items-center">
                  <span>DMD</span>
                  <p className="text-xs text-muted-foreground">[Gene]</p>
                </div>
              </CommandItem>
              <CommandItem>
                <ReaderIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-row gap-2 items-center">
                  <span>PPP2R3B</span>
                  <p className="text-xs text-muted-foreground">[Gene]</p>
                </div>
              </CommandItem>
              <CommandItem>
              <ReaderIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-row gap-2 items-center">
                  <span>Autism</span>
                  <p className="text-xs text-muted-foreground">[Trait]</p>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <RocketIcon className="mr-2 h-4 w-4" />
                <span>Upload Paper</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  )
}
