// gendex-ui/app/curations/[id]/components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Task } from "@/types/eagle-job";

interface HeaderProps {
  selectedJob: Task | undefined;
  allTasksCompleted: boolean;
  lastUpdateTime?: Date;
}

export const Header: React.FC<HeaderProps> = ({
  selectedJob,
  allTasksCompleted,
  lastUpdateTime,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/curations")}
          className="mr-2"
          aria-label="Go back to curations list"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Curations
        </Button>
        <h1 className="text-3xl font-bold">{selectedJob?.task_name}</h1>
      </div>
      <div className="flex flex-wrap items-center space-x-2">
        <Badge
          variant={allTasksCompleted ? "success" : "warning"}
          className="flex items-center space-x-2"
        >
          {allTasksCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>In Progress</span>
            </>
          )}
        </Badge>
        <Badge className="flex items-center space-x-2">
          <span>Real-time updates</span>
          {!allTasksCompleted ? (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </Badge>
        {lastUpdateTime && (
          <Badge className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{`Updated: ${lastUpdateTime.toLocaleTimeString()}`}</span>
          </Badge>
        )}
      </div>
    </div>
  );
};