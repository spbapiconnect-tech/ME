import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoReadinessChecklistItem } from "@/types/demo-readiness";

import { DemoReadinessChip } from "./demo-readiness-chip";

interface DemoReadinessChecklistCardProps {
  item: MeDemoReadinessChecklistItem;
}

export function DemoReadinessChecklistCard({ item }: DemoReadinessChecklistCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm">{item.title.en}</CardTitle>
            <CardDescription>{item.description.en}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <DemoReadinessChip tone={item.tone} status={item.status} />
            {item.isPlaceholder ? <DemoReadinessChip tone="muted" label="Static" /> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {item.evidence.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Evidence</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {item.evidence.map((entry) => (
                <p key={`${item.key}-${entry.en}`} className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
                  {entry.en}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {item.relatedRoutes.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Related Routes</p>
            <div className="flex flex-wrap gap-2">
              {item.relatedRoutes.map((route) => (
                <Link
                  key={`${item.key}-${route}`}
                  href={route}
                  className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  {route}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {item.route ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
            Primary route: <Link href={item.route} className="font-medium text-foreground underline-offset-4 hover:underline">{item.route}</Link>
          </div>
        ) : null}

        {item.notes ? <p className="text-sm text-muted-foreground">{item.notes.en}</p> : null}
      </CardContent>
    </Card>
  );
}
