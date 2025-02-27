"use client"

import { useGetDashboardStatsQuery } from "@/services/eagle/reports"

import { useAppSelector } from "@/lib/hooks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Icons } from "@/components/icons"
import { SearchInput } from "@/components/search-input"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TopGenesChart } from "@/components/dashboard/top-genes-chart"
import { TopVariantsChart } from "@/components/dashboard/top-variants-chart"
import { ScoreDistributionChart } from "@/components/dashboard/score-distribution-chart"
import { RecentPapersList } from "@/components/dashboard/recent-papers-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function IndexPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading } = useGetDashboardStatsQuery()

  console.log(data)

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
            <section className="flex flex-col w-full p-4 gap-4">
              <div className="gap-2 flex flex-row justify-between items-center w-full">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <h4 className="text-sm text-md">
                    Hello, {user?.name}! Welcome to the EAGLE Dashboard
                  </h4>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <StatsCards data={data?.counts || {}} />
              )}
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {isLoading ? (
                <>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <TopGenesChart data={data?.top_genes || []} />
                  <TopVariantsChart data={data?.top_variants || []} />
                </>
              )}
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {isLoading ? (
                <>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <Skeleton className="h-full w-full" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <ScoreDistributionChart data={data?.score_distribution || []} />
                  <RecentPapersList data={data?.recent_papers || []} />
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </AuthWrapper>
  )
}
