import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
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
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="demo-readiness" className="self-start" />

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
                    <Link href="/">Open Business Workspace</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-story">Open Demo Story</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-mode">Open Demo Mode</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/roles">Open Roles</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/branches">Open Branches</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/psi">Open PSI</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/reports">Open Reports</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/system-foundation">Open System Foundation</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <DemoPresentationNote description="Static QA placeholder — no monitoring, analytics, tracking, browser automation, or CI changes." />

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Summary Metrics</p>
              <p className="text-sm text-muted-foreground">Final presentation-readiness indicators for the current mock/read-only ME prototype.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.summaryMetrics.map((metric) => (
                <DemoReadinessMetricCard key={metric.key} metric={metric} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <DemoReadinessRouteMap items={data.routeChecklist} />
            <DemoReadinessGuardrailCard items={data.guardrailChecklist} />
          </section>

          {data.sections.map((section) => (
            <DemoReadinessSection key={section.key} section={section} />
          ))}

          <Card size="sm" className="border-dashed border-border/80 bg-muted/20">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Generated Metadata</CardTitle>
              <CardDescription>{data.generatedAt}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
              <p>Static QA metadata only. No runtime crawler, browser automation, monitoring, or analytics is connected.</p>
              <p>Existing business, demo, stakeholder, PSI, report, system-foundation, and package routes remain intact.</p>
              <p>Use this route as the final presentation audit before a live demo, screenshot review, or stakeholder conversation.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
