import Link from "next/link";

import { DemoModeBanner, DemoPresentationNote } from "@/components/demo-mode";
import { DemoStoryChip } from "@/components/demo-story/demo-story-chip";
import { DemoStoryProgressPlaceholder } from "@/components/demo-story/demo-story-progress-placeholder";
import { DemoStoryRouteCard } from "@/components/demo-story/demo-story-route-card";
import { DemoStoryTimeline } from "@/components/demo-story/demo-story-timeline";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNextDemoStoryStep, getPreviousDemoStoryStep } from "@/lib/demo-story";
import type { MeDemoStoryPageData } from "@/types/demo-story";

interface DemoStoryDetailPageProps {
  data: MeDemoStoryPageData;
}

export function DemoStoryDetailPage({ data }: DemoStoryDetailPageProps) {
  if (!data.currentStep) {
    return null;
  }

  const step = data.currentStep;
  const previousStep = getPreviousDemoStoryStep(step.key);
  const nextStep = getNextDemoStoryStep(step.key);

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="demo-story" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardDescription>Step {step.order}</CardDescription>
                  <CardTitle className="text-2xl">{step.title.en}</CardTitle>
                  <CardDescription>{step.title.zh}</CardDescription>
                  {step.subtitle ? <CardDescription>{step.subtitle.en}</CardDescription> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <DemoStoryChip label={step.status} tone={step.tone} status={step.status} />
                  <DemoStoryChip label={step.route} tone="muted" />
                </div>
              </div>
              <CardDescription>{step.description.en}</CardDescription>
              <CardDescription>{step.placeholderNotice.en}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={step.route}>{step.primaryCta.en}</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-mode">Open Demo Mode</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-story">All Story Steps</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <DemoModeBanner />

          <DemoStoryProgressPlaceholder stepKey={step.key} />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Guided Demo Notice</CardTitle>
              <CardDescription>
                No real onboarding state, analytics, tracking, personalization, auth/session, database/API, or write behavior is connected to this story step.
              </CardDescription>
            </CardHeader>
          </Card>

          <DemoPresentationNote description="Screenshot-ready placeholder — all data is mock/read-only. Use `/demo-mode` to frame this step for stakeholder screenshots." />

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Card size="sm" className="border border-border/70 bg-card/95">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">Highlights</CardTitle>
                <CardDescription>Key narrative points for this ME demo step.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {step.highlights.map((highlight) => (
                  <div key={`${step.key}-${highlight.en}`} className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground">
                    {highlight.en}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card size="sm" className="border border-border/70 bg-card/95">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">Proof Points</CardTitle>
                <CardDescription>Static evidence used to tell the product story.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-muted-foreground">
                {step.proofPoints.map((point) => (
                  <p key={`${step.key}-${point.en}`}>{point.en}</p>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Routes In This Step</p>
              <p className="text-sm text-muted-foreground">Route-to-route links that continue the ME business story.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <DemoStoryRouteCard title="Primary Route" description={step.description.en} route={step.route} tone={step.tone} />
              {step.relatedRoutes.map((route) => (
                <DemoStoryRouteCard
                  key={`${step.key}-${route}`}
                  title="Related Route"
                  description={`Connected route used to support the ${step.title.en.toLowerCase()} narrative.`}
                  route={route}
                  tone="muted"
                />
              ))}
            </div>
          </section>

          <DemoStoryTimeline steps={data.steps} currentStepKey={step.key} />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Previous / Next</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {previousStep ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/demo-story/${previousStep.key}`}>Previous: {previousStep.title.en}</Link>
                </Button>
              ) : null}
              {nextStep ? (
                <Button asChild size="sm">
                  <Link href={`/demo-story/${nextStep.key}`}>Next: {nextStep.title.en}</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
