import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ScoreRationaleProps {
  scoreRationale?: string;
}

export const ScoreRationale: React.FC<ScoreRationaleProps> = ({ scoreRationale }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Score Rationale</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {scoreRationale || "No score rationale available."}
        </p>
      </CardContent>
    </Card>
  );
};