import Link from "next/link";

import { StakeholderSummaryChip } from "@/components/stakeholder-summary/stakeholder-summary-chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeStakeholderDemoRoute } from "@/types/stakeholder-summary";

interface StakeholderDemoRouteMapProps {
  routes: MeStakeholderDemoRoute[];
}

export function StakeholderDemoRouteMap({ routes }: StakeholderDemoRouteMapProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Demo Route Map</CardTitle>
        <CardDescription>Presentation-ready route sequence with direct links and no tracking, sharing, or session state.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {routes.map((route, index) => (
          <Link
            key={route.key}
            href={route.route}
            className="rounded-2xl border border-border/70 bg-background/80 p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Stop {index + 1}</p>
                <p className="text-sm font-medium">{route.title.en}</p>
                <p className="text-xs text-muted-foreground">{route.route}</p>
              </div>
              <StakeholderSummaryChip label={route.tone} tone={route.tone} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{route.description.en}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
