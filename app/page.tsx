"use client"

import {
  useGetFinalScorePerGeneQuery,
  useGetSankeyDataQuery,
} from "@/services/eagle/reports"
import { ParentSize, ScaleSVG } from "@visx/responsive"

import { useAppSelector } from "@/lib/hooks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardCards } from "@/components/dashboard-cards"
import { GeneScoresChart } from "@/components/gene-scores-chart"
import { Icons } from "@/components/icons"
import { SankeyChart } from "@/components/sankey-chart"
import { SearchInput } from "@/components/search-input"

export default function IndexPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading, isFetching } = useGetFinalScorePerGeneQuery()
  const {
    data: sankeyData,
    isLoading: isSankeyLoading,
    isFetching: isSankeyFetching,
  } = useGetSankeyDataQuery()

  return (
    <AuthWrapper>
      <main className="flex flex-row">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full">
            <section className="flex flex-row items-center w-full p-3">
              <div className="w-full justify-between flex flex-row items-center">
                <SearchInput />
                <div className="flex flex-row gap-2">
                  <Button variant="ghost" size="icon">
                    <Icons.bell className="h-6 w-6 text-muted-foreground" />
                  </Button>
                </div>
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-row gap-4 w-18 ml-4">
                <Avatar>
                  <AvatarFallback>
                    {user?.name[0]}
                    {user?.surname[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </section>
            <Separator orientation="horizontal" />
            <section className="flex flex-col w-full p-4 gap-2 col-span-2">
              <div className="gap-2 flex flex-row justify-between items-center w-full">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <h4 className="text-sm text-md">
                    Hello, {user?.name}! Welcome back
                  </h4>
                </div>
              </div>
              <DashboardCards />
            </section>
            <Separator orientation="horizontal" />
            <section className="grid grid-cols-12 h-full">
              <div className="col-span-8 p-4">
                <Card>
                  <CardContent className="h-[900px]">
                    <CardHeader>
                      <CardTitle>Gene Variant Flow</CardTitle>
                    </CardHeader>
                    <ParentSize>
                      {({ width, height }) => (
                        <ScaleSVG width={width} height={height}>
                          <SankeyChart
                            data={
                              sankeyData ?? { nodes: [], links: [] }
                            }
                            width={width}
                            height={height}
                          />
                        </ScaleSVG>
                      )}
                    </ParentSize>

                    {/* {!isSankeyLoading && sankeyData && (
                      <ScaleSVG width={1080} height={750}>
                        <SankeyChart
                          data={sankeyData}
                          width={1080}
                          height={750}
                        />
                      </ScaleSVG>
                    )} */}
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col col-span-4 row-span-4 p-4 gap-2">
                <GeneScoresChart data={isLoading ? [] : data} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </AuthWrapper>
  )
}
