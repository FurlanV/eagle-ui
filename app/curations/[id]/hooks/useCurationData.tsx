// gendex-ui/app/curations/[id]/hooks/useCurationData.ts
import { useState, useEffect } from "react";
import { useGetTaskChildrenQuery, useGetTaskInfoQuery } from "@/services/tasks";
import { Task } from "@/types/eagle-job";
import { InsightMetrics, WordCount } from "../types";

export const useCurationData = (selectedJob: Task | undefined) => {
  const [stopPolling, setStopPolling] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>();
  const [selectedFile, setSelectedFile] = useState<Task | null>(null);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalFinalScore, setTotalFinalScore] = useState(0);
  const [variantWordCounts, setVariantWordCounts] = useState<Record<string, number>>({});
  const [evidenceTypeCounts, setEvidenceTypeCounts] = useState<Record<string, number>>({});
  const [otherInsights, setOtherInsights] = useState<InsightMetrics>({
    totalReports: 0,
    averageScore: 0,
  });

  const { data: childrenData, isLoading: isChildrenLoading, error: childrenError } =
    useGetTaskChildrenQuery(selectedJob?.id, {
      skip: !selectedJob,
      refetchOnMountOrArgChange: true,
      pollingInterval: stopPolling ? undefined : 10000,
    });

  const allTasksCompleted =
    childrenData?.length > 0 &&
    childrenData.every((task: Task) =>
      task.steps?.every(
        (step) => step.status === "completed" || step.status === "failed"
      )
    );

  useEffect(() => {
    setLastUpdateTime(new Date());
    if (allTasksCompleted) {
      setStopPolling(true);
    }

    if (childrenData) {
      // Sum the final_score of all reports
      const totalScore = childrenData.reduce((sum, task) => {
        const taskTotal = task.reports?.reduce(
          (taskSum: number, report: any) => taskSum + report.final_score,
          0
        );
        return sum + (taskTotal || 0);
      }, 0);
      setTotalFinalScore(totalScore);

      // Extract variants and count occurrences
      const variantCounts: Record<string, number> = {};
      childrenData.forEach((task) => {
        task.reports?.forEach((report: any) => {
          const variant = report.variant;
          if (variant) {
            variantCounts[variant] = (variantCounts[variant] || 0) + 1;
          }
        });
      });
      setVariantWordCounts(variantCounts);

      // Extract evidence types and count occurrences
      const evidenceCounts: Record<string, number> = {};
      childrenData.forEach((task) => {
        task.reports?.forEach((report: any) => {
          const evidenceType = report.evidence_type;
          if (evidenceType) {
            evidenceCounts[evidenceType] =
              (evidenceCounts[evidenceType] || 0) + 1;
          }
        });
      });
      setEvidenceTypeCounts(evidenceCounts);

      // Generate other insights based on the data
      const totalReports = childrenData.reduce(
        (sum, task) => sum + (task.reports?.length || 0),
        0
      );
      const averageScore = totalReports ? totalScore / totalReports : 0;
      setOtherInsights({
        totalReports,
        averageScore,
      });
    }
  }, [childrenData, allTasksCompleted]);

  const { data: taskInfo, isLoading: isTaskInfoLoading } = useGetTaskInfoQuery(
    selectedFile?.id,
    {
      skip: !selectedFile,
      refetchOnMountOrArgChange: true,
      pollingInterval: allTasksCompleted ? undefined : 3000,
    }
  );

  return {
    childrenData,
    isChildrenLoading,
    childrenError,
    allTasksCompleted,
    totalFinalScore,
    variantWordCounts,
    evidenceTypeCounts,
    otherInsights,
    selectedFile,
    setSelectedFile,
    showFileDetails,
    setShowFileDetails,
    searchTerm,
    setSearchTerm,
    taskInfo,
    isTaskInfoLoading,
    lastUpdateTime,
    setLastUpdateTime,
    setStopPolling,
  };
};