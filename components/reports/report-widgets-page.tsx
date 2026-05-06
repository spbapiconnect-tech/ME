"use client";

import Link from "next/link";
import * as React from "react";

import {
  MeActionBar,
  MeDashboardShell,
  MeListWorkspace,
  MePageHeader,
  MeRightRail,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { DashboardLayoutCard } from "@/components/reports/dashboard-layout-card";
import { PsiReportDashboardPanel } from "@/components/reports/psi-report-dashboard-panel";
import { ReportWidgetCard } from "@/components/reports/report-widget-card";
import { ReportWidgetPreviewCard } from "@/components/reports/report-widget-preview-card";
import { ReportWidgetSourceCard } from "@/components/reports/report-widget-source-card";
import { DemoPresentationNote } from "@/components/demo-mode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardLayoutCatalog, reportWidgetRegistry } from "@/config/reports";
import {
  getDashboardLayoutByKey,
  getDrillDownWidgets,
  getExportableWidgets,
  getPlaceholderWidgets,
  getRefreshableWidgets,
  getReportWidgetByKey,
} from "@/lib/report-widgets";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { SupportedLocale } from "@/types/module";
import type { DashboardLayoutContract, ReportWidgetSeverity, ReportWidgetStatus, ReportWidgetType } from "@/types/report-widget";
import type { PsiReportDashboardData } from "@/types/psi";

const widgetTypeOptions: Array<ReportWidgetType | "all"> = [
  "all",
  "kpi",
  "chart",
  "table",
  "list",
  "status-summary",
  "trend",
  "distribution",
  "alert",
  "task-summary",
  "workflow-summary",
  "notification-summary",
  "audit-summary",
  "placeholder",
];

const statusOptions: Array<ReportWidgetStatus | "all"> = ["all", "active", "preview-only", "placeholder", "coming-soon", "blocked", "disabled"];
const severityOptions: Array<ReportWidgetSeverity | "all"> = ["all", "neutral", "low", "medium", "high", "critical"];

function groupBy(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function getLayoutsByWidget(widgetKey: string): DashboardLayoutContract[] {
  return dashboardLayoutCatalog.filter((layout) => layout.widgets.includes(widgetKey));
}

export function ReportWidgetsPage({ psiDashboardData }: { psiDashboardData?: PsiReportDashboardData | null } = {}) {
  const locale = useUiPreferencesStore((state) => state.locale);
  const theme = useUiPreferencesStore((state) => state.theme);
  const hydrated = useUiPreferencesStore((state) => state.hydrated);
  const hydrate = useUiPreferencesStore((state) => state.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [hydrated, locale, theme]);

  const currentLocale: SupportedLocale = hydrated ? locale : "en";
  const [widgetTypeFilter, setWidgetTypeFilter] = React.useState<ReportWidgetType | "all">("all");
  const [sourceModuleFilter, setSourceModuleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<ReportWidgetStatus | "all">("all");
  const [severityFilter, setSeverityFilter] = React.useState<ReportWidgetSeverity | "all">("all");
  const [selectedWidgetKey, setSelectedWidgetKey] = React.useState<string>(reportWidgetRegistry[0]?.key ?? "");
  const [selectedLayoutKey, setSelectedLayoutKey] = React.useState<string>(dashboardLayoutCatalog[0]?.key ?? "");

  const sourceModules = React.useMemo(() => {
    const modules = Array.from(new Set(reportWidgetRegistry.map((item) => item.source.sourceModule))).sort();
    return ["all", ...modules];
  }, []);

  const filteredWidgets = React.useMemo(() => {
    return reportWidgetRegistry.filter((item) => {
      if (widgetTypeFilter !== "all" && item.widgetType !== widgetTypeFilter) return false;
      if (sourceModuleFilter !== "all" && item.source.sourceModule !== sourceModuleFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;
      return true;
    });
  }, [widgetTypeFilter, sourceModuleFilter, statusFilter, severityFilter]);

  const selectedWidget = React.useMemo(() => {
    if (!selectedWidgetKey) return undefined;
    return filteredWidgets.find((item) => item.key === selectedWidgetKey) ?? getReportWidgetByKey(selectedWidgetKey);
  }, [filteredWidgets, selectedWidgetKey]);

  const selectedLayout = React.useMemo(() => {
    if (!selectedLayoutKey) return undefined;
    return dashboardLayoutCatalog.find((item) => item.key === selectedLayoutKey) ?? getDashboardLayoutByKey(selectedLayoutKey);
  }, [selectedLayoutKey]);

  const layoutBySelectedWidget = React.useMemo(() => (selectedWidget ? getLayoutsByWidget(selectedWidget.key) : []), [selectedWidget]);

  const stats = React.useMemo(() => {
    return {
      total: reportWidgetRegistry.length,
      active: reportWidgetRegistry.filter((item) => item.status === "active").length,
      placeholder: getPlaceholderWidgets().length,
      exportable: getExportableWidgets().length,
      refreshable: getRefreshableWidgets().length,
      drillDown: getDrillDownWidgets().length,
      byType: groupBy(reportWidgetRegistry.map((item) => item.widgetType)),
      bySourceModule: groupBy(reportWidgetRegistry.map((item) => item.source.sourceModule)),
    };
  }, []);

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Report Readiness",
          badge: "Metadata only",
          items: [`${stats.active} active widgets`, `${stats.exportable} export-ready placeholders`, `${stats.refreshable} refresh-capable previews`],
        },
        {
          title: "Current Focus",
          items: [
            `Filter: ${widgetTypeFilter}`,
            `Status: ${statusFilter}`,
            `Severity: ${severityFilter}`,
          ],
        },
        {
          title: "Guardrails",
          items: ["No BI execution", "No SQL/database query", "No export engine", "No scheduled sending"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="reports" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Reports Workspace"
        title="Reporting and export readiness workspace"
        description="Operational report shell with category tabs, widget catalog review, and layout previews."
        notice={
          currentLocale === "zh"
            ? "该页面仅用于报表组件元数据预览：不执行 BI 引擎、图表渲染引擎、SQL、数据库查询、API、导出或定时发送。"
            : "Metadata-only report widget preview: no BI engine, chart execution engine, SQL, database query, API/backend, export engine, or scheduled sending."
        }
        badges={[
          { label: "Reports" },
          { label: "Read-only", variant: "outline" },
          { label: "Export placeholders", variant: "secondary" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/psi">Open PSI</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/branches">Open Branches</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/demo-mode">Open Demo Mode</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Overview", value: "PSI report workspace" },
          { label: "Export center", value: "Placeholder only" },
          { label: "Filter mode", value: "Interactive shell" },
          { label: "Layouts", value: `${dashboardLayoutCatalog.length} presets` },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Refresh preview" },
          { label: "Export", variant: "outline" },
          { label: "Share deck", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <MeTabs
        tabs={[
          { label: "Overview", active: true },
          { label: "POS Reports", badge: "Soon" },
          { label: "Sales Analytics", badge: "Soon" },
          { label: "Branch Performance", badge: "Soon" },
          { label: "Export Center", badge: "Soon" },
        ]}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Total widgets", String(stats.total)],
          ["Active", String(stats.active)],
          ["Placeholder", String(stats.placeholder)],
          ["Exportable", String(stats.exportable)],
          ["Refreshable", String(stats.refreshable)],
          ["Drill down", String(stats.drillDown)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-border/50 bg-white/92 px-4 py-4 shadow-sm shadow-slate-900/5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      {psiDashboardData ? (
        <MeWorkspaceSection title="PSI Report Preview" description="Read-only PSI operational summary inside the shared reporting shell.">
          <PsiReportDashboardPanel data={psiDashboardData} locale={currentLocale} />
        </MeWorkspaceSection>
      ) : null}

      <MeListWorkspace
        filters={
          <MeWorkspaceSection title="Report Filters" description="Operational filtering shell for the widget registry." contentClassName="md:grid-cols-4">
            <Select value={widgetTypeFilter} onValueChange={(value) => setWidgetTypeFilter(value as ReportWidgetType | "all")}>
              <SelectTrigger size="sm"><SelectValue placeholder="Widget Type" /></SelectTrigger>
              <SelectContent>{widgetTypeOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sourceModuleFilter} onValueChange={setSourceModuleFilter}>
              <SelectTrigger size="sm"><SelectValue placeholder="Source Module" /></SelectTrigger>
              <SelectContent>{sourceModules.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportWidgetStatus | "all")}>
              <SelectTrigger size="sm"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{statusOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as ReportWidgetSeverity | "all")}>
              <SelectTrigger size="sm"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>{severityOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
            </Select>
          </MeWorkspaceSection>
        }
        list={
          <>
            <MeWorkspaceSection title="Widget Catalog" description={`${filteredWidgets.length} of ${reportWidgetRegistry.length} widgets visible under the current filter set.`}>
              <div className="grid gap-3">
                {filteredWidgets.map((item) => (
                  <button key={item.key} type="button" className="text-left" onClick={() => setSelectedWidgetKey(item.key)}>
                    <ReportWidgetCard widget={item} locale={currentLocale} />
                  </button>
                ))}
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Dashboard Layout Templates" description="Reusable report layout references for future mapping.">
              <div className="flex flex-wrap gap-2">
                <Select value={selectedLayoutKey} onValueChange={setSelectedLayoutKey}>
                  <SelectTrigger size="sm" className="min-w-[16rem]"><SelectValue placeholder="Dashboard Layout" /></SelectTrigger>
                  <SelectContent>{dashboardLayoutCatalog.map((item) => <SelectItem key={item.key} value={item.key}>{currentLocale === "zh" ? item.name.zh : item.name.en}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedLayout ? <DashboardLayoutCard layout={selectedLayout} locale={currentLocale} /> : null}
                {dashboardLayoutCatalog.filter((item) => item.key !== selectedLayout?.key).slice(0, 3).map((layout) => (
                  <DashboardLayoutCard key={layout.key} layout={layout} locale={currentLocale} />
                ))}
              </div>
            </MeWorkspaceSection>
          </>
        }
        summary={
          <>
            {selectedWidget ? <ReportWidgetPreviewCard widget={selectedWidget} locale={currentLocale} /> : null}
            {selectedWidget ? <ReportWidgetSourceCard widget={selectedWidget} locale={currentLocale} /> : null}
            <MeWorkspaceSection title="Widget Mix" description="Current registry distribution.">
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(stats.byType).map(([key, value]) => (
                  <Badge key={key} variant="secondary">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(stats.bySourceModule).map(([key, value]) => (
                  <Badge key={key} variant="outline">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </MeWorkspaceSection>
            {layoutBySelectedWidget.length > 0 ? (
              <MeWorkspaceSection title="Selected Widget Layout Links" description="Layouts that currently reference the selected widget.">
                <div className="grid gap-2">
                  {layoutBySelectedWidget.map((layout) => (
                    <div key={layout.key} className="rounded-2xl border border-border/50 bg-slate-50/85 px-4 py-3 text-sm text-slate-700">
                      {layout.key}
                    </div>
                  ))}
                </div>
              </MeWorkspaceSection>
            ) : null}
          </>
        }
      />

      <DemoPresentationNote description="Report routing and data remain metadata-only. No BI runtime, export engine, scheduler, fetch/axios integration, or storage persistence was introduced." />
    </MeDashboardShell>
  );
}
