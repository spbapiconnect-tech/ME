"use client";

import Link from "next/link";
import * as React from "react";

import { DashboardLayoutCard } from "@/components/reports/dashboard-layout-card";
import { ReportWidgetCard } from "@/components/reports/report-widget-card";
import { ReportWidgetPreviewCard } from "@/components/reports/report-widget-preview-card";
import { ReportWidgetSourceCard } from "@/components/reports/report-widget-source-card";
import { PsiReportDashboardPanel } from "@/components/reports/psi-report-dashboard-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const layoutBySelectedWidget = React.useMemo(
    () => (selectedWidget ? getLayoutsByWidget(selectedWidget.key) : []),
    [selectedWidget],
  );

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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">ME Reports</CardTitle>
          <CardDescription>Dashboard Widget / Report Contract Foundation</CardDescription>
          <CardDescription>
            {currentLocale === "zh"
              ? "该页面仅用于报表组件元数据预览：不执行 BI 引擎、图表渲染引擎、SQL、数据库查询、API、导出或定时发送。"
              : "Metadata-only report widget preview: no BI engine, chart execution engine, SQL, database query, API/backend, export engine, or scheduled sending."}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/">Back To Dashboard</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/notifications">ME Notifications</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/workflow">ME Workflow</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/action-contracts">ME Action Contracts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/access-control">ME Access Control</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/audit-trail">ME Audit Trail</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/layout-engine">ME Layout Engine</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/components">ME Core Components</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/rules">ME Rules</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/packages">ME Packages</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/psi">ME PSI</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Widget Stats</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 md:max-w-2xl md:grid-cols-6">
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Total</div><div className="text-lg font-semibold">{stats.total}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Active</div><div className="text-lg font-semibold">{stats.active}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Placeholder</div><div className="text-lg font-semibold">{stats.placeholder}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Exportable</div><div className="text-lg font-semibold">{stats.exportable}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Refreshable</div><div className="text-lg font-semibold">{stats.refreshable}</div></div>
            <div className="rounded-xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">Drill Down</div><div className="text-lg font-semibold">{stats.drillDown}</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.byType).map(([key, value]) => <Badge key={key} variant="secondary">{key}: {value}</Badge>)}</div>
          <div className="flex flex-wrap gap-1.5 text-xs">{Object.entries(stats.bySourceModule).map(([key, value]) => <Badge key={key} variant="outline">{key}: {value}</Badge>)}</div>
        </CardContent>
      </Card>

      {psiDashboardData ? (
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-sm">ME PSI Report Preview</CardTitle>
            <CardDescription>
              {currentLocale === "zh"
                ? "PSI 业务 mock 数据只读预览区：不执行 BI 引擎、SQL、数据库查询、API、导出或调度。"
                : "Read-only PSI mock business preview: no BI engine, SQL, database query, API, export, or scheduling."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <PsiReportDashboardPanel data={psiDashboardData} locale={currentLocale} />
          </CardContent>
        </Card>
      ) : null}

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
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
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-1"><CardTitle className="text-sm">Report Widget Catalog</CardTitle><CardDescription className="text-xs">{filteredWidgets.length} / {reportWidgetRegistry.length}</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {filteredWidgets.map((item) => (
              <button key={item.key} type="button" className="text-left" onClick={() => setSelectedWidgetKey(item.key)}>
                <ReportWidgetCard widget={item} locale={currentLocale} />
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {selectedWidget ? <ReportWidgetPreviewCard widget={selectedWidget} locale={currentLocale} /> : null}
          {selectedWidget ? <ReportWidgetSourceCard widget={selectedWidget} locale={currentLocale} /> : null}
          {selectedWidget ? (
            <Card size="sm">
              <CardHeader className="gap-1"><CardTitle className="text-sm">Related Contract Keys</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {selectedWidget.source.actionKey ? <div>ActionContract key: {selectedWidget.source.actionKey}</div> : null}
                {selectedWidget.source.accessRuleKey ? <div>AccessRule key: {selectedWidget.source.accessRuleKey}</div> : null}
                {selectedWidget.source.auditEventKey ? <div>AuditEventContract key: {selectedWidget.source.auditEventKey}</div> : null}
                {selectedWidget.source.workflowKey ? <div>WorkflowContract key: {selectedWidget.source.workflowKey}</div> : null}
                {selectedWidget.source.notificationKey ? <div>NotificationContract key: {selectedWidget.source.notificationKey}</div> : null}
              </CardContent>
            </Card>
          ) : null}
          {layoutBySelectedWidget.length > 0 ? (
            <Card size="sm">
              <CardHeader className="gap-1"><CardTitle className="text-sm">Dashboard Layout Links</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {layoutBySelectedWidget.map((layout) => (
                  <div key={layout.key}>{layout.key}</div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <Card size="sm">
        <CardHeader className="gap-1"><CardTitle className="text-sm">Dashboard Layout Catalog</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Select value={selectedLayoutKey} onValueChange={setSelectedLayoutKey}>
            <SelectTrigger size="sm" className="min-w-[16rem]"><SelectValue placeholder="Dashboard Layout" /></SelectTrigger>
            <SelectContent>{dashboardLayoutCatalog.map((item) => <SelectItem key={item.key} value={item.key}>{currentLocale === "zh" ? item.name.zh : item.name.en}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>
      <section className="grid gap-3 md:grid-cols-2">
        {selectedLayout ? <DashboardLayoutCard layout={selectedLayout} locale={currentLocale} /> : null}
        {dashboardLayoutCatalog.filter((item) => item.key !== selectedLayout?.key).map((layout) => (
          <DashboardLayoutCard key={layout.key} layout={layout} locale={currentLocale} />
        ))}
      </section>
    </main>
  );
}
