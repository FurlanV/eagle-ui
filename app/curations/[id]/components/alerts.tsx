// gendex-ui/app/curations/[id]/components/Alerts.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AlertsProps {
  errorMessage?: string;
  childrenError?: boolean;
}

export const Alerts: React.FC<AlertsProps> = ({ errorMessage, childrenError }) => {
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Occurred</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {childrenError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Fetch Error</AlertTitle>
          <AlertDescription>
            Unable to fetch children data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};