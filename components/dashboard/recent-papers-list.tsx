"use client"

import { ExternalLink } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RecentPapersListProps {
  data: any[]
}

export function RecentPapersList({ data }: RecentPapersListProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Papers</CardTitle>
          <CardDescription>Latest papers added to the system</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No papers available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Papers</CardTitle>
        <CardDescription>Latest papers added to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((paper) => (
            <div key={paper.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-medium text-sm line-clamp-2">{paper.title}</h3>
                {paper.doi && (
                  <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                    <a 
                      href={`https://doi.org/${paper.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="View paper"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-2">
                <span>{paper.first_author}</span>
                {paper.year && <span>• {paper.year}</span>}
                {paper.doi && <span className="truncate">• DOI: {paper.doi}</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 