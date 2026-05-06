import Link from "next/link";

import { RoleChip } from "@/components/roles/role-chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeRoleWorkspaceMetric } from "@/types/role-workspace";

interface RoleMetricCardProps {
  metric: MeRoleWorkspaceMetric;
}

export function RoleMetricCard({ metric }: RoleMetricCardProps) {
  const content = (
    <Card size="sm" className="h-full border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardDescription>{metric.label.en}</CardDescription>
        <CardTitle className="text-2xl font-semibold">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>{metric.label.zh}</p>
          {metric.description ? <p>{metric.description.en}</p> : null}
        </div>
        <RoleChip label={metric.tone} tone={metric.tone} />
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
