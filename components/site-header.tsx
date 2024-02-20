'use client'
 
import { usePathname } from 'next/navigation'

import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

import { TopBarSearch } from "./top-bar-search"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-8">
        <MainNav items={siteConfig.mainNav} />
        {pathname !== '/' && (
          <TopBarSearch
            className="w-full mt-2"
            placeholder="Enter Gene / Keyword"
          />
        )}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
