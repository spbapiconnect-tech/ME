import Link from "next/link";

import { DemoModeBadge } from "@/components/demo-mode/demo-mode-badge";
import { DemoModeBanner } from "@/components/demo-mode/demo-mode-banner";
import { DemoPresentationNote } from "@/components/demo-mode/demo-presentation-note";
import { DemoScreenshotCard } from "@/components/demo-mode/demo-screenshot-card";
import { DemoWalkthroughChecklist } from "@/components/demo-mode/demo-walkthrough-checklist";
import {
  MeActionBar,
  MeDashboardShell,
  MePageHeader,
  MeRightRail,
  MeWorkspaceSection,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoModePageData } from "@/types/demo-mode";

interface DemoModePageProps {
  data: MeDemoModePageData;
}

export function DemoModePage({ data }: DemoModePageProps) {
  return (
    <MeDashboardShell
      activeKey="demo-mode"
      rightRail={
        <MeRightRail
          sections={[
            { title: "Presentation Mode", badge: "Static", items: ["Screenshot framing only", "No persisted mode state", "No analytics or tracking"] },
            { title: "Primary Routes", items: data.recommendedRouteSequence.slice(0, 4) },
            { title: "Guardrails", items: ["No toggle engine", "No personalization", "No share permissions", "No writes"] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="Demo & Presentation"
        title={data.title.en}
        description={data.subtitle.en}
        notice={data.notice.en}
        badges={data.badges.slice(0, 3).map((badge) => ({ label: badge.label.en, variant: "secondary" as const }))}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/demo-story">Open Demo Story</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/demo-readiness">Open Demo Readiness</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Mode", value: "Presentation shell" },
          { label: "Screenshots", value: String(data.screenshotSections.length) },
          { label: "Route sequence", value: String(data.recommendedRouteSequence.length) },
          { label: "Tracking", value: "Disabled" },
        ]}
      />

      <DemoModeBanner />

      <MeActionBar
        actions={[
          { label: "Review screenshot surfaces" },
          { label: "Open walkthrough", variant: "outline" },
          { label: "Prepare summary", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <MeWorkspaceSection title="Presentation Metadata" description="Premium framing only with no runtime mode engine.">
        <div className="flex flex-wrap gap-2">
          {data.badges.map((badge) => (
            <DemoModeBadge key={badge.key} badge={badge} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Screenshot Surfaces" description="Route-by-route framing guidance for stakeholder review.">
        <div className="grid gap-4 xl:grid-cols-2">
          {data.screenshotSections.map((section) => (
            <DemoScreenshotCard key={section.key} section={section} />
          ))}
        </div>
      </MeWorkspaceSection>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <MeWorkspaceSection title="Recommended Route Sequence" description="Suggested order for live walkthroughs and screenshot capture sessions.">
          <div className="grid gap-3 md:grid-cols-2">
            {data.recommendedRouteSequence.map((route, index) => (
              <Link key={route} href={route} className="rounded-2xl border border-border/50 bg-slate-50/85 p-4 text-sm text-slate-700 transition hover:bg-white">
                <p className="text-xs text-slate-500">Stop {index + 1}</p>
                <p className="mt-1 font-medium text-slate-950">{route}</p>
              </Link>
            ))}
          </div>
        </MeWorkspaceSection>
        <DemoWalkthroughChecklist items={data.walkthroughItems} />
      </section>

      <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">Presentation Next Step</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
          <p>Use the stakeholder summary and final QA route as the presentation close after screenshot framing.</p>
          <p>Keep the presentation static and read-only with no investor portal, CRM, analytics, or sharing permissions.</p>
          <p>Finish with `/demo-readiness` as the final placeholder audit after `/demo-story` and `/demo-mode`.</p>
        </CardContent>
      </Card>

      <DemoPresentationNote description="Screenshot-ready placeholder only. No real demo state, persistence, tracking, analytics, or write behavior was added." />
    </MeDashboardShell>
  );
}
