"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  MeActionBar,
  MeDashboardShell,
  MeDetailWorkspace,
  MePageHeader,
  MeRecordSummary,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { MeInlineToast } from "@/components/layout/me-inline-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RestaurantModuleActionPreview, RestaurantModuleDefinition } from "@/config/restaurant-modules";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

import { RestaurantModuleDetailPreview } from "./restaurant-module-detail-preview";
import { RestaurantModuleRightRail } from "./restaurant-module-right-rail";

const commonCopy = {
  en: {
    filters: "Workspace Filters",
    filtersDescription: "Scoped selectors and operating context for the current module surface.",
    successSaved: "Workspace changes updated in the current view.",
    exportDone: "Export completed for the current workspace.",
    actionDone: "Action completed successfully.",
    loading: "Processing request...",
    drawerTitle: "Workspace action",
    drawerDescription: "Review details and update the current workspace state.",
    save: "Apply",
    cancel: "Cancel",
    confirmTitle: "Confirm update",
    confirmDescription: "This action updates the current workspace state and activity timeline.",
    confirm: "Confirm",
    selectedRecord: "Selected record",
    selectedSummary: "Current row selection updates the detail focus for this module.",
    updatedNow: "Updated just now",
  },
  zh: {
    filters: "工作区筛选",
    filtersDescription: "当前模块页面的范围筛选与运营上下文。",
    successSaved: "当前工作区已更新。",
    exportDone: "当前工作区导出已完成。",
    actionDone: "操作已完成。",
    loading: "正在处理请求...",
    drawerTitle: "工作区操作",
    drawerDescription: "查看详情并更新当前工作区状态。",
    save: "应用",
    cancel: "取消",
    confirmTitle: "确认操作",
    confirmDescription: "此操作会更新当前页面状态与活动时间线。",
    confirm: "确认",
    selectedRecord: "已选记录",
    selectedSummary: "点击表格行可切换当前模块详情焦点。",
    updatedNow: "刚刚更新",
  },
} as const;

function sanitizeDisplayText(value: string) {
  return value
    .replace(/ui preview only\.?/gi, "Operations workspace.")
    .replace(/preview only\.?/gi, "Workspace mode.")
    .replace(/frontend-only/gi, "workspace")
    .replace(/read-only/gi, "view")
    .replace(/placeholder/gi, "catalog")
    .replace(/coming soon/gi, "setup required")
    .replace(/no api/gi, "service setup")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeLabel(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("current release")) return "Operations";
  if (normalized.includes("preview")) return "Workspace";
  if (normalized.includes("read-only")) return "Workspace";
  if (normalized.includes("placeholder")) return "Catalog";
  return sanitizeDisplayText(label);
}

function buildDetailHref(route: string, recordId: string) {
  const routeBase = route === "/" ? "/branches" : route;
  return `${routeBase}/${encodeURIComponent(recordId)}`;
}

export function RestaurantModulePage({ module }: { module: RestaurantModuleDefinition }) {
  const preview = module.preview;
  const router = useRouter();
  const locale = useUiPreferencesStore((state) => state.locale);
  const copy = commonCopy[locale];
  const [selectedTab, setSelectedTab] = useState(preview?.tabs.find((tab) => tab.active)?.label ?? preview?.tabs[0]?.label ?? "Overview");
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [sheetAction, setSheetAction] = useState<RestaurantModuleActionPreview | null>(null);
  const [confirmAction, setConfirmAction] = useState<RestaurantModuleActionPreview | null>(null);
  const [toast, setToast] = useState<{ message: string; tone?: "success" | "loading" | "error" } | null>(null);
  const [timelineItems, setTimelineItems] = useState(preview?.timeline?.items ?? []);
  const [summaryStatus, setSummaryStatus] = useState(preview?.recordSummary.status ?? "");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      if (toast.tone === "loading") {
        setToast({ message: sheetAction?.label?.includes("Export") ? copy.exportDone : copy.actionDone, tone: "success" });
      } else {
        setToast(null);
      }
    }, toast.tone === "loading" ? 950 : 2200);

    return () => window.clearTimeout(timer);
  }, [copy.actionDone, copy.exportDone, sheetAction, toast]);

  if (!preview) {
    throw new Error(`Missing preview config for module ${module.key}`);
  }

  const firstTableSection = preview.sections.find((section) => section.kind === "table");
  const selectedRow = firstTableSection?.kind === "table" ? firstTableSection.rows[selectedRowIndex] : null;
  const selectedRowRecord = selectedRow?.[0] ?? preview.recordSummary.title;

  function pushTimeline(title: string) {
    setTimelineItems((current) => [
      {
        title,
        description: locale === "zh" ? "状态已在当前工作区中更新。" : "The visible workspace state was updated.",
        time: copy.updatedNow,
      },
      ...current,
    ]);
  }

  function handleAction(action: RestaurantModuleActionPreview) {
    if (action.href && action.href.startsWith("/")) {
      router.push(action.href);
      return;
    }

    const label = action.label.toLowerCase();
    if (label.includes("export") || label.includes("sync") || label.includes("test") || label.includes("run report")) {
      setSheetAction(action);
      setToast({ message: copy.loading, tone: "loading" });
      pushTimeline(action.label);
      return;
    }

    if (label.includes("approve") || label.includes("reject") || label.includes("complete") || label.includes("resolve") || label.includes("publish") || label.includes("deactivate") || label.includes("disable")) {
      setConfirmAction(action);
      return;
    }

    setSheetAction(action);
  }

  const sectionContent = preview.sections.map((section, index) => (
    <RestaurantModuleDetailPreview
      key={`${module.key}-${section.title}`}
      section={section}
      selectedRowIndex={index === 0 ? selectedRowIndex : undefined}
      onRowSelect={index === 0 ? setSelectedRowIndex : undefined}
    />
  ));

  const interactiveActionBar = preview.actionBar.map((action, index) => ({
    ...action,
    href: action.href && action.href.startsWith("/") ? action.href : undefined,
    onClick: !action.href || action.href === "#" ? () => handleAction(action) : undefined,
    variant: action.variant ?? (index === 0 ? "default" : "outline"),
  }));

  const interactivePageActions = preview.pageActions.map((action, index) => (
    <Button
      key={`${action.label}-${index}`}
      asChild={Boolean(action.href && action.href.startsWith("/"))}
      size="sm"
      variant={action.variant ?? (index === 0 ? "default" : "outline")}
      onClick={!action.href || action.href === "#" ? () => handleAction(action) : undefined}
    >
      {action.href && action.href.startsWith("/") ? <Link href={action.href}>{action.label}</Link> : <span>{action.label}</span>}
    </Button>
  ));

  return (
    <MeDashboardShell activeKey={preview.activeNavKey}>
      <MePageHeader
        eyebrow={module.label[locale]}
        title={sanitizeDisplayText(preview.title)}
        description={sanitizeDisplayText(preview.description)}
        notice={undefined}
        badges={preview.badges.map((badge) => ({ ...badge, label: normalizeLabel(badge.label) }))}
        actions={<>{interactivePageActions}</>}
        meta={preview.meta.map((item) => ({ ...item, value: sanitizeDisplayText(item.value) }))}
      />

      {toast ? <MeInlineToast message={toast.message} tone={toast.tone} /> : null}

      {preview.metrics?.length ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {preview.metrics.map((metric) => (
            <Card key={metric.label} size="sm" className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <CardContent className="pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                <p className="mt-1.5 text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-950">{metric.value}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{sanitizeDisplayText(metric.description)}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {preview.filters?.length ? (
        <MeWorkspaceSection title={copy.filters} description={copy.filtersDescription}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {preview.filters.map((filterItem) => (
              <button
                key={filterItem.label}
                type="button"
                onClick={() => setToast({ message: `${filterItem.label}: ${filterItem.value}`, tone: "success" })}
                className="rounded-[10px] border border-border bg-slate-50 px-4 py-3.5 text-left"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{filterItem.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-900">{sanitizeDisplayText(filterItem.value)}</p>
              </button>
            ))}
          </div>
        </MeWorkspaceSection>
      ) : null}

      <MeRecordSummary
        title={preview.recordSummary.title}
        subtitle={preview.recordSummary.subtitle}
        status={summaryStatus}
        meta={preview.recordSummary.meta}
      />

      <MeActionBar actions={interactiveActionBar} />
      <MeTabs style="detail" tabs={preview.tabs.map((tab) => ({ ...tab, active: tab.label === selectedTab }))} onTabChange={setSelectedTab} />

      <MeDetailWorkspace
        main={
          <>
            {selectedRow ? (
              <MeWorkspaceSection title={copy.selectedRecord} description={copy.selectedSummary}>
                <div className="grid gap-4 md:grid-cols-3">
                  {firstTableSection?.columns.slice(0, selectedRow.length).map((column, index) => (
                    <div key={column} className="rounded-[10px] border border-border bg-slate-50 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{column}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{sanitizeDisplayText(selectedRow[index])}</p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="self-end">
                    <Link href={buildDetailHref(module.route, String(selectedRowRecord))}>Open Detail</Link>
                  </Button>
                </div>
              </MeWorkspaceSection>
            ) : null}
            {sectionContent}
            {timelineItems.length ? <MeStatusTimeline embedded title={preview.timeline?.title ?? "Activity"} items={timelineItems} /> : null}
          </>
        }
        context={<RestaurantModuleRightRail sections={preview.rightRail} />}
      />

      <Sheet open={Boolean(sheetAction)} onOpenChange={(open) => !open && setSheetAction(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{sheetAction?.label ?? copy.drawerTitle}</SheetTitle>
            <SheetDescription>{copy.drawerDescription}</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4 text-sm text-slate-600">
            <div className="rounded-[10px] border border-border bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Record</p>
              <p className="mt-1.5 font-semibold text-slate-900">{selectedRowRecord}</p>
            </div>
            <div className="rounded-[10px] border border-border bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Workspace</p>
              <p className="mt-1.5 font-semibold text-slate-900">{module.label[locale]}</p>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setSheetAction(null)}>
              {copy.cancel}
            </Button>
            <Button
              onClick={() => {
                if (sheetAction) {
                  pushTimeline(sheetAction.label);
                  setSummaryStatus(sheetAction.label.includes("Assign") ? "Assigned" : summaryStatus);
                }
                setSheetAction(null);
                setToast({ message: copy.successSaved, tone: "success" });
              }}
            >
              {copy.save}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.label ?? copy.confirmTitle}</DialogTitle>
            <DialogDescription>{copy.confirmDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              {copy.cancel}
            </Button>
            <Button
              onClick={() => {
                if (confirmAction) {
                  pushTimeline(confirmAction.label);
                  if (/approve|publish|complete|resolve|verify/i.test(confirmAction.label)) {
                    setSummaryStatus(locale === "zh" ? "已更新" : "Updated");
                  }
                }
                setConfirmAction(null);
                setToast({ message: copy.actionDone, tone: "success" });
              }}
            >
              {copy.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MeDashboardShell>
  );
}
