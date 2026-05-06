import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoReadinessMetric } from "@/types/demo-readiness";

import { DemoReadinessChip } from "./demo-readiness-chip";

interface DemoReadinessMetricCardProps {
  metric: MeDemoReadinessMetric;
}

export function DemoReadinessMetricCard({ metric }: DemoReadinessMetricCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{metric.label.en}</CardDescription>
            <CardTitle className="text-2xl">{metric.value}</CardTitle>
          </div>
          <DemoReadinessChip tone={metric.tone} label={metric.tone} className="capitalize" />
        </div>
      </CardHeader>
      {metric.description ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{metric.description.en}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
