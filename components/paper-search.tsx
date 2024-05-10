import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PaperSearch({ searchedPapers }: any) {
  return (
    <div>
      {searchedPapers.map((paper: any, idx) => {
        return (
          <Card key={idx} className="z-20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {paper.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-md font-bold">
                {paper.abstract ? paper.abstract.slice(0, 100) + "..." : ""}
              </div>
              <p className="text-sm text-muted-foreground">
                {paper.pmid ? paper.pmid : paper.doi ? paper.doi : ""}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
