import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import {
  MeActionBar,
  MeDashboardShell,
  MeListWorkspace,
  MePageHeader,
  MeRightRail,
  MeWorkspaceSection,
} from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BusinessWorkspacePageData } from "@/types/business-workspace";

interface BusinessWorkspacePageProps {
  data: BusinessWorkspacePageData;
}

export function BusinessWorkspacePage({ data }: BusinessWorkspacePageProps) {
  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Workspace Status",
          badge: "Live shell",
          items: [
            "Branch context: All Stores / KCH preview",
            "Routing source: shared navigation config",
            "Guardrail: mock and read-only only",
          ],
        },
        {
          title: "Operational Alerts",
          description: "Current watch items carried into the dashboard shell.",
          items: data.alerts.slice(0, 3).map((alert) => alert.title.en),
        },
        {
          title: "Recent Activity",
          items: [
            "Business workspace shell updated",
            "PSI, reports, and branches remain linked",
            `Snapshot generated ${data.generatedAt}`,
          ],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="dashboard" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Business Workspace"
        title="ME operational workspace"
        description={data.subtitle.en}
        notice={data.notice.en}
        badges={[
          { label: "CRM / ERP shell", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
          { label: "Config-driven navigation", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/psi">Open PSI Workspace</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports">Open Reports</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/branches">Open Branches</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Branch", value: "All Stores / KCH" },
          { label: "Workspace Date", value: "Last 7 days" },
          { label: "Module Focus", value: "PSI / Reports / Roles" },
          { label: "Snapshot", value: data.generatedAt },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review alerts" },
          { label: "Assign follow-up", variant: "outline" },
          { label: "Export summary", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {data.metrics.map((metric) => (
          <Card key={metric.key} size="sm" className="border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] shadow-[0_18px_32px_-28px_rgba(15,23,42,0.16)]">
            <CardContent className="grid gap-2 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{metric.label.en}</p>
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400/80" />
              </div>
              <p className="text-[1.7rem] font-semibold tracking-[-0.02em] text-slate-950">{metric.value}</p>
              <p className="text-sm leading-6 text-slate-500">{metric.description?.en}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <MeListWorkspace
        filters={
          <MeWorkspaceSection
            title="Operational Controls"
            description="Presentation-safe action points and routing shortcuts for the main workspace."
            contentClassName="md:grid-cols-4"
          >
            <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Branch scope</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">All Stores / KCH</p>
            </div>
            <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Queues</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">Procurement, issues, reports</p>
            </div>
            <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Mode</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">Mock / read-only</p>
            </div>
            <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Owner</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">Business workspace</p>
            </div>
          </MeWorkspaceSection>
        }
        list={
          <>
            <MeWorkspaceSection title="Operational Modules" description="Core modules arranged as a working B2B home instead of a gallery of cards.">
              <div className="grid gap-3 md:grid-cols-2">
                {data.modules.map((module) => (
                  <Link
                    key={module.key}
                    href={module.route}
                    className="rounded-[24px] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.9))] p-4 ring-1 ring-slate-200/75 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_28px_-20px_rgba(15,23,42,0.16)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-950">{module.title.en}</p>
                        <p className="mt-1 text-sm text-slate-500">{module.description.en}</p>
                      </div>
                      <Badge variant="outline">{module.status}</Badge>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Primary</p>
                        <p>{module.primaryMetric?.en ?? "Placeholder"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Secondary</p>
                        <p>{module.secondaryMetric?.en ?? "Read-only"}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Operational Alerts" description="Queue-style watch items for immediate review.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {data.alerts.map((alert) => (
                  <div key={alert.key} className="rounded-[24px] bg-slate-50/88 p-4 ring-1 ring-slate-200/75">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-950">{alert.title.en}</p>
                      <Badge variant="outline">{alert.sourceModule}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{alert.description.en}</p>
                    <p className="mt-3 text-xs text-slate-500">{alert.timestampLabel?.en ?? "Pending review"}</p>
                  </div>
                ))}
              </div>
            </MeWorkspaceSection>
          </>
        }
        summary={
          <>
            <MeWorkspaceSection title="Action Panel" description="Visual actions only. No writes or workflow execution.">
              <div className="grid gap-2">
                {data.actions.map((action) => (
                  <Link key={action.key} href={action.route} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 text-sm text-slate-700 ring-1 ring-slate-200/75 transition hover:bg-white hover:shadow-[0_14px_24px_-20px_rgba(15,23,42,0.14)]">
                    <p className="font-medium text-slate-950">{action.label.en}</p>
                    <p className="mt-1 text-xs text-slate-500">{action.description?.en ?? "Placeholder action"}</p>
                  </Link>
                ))}
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Foundation Links" description="Shared admin and structure routes stay available through the shell.">
              <div className="grid gap-2">
                {data.systemFoundationLinks.map((link) => (
                  <Link key={link.key} href={link.route} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/75 transition hover:bg-white hover:shadow-[0_14px_24px_-20px_rgba(15,23,42,0.14)]">
                    {link.label.en}
                  </Link>
                ))}
              </div>
            </MeWorkspaceSection>
          </>
        }
      />

      <DemoPresentationNote description="Screenshot-ready operational shell only. All routing and data remain mock/read-only with no API, auth, workflow, or write execution added." />
    </MeDashboardShell>
  );
}
