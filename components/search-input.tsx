"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { GearIcon, ReaderIcon, RocketIcon } from "@radix-ui/react-icons"
import _ from "lodash"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

export function SearchInput() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const [query, setQuery] = useState("")
  const [queryResults, setQueryResults] = useState([])

  const searchAPI = async (query: string): Promise<any> => {
    const res = await fetch(`/api/search?keyword=${query}`)
    const json = await res.json()
    return json.data
  }

  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query) => {
        if (query.length >= 3) {
          // Check for minimum character limit
          const fetchedResults = await searchAPI(query) // Your API call function
          setQueryResults(fetchedResults)
        }
      }, 500),
    []
  )

  useEffect(() => {
    if (query) {
      debouncedSearch(query)
    }
  }, [query, debouncedSearch])

  const getAttributeToShow = (item: any, type: any, index: number) => {
    // Example of selecting attributes based on the type
    switch (type) {
      case "trait":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <span>{item.name}</span>
              <p className="text-xs text-muted-foreground">
                [{type.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      case "gene":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <Link href={`/gene/${item.canonical_name}`}>
                {item.canonical_name}
              </Link>
              <p className="text-xs text-muted-foreground">
                [{type.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      case "paper":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <span>{item.title.substring(0, 50)}</span>
              <p className="text-xs text-muted-foreground">
                [{item.doi.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      case "report":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <span>{item.study_summary.substring(0, 50)}</span>
              <p className="text-xs text-muted-foreground">
                [{type.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      case "chromosome":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <span>{"Chromosome " + item.name}</span>
              <p className="text-xs text-muted-foreground">
                [{type.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      case "variant":
        return (
          <CommandItem key={index}>
            <ReaderIcon className="mr-2 h-4 w-4" />
            <div className="flex flex-row gap-2 items-center">
              {/* Dynamic attribute rendering based on result type */}
              <span>{item.variant}</span>
              <p className="text-xs text-muted-foreground">
                [{type.toUpperCase()}]
              </p>
            </div>
          </CommandItem>
        )
      default:
        return
    }
  }

  return (
    <div className="relative flex flex-row bg-muted w-1/2 items-center rounded-lg h-12">
      <Command className="flex flex-row bg-muted items-center p-2">
        <Icons.search className="h-6 w-6 text-muted-foreground" />

        <Input
          className="bg-muted border-none ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          placeholder="Search for a gene/keyword"
          onClick={() => setIsExpanded(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="mr-2 bg-primary-foreground gap-2"
            >
              <Icons.filters className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Filter search by:
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex flex-row items-center gap-4 justify-between">
                  <Badge>Chromosome</Badge>
                  <Checkbox id="chromosome" />
                </div>
                <div className="flex flex-row items-center gap-4 justify-between">
                  <Badge>Gene</Badge>
                  <Checkbox id="gene" />
                </div>
                <div className="flex flex-row items-center gap-4 justify-between">
                  <Badge>Variant</Badge>
                  <Checkbox id="variant" />
                </div>
                <div className="flex flex-row items-center gap-4 justify-between">
                  <Badge>Paper</Badge>
                  <Checkbox id="paper" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="default">
          <Icons.search className="h-4 w-4" />
        </Button>
        {isExpanded && (
          <CommandList
            className="absolute top-14 left-0 w-full bg-background"
            onMouseLeave={() => setIsExpanded(false)}
          >
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.keys(queryResults).map((key: any) => {
              if (!queryResults[key].length) return null
              return (
                <CommandGroup key={key} heading={key}>
                  {queryResults[key].map((result: any, index: number) =>
                    getAttributeToShow(result, key, index)
                  )}
                </CommandGroup>
              )
            })}
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
