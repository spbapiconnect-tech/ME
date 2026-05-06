import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import { MeDashboardShell, MePageHeader, MeRightRail, MeWorkspaceSection } from "@/components/layout";
import { StakeholderDemoRouteMap } from "@/components/stakeholder-summary/stakeholder-demo-route-map";
import { StakeholderMetricCard } from "@/components/stakeholder-summary/stakeholder-metric-card";
import { StakeholderRoadmapCard } from "@/components/stakeholder-summary/stakeholder-roadmap-card";
import { StakeholderSummaryCard } from "@/components/stakeholder-summary/stakeholder-summary-card";
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
    <MeDashboardShell
      activeKey="stakeholder-summary"
      rightRail={
        <MeRightRail
          sections={[
            { title: "Audience", badge: "Presentation", items: data.audience.map((item) => item.split("-").join(" ")) },
            { title: "Current Focus", items: ["Product story", "Roadmap snapshot", "Demo route map", "Read-only framing"] },
            { title: "Guardrails", items: ["No CRM", "No investor portal", "No analytics", "No share permissions"] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="Stakeholder Summary"
        title={data.title.en}
        description={data.subtitle.en}
        notice={data.notice.en}
        badges={data.audience.map((audience) => ({ label: audience.split("-").join(" "), variant: "secondary" as const }))}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/demo-story">Open Demo Story</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/demo-mode">Open Demo Mode</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/demo-readiness">Open Demo Readiness</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Metrics", value: String(data.metrics.length) },
          { label: "Roadmap items", value: String(data.roadmap.length) },
          { label: "Demo routes", value: String(data.demoRoutes.length) },
          { label: "Generated", value: data.generatedAt },
        ]}
      />

      {heroCard ? (
        <MeWorkspaceSection title="Stakeholder Narrative" description={heroCard.description.en}>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="grid gap-2 md:grid-cols-3">
              {heroCard.highlights.map((highlight) => (
                <div key={highlight.en} className="rounded-2xl border border-border/50 bg-slate-50/85 p-4 text-sm text-slate-600">
                  {highlight.en}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border/50 bg-slate-50/85 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Generated</p>
              <p className="mt-2 text-sm font-medium text-slate-950">{data.generatedAt}</p>
              <p className="mt-3 text-sm text-slate-600">Static stakeholder summary only. No investor portal, CRM, analytics, tracking, personalization, database, or API is connected.</p>
            </div>
          </div>
        </MeWorkspaceSection>
      ) : null}

      <DemoPresentationNote description="Stakeholder framing now uses the shared SaaS shell while staying static and presentation-only. No CRM, analytics, sharing permission, or write behavior was added." />

      <MeWorkspaceSection title="Hero Metrics" description="Snapshot metrics for explaining ME as a modular platform and business opportunity.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.metrics.map((metric) => (
            <StakeholderMetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Product Story" description="Stakeholder-facing cards that explain the product story, business context, and operating scope.">
        <div className="grid gap-4 xl:grid-cols-2">
          {productStoryCards.map((card) => (
            <StakeholderSummaryCard key={card.key} card={card} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Product Layers" description="Navigation, shell, and platform foundations presented in one view.">
        <div className="grid gap-4 xl:grid-cols-3">
          {productLayerCards.map((card) => (
            <StakeholderSummaryCard key={card.key} card={card} />
          ))}
        </div>
      </MeWorkspaceSection>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <MeWorkspaceSection title="Roadmap Snapshot" description="Completed milestones, current delivery, and next planned transition beyond the placeholder layer.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.roadmap.map((item) => (
              <StakeholderRoadmapCard key={item.key} item={item} />
            ))}
          </div>
        </MeWorkspaceSection>
        {roadmapCard ? <StakeholderSummaryCard card={roadmapCard} /> : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <StakeholderDemoRouteMap routes={data.demoRoutes} />
        <div className="grid gap-4">
          {routeMapCard ? <StakeholderSummaryCard card={routeMapCard} /> : null}
          {nextStepsCard ? <StakeholderSummaryCard card={nextStepsCard} /> : null}
          <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm text-slate-900">Final Demo QA</CardTitle>
              <CardDescription>Close the stakeholder conversation with the static Demo Readiness audit.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <p>Review the final route checklist, CTA consistency, and screenshot framing from one placeholder-only page.</p>
              <p>Keep the wrap-up static with no investor tracking, CRM sync, analytics, sharing permissions, browser automation, or CI workflow.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </MeDashboardShell>
  );
}
