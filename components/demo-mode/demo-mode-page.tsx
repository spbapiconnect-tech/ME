import Link from "next/link";

import { DemoModeBadge } from "@/components/demo-mode/demo-mode-badge";
import { DemoModeBanner } from "@/components/demo-mode/demo-mode-banner";
import { DemoPresentationNote } from "@/components/demo-mode/demo-presentation-note";
import { DemoScreenshotCard } from "@/components/demo-mode/demo-screenshot-card";
import { DemoWalkthroughChecklist } from "@/components/demo-mode/demo-walkthrough-checklist";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeDemoModePageData } from "@/types/demo-mode";

interface DemoModePageProps {
  data: MeDemoModePageData;
}

export function DemoModePage({ data }: DemoModePageProps) {
  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="demo-mode" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">{data.title.en}</CardTitle>
                  <CardDescription>{data.subtitle.en}</CardDescription>
                  <CardDescription>{data.notice.en}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/demo-story">Open Demo Story</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-readiness">Open Demo Readiness</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/">Open Business Workspace</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <DemoModeBanner />

          <Card size="sm" className="border border-border/70 bg-card/95">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Presentation Metadata</CardTitle>
              <CardDescription>Premium B2B SaaS framing only. No toggle, no engine, and no persisted settings.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {data.badges.map((badge) => (
                <DemoModeBadge key={badge.key} badge={badge} />
              ))}
            </CardContent>
          </Card>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Screenshot Surfaces</p>
              <p className="text-sm text-muted-foreground">Route-by-route framing guidance for stakeholder reviews, screenshots, walkthroughs, and proposal decks.</p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {data.screenshotSections.map((section) => (
                <DemoScreenshotCard key={section.key} section={section} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <Card size="sm" className="border border-border/70 bg-card/95">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">Recommended Route Sequence</CardTitle>
                <CardDescription>Suggested order for live walkthroughs and screenshot capture sessions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {data.recommendedRouteSequence.map((route, index) => (
                  <Link
                    key={route}
                    href={route}
                    className="rounded-xl border border-border/70 bg-background/70 p-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <p className="text-xs text-muted-foreground">Stop {index + 1}</p>
                    <p className="font-medium">{route}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <DemoWalkthroughChecklist items={data.walkthroughItems} />
          </section>

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">Presentation Next Step</CardTitle>
                  <CardDescription>Use the stakeholder summary and final QA route as the presentation close after screenshot framing and route walkthrough prep.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/demo-readiness">Open Demo Readiness</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
              <p>Summarize ME as a product, business opportunity, and modular platform in one page.</p>
              <p>Keep the presentation static and read-only with no investor portal, CRM, analytics, or sharing permissions.</p>
              <p>Finish with `/demo-readiness` to run the final placeholder QA review after `/demo-story`, `/demo-mode`, and the stakeholder close.</p>
            </CardContent>
          </Card>

          <DemoPresentationNote description="Screenshot-ready placeholder — all data is mock/read-only. No real demo state, no tracking, and no analytics are connected." />
        </div>
      </div>
    </main>
  );
}
