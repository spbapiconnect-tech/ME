import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StakeholderSummaryChip } from "@/components/stakeholder-summary/stakeholder-summary-chip";
import type { MeStakeholderSummaryMetric } from "@/types/stakeholder-summary";

interface StakeholderMetricCardProps {
  metric: MeStakeholderSummaryMetric;
}

export function StakeholderMetricCard({ metric }: StakeholderMetricCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{metric.label.en}</CardDescription>
          <StakeholderSummaryChip label={metric.tone} tone={metric.tone} />
        </div>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      {metric.description ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{metric.description.en}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
