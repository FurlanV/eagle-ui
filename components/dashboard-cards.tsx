import { useGetBasicReportInfoQuery } from "@/services/eagle/reports"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Icons } from "./icons"

export function DashboardCards() {
  const { data, isLoading, isFetching } = useGetBasicReportInfoQuery()
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Genes</CardTitle>
          <Icons.testTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.genes}</div>
          <p className="text-xs text-muted-foreground"></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Variants</CardTitle>
          <Icons.testTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.variants}</div>
          <p className="text-xs text-muted-foreground"></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Papers</CardTitle>
          <Icons.testTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.papers}</div>
          <p className="text-xs text-muted-foreground"></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviewed Cases</CardTitle>
          <Icons.testTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.reports}</div>
          <p className="text-xs text-muted-foreground"></p>
        </CardContent>
      </Card>
    </div>
  )
}
