"use client";

import Link from "next/link";

import { ErpPageHeader, ErpShell } from "@/components/erp";
import {
  MeActionBar,
  MeDetailWorkspace,
  MeRecordSummary,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import type { RestaurantModuleDefinition } from "@/config/restaurant-modules";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

import { RestaurantModuleDetailPreview } from "@/components/operations/restaurant-module-detail-preview";
import { RestaurantModuleRightRail } from "@/components/operations/restaurant-module-right-rail";

function buildDetailHref(route: string, recordId: string) {
  const routeBase = route === "/" ? "/branches" : route;
  return `${routeBase}/${encodeURIComponent(recordId)}`;
}

export function PsiReceivingErpPage({ module }: { module: RestaurantModuleDefinition }) {
  const preview = module.preview;
  const locale = useUiPreferencesStore((state) => state.locale);

  if (!preview) {
    throw new Error(`Missing preview config for module ${module.key}`);
  }

  const firstTableSection = preview.sections.find((section) => section.kind === "table");
  const selectedRow = firstTableSection?.kind === "table" ? firstTableSection.rows[0] : null;
  const selectedRowRecord = selectedRow?.[0] ?? preview.recordSummary.title;

  const actionBar = preview.actionBar.map((action, index) => ({
    ...action,
    href: action.href && action.href.startsWith("/") ? action.href : undefined,
    variant: action.variant ?? (index === 0 ? "default" : "outline"),
  }));

  return (
    <ErpShell activeHref="/psi/receiving">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", module.label[locale]]}
          title={preview.title}
          zhTitle={module.label.zh}
          subtitle={preview.description}
          actions={
            <>
              {preview.pageActions.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  asChild={Boolean(action.href && action.href.startsWith("/"))}
                  size="sm"
                  variant={action.variant ?? (index === 0 ? "default" : "outline")}
                >
                  {action.href && action.href.startsWith("/") ? <Link href={action.href}>{action.label}</Link> : <span>{action.label}</span>}
                </Button>
              ))}
            </>
          }
        />

        {preview.metrics?.length ? (
          <section className="grid gap-3 md:grid-cols-3">
            {preview.metrics.map((metric) => (
              <MeWorkspaceSection key={metric.label} title={metric.label} description={metric.description}>
                <p className="text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-950">{metric.value}</p>
              </MeWorkspaceSection>
            ))}
          </section>
        ) : null}

        {preview.filters?.length ? (
          <MeWorkspaceSection title={locale === "zh" ? "工作区筛选" : "Workspace Filters"} description={locale === "zh" ? "当前收货页面的运营筛选范围。" : "Operating filters for the receiving workspace."}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {preview.filters.map((filterItem) => (
                <div key={filterItem.label} className="rounded-[10px] border border-border bg-slate-50 px-4 py-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{filterItem.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{filterItem.value}</p>
                </div>
              ))}
            </div>
          </MeWorkspaceSection>
        ) : null}

        <MeRecordSummary
          title={preview.recordSummary.title}
          subtitle={preview.recordSummary.subtitle}
          status={preview.recordSummary.status}
          guardrail={preview.recordSummary.guardrail}
          meta={preview.recordSummary.meta}
        />

        <MeActionBar actions={actionBar} />

        <MeTabs style="detail" tabs={preview.tabs} />

        <MeDetailWorkspace
          main={
            <>
              {selectedRow ? (
                <MeWorkspaceSection title={locale === "zh" ? "已选记录" : "Selected record"} description={locale === "zh" ? "当前收货记录的重点字段。" : "Key fields for the current receiving record."}>
                  <div className="grid gap-4 md:grid-cols-3">
                    {firstTableSection?.kind === "table"
                      ? firstTableSection.columns.slice(0, selectedRow.length).map((column, index) => (
                          <div key={column} className="rounded-[10px] border border-border bg-slate-50 px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{column}</p>
                            <p className="mt-1.5 text-sm font-semibold text-slate-900">{selectedRow[index]}</p>
                          </div>
                        ))
                      : null}
                    <Button asChild variant="outline" size="sm" className="self-end">
                      <Link href={buildDetailHref(module.route, String(selectedRowRecord))}>Open Detail</Link>
                    </Button>
                  </div>
                </MeWorkspaceSection>
              ) : null}

              {preview.sections.map((section, index) => (
                <RestaurantModuleDetailPreview
                  key={`${module.key}-${section.title}`}
                  section={section}
                  selectedRowIndex={index === 0 ? 0 : undefined}
                />
              ))}

              {preview.timeline?.items.length ? (
                <MeStatusTimeline embedded title={preview.timeline.title} items={preview.timeline.items} />
              ) : null}
            </>
          }
          context={<RestaurantModuleRightRail sections={preview.rightRail} />}
        />
      </div>
    </ErpShell>
  );
}
