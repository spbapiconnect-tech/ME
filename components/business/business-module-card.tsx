import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspaceModuleCard } from "@/types/business-workspace";

const statusVariant: Record<BusinessWorkspaceModuleCard["status"], "default" | "secondary" | "destructive" | "outline"> = {
  healthy: "default",
  watch: "secondary",
  risk: "destructive",
  "action-needed": "outline",
  placeholder: "outline",
};

interface BusinessModuleCardProps {
  moduleCard: BusinessWorkspaceModuleCard;
}

export function BusinessModuleCard({ moduleCard }: BusinessModuleCardProps) {
  return (
    <Card size="sm" className="h-full">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{moduleCard.title.en}</CardTitle>
          <Badge variant={statusVariant[moduleCard.status]}>{moduleCard.status}</Badge>
        </div>
        <CardDescription>{moduleCard.title.zh}</CardDescription>
        <CardDescription>{moduleCard.description.en}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {moduleCard.primaryMetric ? <p className="text-sm font-medium">{moduleCard.primaryMetric.en}</p> : null}
        {moduleCard.secondaryMetric ? <p className="text-xs text-muted-foreground">{moduleCard.secondaryMetric.en}</p> : null}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{moduleCard.description.zh}</p>
          <Button asChild size="sm" variant="outline">
            <Link href={moduleCard.route}>{moduleCard.actionLabel?.en ?? "Open"}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
