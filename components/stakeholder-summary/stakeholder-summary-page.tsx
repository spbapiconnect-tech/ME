import Link from "next/link";

import { StakeholderDemoRouteMap } from "@/components/stakeholder-summary/stakeholder-demo-route-map";
import { StakeholderMetricCard } from "@/components/stakeholder-summary/stakeholder-metric-card";
import { StakeholderRoadmapCard } from "@/components/stakeholder-summary/stakeholder-roadmap-card";
import { StakeholderSummaryCard } from "@/components/stakeholder-summary/stakeholder-summary-card";
import { StakeholderSummaryChip } from "@/components/stakeholder-summary/stakeholder-summary-chip";
import { DemoPresentationNote } from "@/components/demo-mode";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeStakeholderSummaryPageData } from "@/types/stakeholder-summary";

interface StakeholderSummaryPageProps {
  data: MeStakeholderSummaryPageData;
}

const productStoryKinds = ["problem", "business-workspace", "role-context", "branch-context", "psi-operations", "reports"] as const;
const productLayerKinds = ["product-layer", "system-foundation"] as const;

export function StakeholderSummaryPage({ data }: StakeholderSummaryPageProps) {
  const heroCard = data.cards.find((card) => card.kind === "hero");
  const roadmapCard = data.cards.find((card) => card.kind === "roadmap");
  const routeMapCard = data.cards.find((card) => card.kind === "demo-route-map");
  const nextStepsCard = data.cards.find((card) => card.kind === "next-step");
  const productStoryCards = data.cards.filter((card) => productStoryKinds.includes(card.kind as (typeof productStoryKinds)[number]));
  const productLayerCards = data.cards.filter((card) => productLayerKinds.includes(card.kind as (typeof productLayerKinds)[number]));

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="stakeholder-summary" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card className="border border-border/70 bg-card/95">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-3xl">
                  <CardTitle className="text-2xl">{data.title.en}</CardTitle>
                  <CardDescription>{data.subtitle.en}</CardDescription>
                  <CardDescription>{data.notice.en}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/demo-story">Open Demo Story</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-mode">Open Demo Mode</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-readiness">Open Demo Readiness</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/">Open Business Workspace</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.audience.map((audience) => (
                  <StakeholderSummaryChip key={audience} label={audience.split("-").join(" ")} tone="muted" />
                ))}
              </div>
            </CardHeader>
            {heroCard ? (
              <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <div className="grid gap-3">
                  <p className="text-sm text-muted-foreground">{heroCard.description.en}</p>
                  <div className="grid gap-2 md:grid-cols-3">
                    {heroCard.highlights.map((highlight) => (
                      <div key={highlight.en} className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                        {highlight.en}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Generated</p>
                  <p className="mt-2 text-sm font-medium">{data.generatedAt}</p>
                  <p className="mt-3 text-sm text-muted-foreground">Static stakeholder summary only. No investor portal, CRM, analytics, tracking, personalization, database, or API is connected.</p>
                </div>
              </CardContent>
            ) : null}
          </Card>

          <DemoPresentationNote description="Screenshot-ready stakeholder overview only. This page is static, presentation-ready, and intentionally avoids investor tracking, CRM, analytics, or sharing permissions." />

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Hero Metrics</p>
              <p className="text-sm text-muted-foreground">Snapshot metrics for explaining ME as a modular platform and business opportunity.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {data.metrics.map((metric) => (
                <StakeholderMetricCard key={metric.key} metric={metric} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Product Story</p>
              <p className="text-sm text-muted-foreground">Stakeholder-facing cards that explain the product story, business context, and operating scope.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {productStoryCards.map((card) => (
                <StakeholderSummaryCard key={card.key} card={card} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Product Layers</p>
              <p className="text-sm text-muted-foreground">Explain how navigation, demo surfaces, and foundation contracts ladder up into the ME platform story.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {productLayerCards.map((card) => (
                <StakeholderSummaryCard key={card.key} card={card} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-semibold">Roadmap Snapshot</p>
                <p className="text-sm text-muted-foreground">Completed milestones, current delivery, and the next planned transition beyond the placeholder layer.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.roadmap.map((item) => (
                  <StakeholderRoadmapCard key={item.key} item={item} />
                ))}
              </div>
            </div>
            {roadmapCard ? <StakeholderSummaryCard card={roadmapCard} /> : null}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <StakeholderDemoRouteMap routes={data.demoRoutes} />
            <div className="grid gap-4">
              {routeMapCard ? <StakeholderSummaryCard card={routeMapCard} /> : null}
              {nextStepsCard ? <StakeholderSummaryCard card={nextStepsCard} /> : null}
              <Card size="sm" className="border-dashed border-border/80 bg-muted/20">
                <CardHeader className="gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm">Final Demo QA</CardTitle>
                      <CardDescription>Close the stakeholder conversation with the static Demo Readiness audit before screenshots, handoff notes, or next-step discussions.</CardDescription>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/demo-readiness">Open Demo Readiness</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm text-muted-foreground">
                  <p>Review the final route checklist, CTA consistency, and screenshot framing from one placeholder-only page.</p>
                  <p>Keep the wrap-up static with no investor tracking, CRM sync, analytics, sharing permissions, browser automation, or CI workflow.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
