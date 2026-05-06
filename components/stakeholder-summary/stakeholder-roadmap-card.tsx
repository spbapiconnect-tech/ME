import Link from "next/link";

import { StakeholderSummaryChip } from "@/components/stakeholder-summary/stakeholder-summary-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeStakeholderRoadmapItem, MeStakeholderSummaryTone } from "@/types/stakeholder-summary";

interface StakeholderRoadmapCardProps {
  item: MeStakeholderRoadmapItem;
}

const statusToneMap: Record<MeStakeholderRoadmapItem["status"], MeStakeholderSummaryTone> = {
  completed: "success",
  "in-progress": "warning",
  planned: "info",
  future: "muted",
  placeholder: "danger",
};

export function StakeholderRoadmapCard({ item }: StakeholderRoadmapCardProps) {
  const tone = statusToneMap[item.status];

  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{item.title.en}</CardTitle>
            <CardDescription>{item.description.en}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <StakeholderSummaryChip label={item.status} tone={tone} />
            {item.tag ? <StakeholderSummaryChip label={item.tag} tone="muted" /> : null}
          </div>
        </div>
      </CardHeader>
      {item.route ? (
        <CardContent>
          <Button asChild size="sm" variant="outline">
            <Link href={item.route}>Open Route</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
