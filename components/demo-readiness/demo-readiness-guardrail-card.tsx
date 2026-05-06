import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoReadinessChecklistItem } from "@/types/demo-readiness";

import { DemoReadinessChip } from "./demo-readiness-chip";

interface DemoReadinessGuardrailCardProps {
  items: MeDemoReadinessChecklistItem[];
}

export function DemoReadinessGuardrailCard({ items }: DemoReadinessGuardrailCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Scope Guardrail Audit</CardTitle>
        <CardDescription>UI-only and placeholder-only verification for the ME presentation layer.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {items.map((item) => (
          <div key={item.key} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">{item.title.en}</p>
              <p className="text-sm text-muted-foreground">{item.description.en}</p>
            </div>
            <DemoReadinessChip tone={item.tone} status={item.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
