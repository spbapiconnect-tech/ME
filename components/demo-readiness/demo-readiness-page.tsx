import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import { MeDashboardShell, MePageHeader, MeRightRail, MeWorkspaceSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoReadinessPageData } from "@/types/demo-readiness";

import { DemoReadinessGuardrailCard } from "./demo-readiness-guardrail-card";
import { DemoReadinessMetricCard } from "./demo-readiness-metric-card";
import { DemoReadinessRouteMap } from "./demo-readiness-route-map";
import { DemoReadinessSection } from "./demo-readiness-section";

interface DemoReadinessPageProps {
  data: MeDemoReadinessPageData;
}

export function DemoReadinessPage({ data }: DemoReadinessPageProps) {
  return (
    <MeDashboardShell
      activeKey="demo-readiness"
      rightRail={
        <MeRightRail
          sections={[
            { title: "QA Status", badge: "Static audit", items: ["Route audit only", "No monitoring", "No browser automation", "No CI changes"] },
            { title: "Coverage", items: data.routeChecklist.slice(0, 4).map((item) => item.route).filter((route): route is string => Boolean(route)) },
            { title: "Guardrails", items: ["No analytics", "No runtime crawler", "No tracking", "No writes"] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="Demo Readiness"
        title={data.title.en}
        description={data.subtitle.en}
        notice={data.notice.en}
        badges={[
          { label: "Final audit" },
          { label: "Presentation-safe", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/">Open Business Workspace</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/demo-story">Open Demo Story</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Metrics", value: String(data.summaryMetrics.length) },
          { label: "Sections", value: String(data.sections.length) },
          { label: "Routes checked", value: String(data.routeChecklist.length) },
          { label: "Generated", value: data.generatedAt },
        ]}
      />

      <DemoPresentationNote description="Static QA placeholder only. No monitoring, analytics, tracking, browser automation, or CI workflow changes were added." />

      <MeWorkspaceSection title="Summary Metrics" description="Final presentation-readiness indicators for the current mock/read-only ME prototype.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.summaryMetrics.map((metric) => (
            <DemoReadinessMetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      </MeWorkspaceSection>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <DemoReadinessRouteMap items={data.routeChecklist} />
        <DemoReadinessGuardrailCard items={data.guardrailChecklist} />
      </section>

      {data.sections.map((section) => (
        <DemoReadinessSection key={section.key} section={section} />
      ))}

      <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">Generated Metadata</CardTitle>
          <CardDescription>{data.generatedAt}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
          <p>Static QA metadata only. No runtime crawler, browser automation, monitoring, or analytics is connected.</p>
          <p>Existing business, demo, stakeholder, PSI, report, system-foundation, and package routes remain intact.</p>
          <p>Use this route as the final presentation audit before a live demo, screenshot review, or stakeholder conversation.</p>
        </CardContent>
      </Card>
    </MeDashboardShell>
  );
}
