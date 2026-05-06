import Link from "next/link";

import { DemoStoryChip } from "@/components/demo-story/demo-story-chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoStoryStep } from "@/types/demo-story";

interface DemoStoryTimelineProps {
  steps: MeDemoStoryStep[];
  currentStepKey?: string;
}

export function DemoStoryTimeline({ steps, currentStepKey }: DemoStoryTimelineProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">Guided Route Sequence</CardTitle>
        <CardDescription>Business-first route-to-route story flow across ME.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {steps.map((step, index) => (
          <div key={step.key} className="grid gap-2 rounded-xl border border-border/60 bg-background/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{step.order}. {step.title.en}</p>
                <p className="text-xs text-muted-foreground">{step.route}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStepKey === step.key ? <DemoStoryChip label="current" tone="success" /> : null}
                <DemoStoryChip label={step.status} tone={step.tone} status={step.status} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{step.description.en}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {step.relatedRoutes.map((route) => (
                <span key={`${step.key}-${route}`} className="rounded-full border border-border/60 px-2 py-1">
                  {route}
                </span>
              ))}
            </div>
            <Link href={`/demo-story/${step.key}`} className="text-sm font-medium text-primary hover:underline">
              Open Story Step
            </Link>
            {index < steps.length - 1 ? <div className="text-xs text-muted-foreground">Continue to the next route in the ME demo narrative.</div> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
