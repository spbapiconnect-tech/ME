import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspaceMetric } from "@/types/business-workspace";

const toneVariant: Record<BusinessWorkspaceMetric["tone"], "default" | "secondary" | "destructive" | "outline"> = {
  neutral: "secondary",
  info: "default",
  success: "default",
  warning: "outline",
  danger: "destructive",
  muted: "outline",
};

interface BusinessKpiCardProps {
  metric: BusinessWorkspaceMetric;
}

export function BusinessKpiCard({ metric }: BusinessKpiCardProps) {
  const unit = metric.unit ? ` ${metric.unit.en}` : "";
  const content = (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-1">
        <CardDescription>{metric.label.en}</CardDescription>
        <CardTitle className="text-2xl font-semibold">
          {metric.value}
          <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <p className="text-xs text-muted-foreground">{metric.label.zh}</p>
        <Badge variant={toneVariant[metric.tone]}>{metric.tone}</Badge>
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
