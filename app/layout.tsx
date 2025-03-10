"use client"

import "@/styles/globals.css"
import StoreProvider from "@/store/store-provider"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable
        )}
      >
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-1 flex-row">
              <Sidebar />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
