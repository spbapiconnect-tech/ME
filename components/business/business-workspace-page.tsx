import Link from "next/link";

import { BusinessActionPanel } from "@/components/business/business-action-panel";
import { BusinessAlertCard } from "@/components/business/business-alert-card";
import { BusinessFoundationSection } from "@/components/business/business-foundation-section";
import { BusinessKpiCard } from "@/components/business/business-kpi-card";
import { BusinessModuleCard } from "@/components/business/business-module-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWorkspacePageData } from "@/types/business-workspace";

interface BusinessWorkspacePageProps {
  data: BusinessWorkspacePageData;
}

export function BusinessWorkspacePage({ data }: BusinessWorkspacePageProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">ME Business Workspace</CardTitle>
              <CardDescription>Modular Store Operations Platform</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/system-foundation">System Foundation</Link>
            </Button>
          </div>
          <CardDescription>
            Read-only B2B workspace preview. No real database/API, writes, auth/session/middleware, billing enforcement, workflow execution, or notification sending.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">Store Selector: North Region / Placeholder</div>
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">Date Range: Last 7 days / Placeholder</div>
          <div className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">Search: Workspace quick search / Placeholder</div>
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

      <Card size="sm" className="border-dashed">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Workspace Notice</CardTitle>
          <CardDescription>{data.notice.en}</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
