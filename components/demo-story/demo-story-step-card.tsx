import Link from "next/link";

import { DemoStoryChip } from "@/components/demo-story/demo-story-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoStoryStep } from "@/types/demo-story";

interface DemoStoryStepCardProps {
  step: MeDemoStoryStep;
}

export function DemoStoryStepCard({ step }: DemoStoryStepCardProps) {
  return (
    <Card size="sm" className="border border-border/70 bg-card/95">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardDescription>Step {step.order}</CardDescription>
            <CardTitle className="text-base">{step.title.en}</CardTitle>
            <CardDescription>{step.title.zh}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <DemoStoryChip label={step.status} tone={step.tone} status={step.status} />
            <DemoStoryChip label={step.route} tone="muted" />
          </div>
        </div>
        {step.subtitle ? <CardDescription>{step.subtitle.en}</CardDescription> : null}
        <CardDescription>{step.description.en}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          {step.highlights.map((highlight) => (
            <div key={`${step.key}-${highlight.en}`} className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
              {highlight.en}
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Proof Points</p>
          {step.proofPoints.map((point) => (
            <p key={`${step.key}-${point.en}`} className="text-sm text-muted-foreground">
              {point.en}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/demo-story/${step.key}`}>{step.secondaryCta?.en ?? "View Story Step"}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={step.route}>{step.primaryCta.en}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
