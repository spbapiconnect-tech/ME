import Link from "next/link";

import { BusinessActionPanel } from "@/components/business/business-action-panel";
import { BusinessAlertCard } from "@/components/business/business-alert-card";
import { BusinessFoundationSection } from "@/components/business/business-foundation-section";
import { BusinessKpiCard } from "@/components/business/business-kpi-card";
import { BusinessModuleCard } from "@/components/business/business-module-card";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspacePageData } from "@/types/business-workspace";

interface BusinessWorkspacePageProps {
  data: BusinessWorkspacePageData;
}

export function BusinessWorkspacePage({ data }: BusinessWorkspacePageProps) {
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
                  <Button asChild variant="outline" size="sm">
                    <Link href="/navigation">Navigation IA</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/system-foundation">System Foundation</Link>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Read-only B2B workspace preview. No real database/API, writes, auth/session/middleware, billing enforcement, workflow execution, or notification sending.
              </CardDescription>
            </CardHeader>
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
