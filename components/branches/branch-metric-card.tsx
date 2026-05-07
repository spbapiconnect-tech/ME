import Link from "next/link";

import { BranchChip } from "@/components/branches/branch-chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeBranchMetric } from "@/types/branch-context";

interface BranchMetricCardProps {
  metric: MeBranchMetric;
}

export function BranchMetricCard({ metric }: BranchMetricCardProps) {
  const content = (
    <Card className="h-full border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardDescription>{metric.label.en}</CardDescription>
        <CardTitle className="text-2xl font-semibold">
          {metric.value}
          {metric.unit ? <span className="ml-2 text-sm font-normal text-muted-foreground">{metric.unit.en}</span> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>{metric.label.zh}</p>
          {metric.description ? <p>{metric.description.en}</p> : null}
        </div>
        <BranchChip label={metric.tone} tone={metric.tone} />
      </CardContent>
    </Card>
  );

  if (!metric.route) {
    return content;
  }

  return (
    <Link href={metric.route} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {content}
    </Link>
  );
}
