import Link from "next/link";

import { BranchSelectorPlaceholder } from "@/components/branches";
import { DemoModeBadge, DemoModeBanner, DemoPresentationNote } from "@/components/demo-mode";
import { BusinessActionPanel } from "@/components/business/business-action-panel";
import { BusinessAlertCard } from "@/components/business/business-alert-card";
import { BusinessFoundationSection } from "@/components/business/business-foundation-section";
import { BusinessKpiCard } from "@/components/business/business-kpi-card";
import { BusinessModuleCard } from "@/components/business/business-module-card";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBranchProfiles } from "@/lib/branch-context";
import { getDemoModeBadges } from "@/lib/demo-mode";
import { getDemoStorySteps } from "@/lib/demo-story";
import { getStakeholderSummaryPageData } from "@/lib/stakeholder-summary";
import type { BusinessWorkspacePageData } from "@/types/business-workspace";

interface BusinessWorkspacePageProps {
  data: BusinessWorkspacePageData;
}

export function BusinessWorkspacePage({ data }: BusinessWorkspacePageProps) {
  const branchProfiles = getBranchProfiles();
  const demoModeBadges = getDemoModeBadges().filter((badge) => ["product-demo", "screenshot-ready", "stakeholder-review"].includes(badge.key));
  const demoStorySteps = getDemoStorySteps();
  const stakeholderSummaryData = getStakeholderSummaryPageData();

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="dashboard" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">ME Business Workspace</CardTitle>
                  <CardDescription>Modular Store Operations Platform</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/demo-story/business-overview">Start Guided Demo</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/demo-mode">Demo Mode</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/stakeholder-summary">Stakeholder Summary</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/navigation">Navigation IA</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/system-foundation">System Foundation</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/roles">Roles Preview</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/branches">Branch Context</Link>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Read-only B2B workspace preview. No real database/API, writes, auth/session/middleware, billing enforcement, workflow execution, or notification sending.
              </CardDescription>
            </CardHeader>
          </Card>

          <DemoModeBanner />

          <Card size="sm" className="border-dashed border-border/80 bg-muted/20">
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">Screenshot-ready demo</CardTitle>
                  <CardDescription>Presentation-friendly labels keep the homepage polished without turning it into a demo-mode control panel.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-mode">Open Demo Mode</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {demoModeBadges.map((badge) => (
                <DemoModeBadge key={badge.key} badge={badge} />
              ))}
            </CardContent>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">Branch Context Preview</CardTitle>
                  <CardDescription>Preview how the shared workspace can be reframed under All Stores, KCH, BTU, and Future Branch contexts.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/branches">Open Branches</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BranchSelectorPlaceholder branches={branchProfiles} compact />
            </CardContent>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">ME Demo Story</CardTitle>
                  <CardDescription>Static guided product tour placeholder that connects the homepage, navigation, roles, branches, PSI, reports, and system foundation.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-story">Open Demo Story</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {demoStorySteps.slice(0, 4).map((step) => (
                <div key={step.key} className="rounded-xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs text-muted-foreground">Step {step.order}</p>
                  <p className="text-sm font-medium">{step.title.en}</p>
                  <p className="text-xs text-muted-foreground">{step.route}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm">ME Stakeholder Summary</CardTitle>
                  <CardDescription>Presentation-ready ME overview for owner, investor, partner, and internal review conversations.</CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/stakeholder-summary">Open Stakeholder Summary</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {stakeholderSummaryData.metrics.slice(0, 3).map((metric) => (
                <div key={metric.key} className="rounded-xl border border-border/70 bg-background/70 p-3">
                  <p className="text-xs text-muted-foreground">{metric.label.en}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description?.en}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {data.metrics.map((metric) => (
              <BusinessKpiCard key={metric.key} metric={metric} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-4">
              <Card size="sm">
                <CardHeader className="gap-1">
                  <CardTitle className="text-sm">Operational Modules</CardTitle>
                  <CardDescription>Business-first workspace modules with read-only status context</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {data.modules.map((moduleCard) => (
                    <BusinessModuleCard key={moduleCard.key} moduleCard={moduleCard} />
                  ))}
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader className="gap-1">
                  <CardTitle className="text-sm">PSI Report Preview Summary</CardTitle>
                  <CardDescription>Generated at: {data.generatedAt}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-3">
                  {data.metrics.slice(1, 4).map((metric) => (
                    <div key={`summary-${metric.key}`} className="rounded-xl border border-border/70 p-3">
                      <p className="text-xs text-muted-foreground">{metric.label.en}</p>
                      <p className="text-lg font-semibold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.description?.en}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader className="gap-1">
                  <CardTitle className="text-sm">Operational Alerts</CardTitle>
                  <CardDescription>Risk and watchlist signals from PSI mock report aggregation</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {data.alerts.map((alert) => (
                    <BusinessAlertCard key={alert.key} alert={alert} />
                  ))}
                </CardContent>
              </Card>
            </div>

            <BusinessActionPanel actions={data.actions} />
          </section>

          <BusinessFoundationSection links={data.systemFoundationLinks} />

          <DemoPresentationNote description="Screenshot-ready placeholder — all data is mock/read-only. This presentation layer adds no real demo state, tracking, or persistence." />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Workspace Notice</CardTitle>
              <CardDescription>{data.notice.en}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
