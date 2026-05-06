import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoReadinessChecklistItem } from "@/types/demo-readiness";

import { DemoReadinessChip } from "./demo-readiness-chip";

interface DemoReadinessRouteMapProps {
  items: MeDemoReadinessChecklistItem[];
}

export function DemoReadinessRouteMap({ items }: DemoReadinessRouteMapProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Presentation Route Audit</CardTitle>
        <CardDescription>Static route checklist for final ME demo-readiness verification.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.key}
            href={item.route ?? "/demo-readiness"}
            className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Stop {index + 1}</p>
                <p className="text-sm font-medium">{item.title.en}</p>
                {item.route ? <p className="text-xs text-muted-foreground">{item.route}</p> : null}
              </div>
              <DemoReadinessChip tone={item.tone} status={item.status} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
