import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { JobStatus } from "@/types/eagle-job"

interface JobStatusCardProps {
  jobStatus: JobStatus
}

export function JobStatusCard({ jobStatus }: JobStatusCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-2">
          {jobStatus && Object.entries(jobStatus).map(([service, { status, progress }]) => (
            <div key={service} className="flex items-center gap-4">
              <span className="font-medium">{service}:</span>
              <span className={cn("text-gray-600", status === "Done" && "text-green-600")}>
                {status}
              </span>
              {progress && <Progress value={progress} className="w-1/2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}