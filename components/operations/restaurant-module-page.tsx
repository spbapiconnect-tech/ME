import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RestaurantModuleDefinition } from "@/config/restaurant-modules";

import { RestaurantModuleDetailPreview } from "./restaurant-module-detail-preview";
import { RestaurantModuleRightRail } from "./restaurant-module-right-rail";

export function RestaurantModulePage({ module }: { module: RestaurantModuleDefinition }) {
  const preview = module.preview;

  if (!preview) {
    throw new Error(`Missing preview config for module ${module.key}`);
  }

  return (
    <MeDashboardShell activeKey={preview.activeNavKey}>
      <MePageHeader
        eyebrow={preview.eyebrow}
        title={preview.title}
        description={preview.description}
        notice={preview.notice}
        badges={preview.badges}
        actions={
          <>
            {preview.pageActions.map((action, index) => (
              <Button key={`${action.label}-${index}`} asChild size="sm" variant={action.variant ?? (index === 0 ? "default" : "outline")}>
                <Link href={action.href ?? "#"}>{action.label}</Link>
              </Button>
            ))}
          </>
        }
        meta={preview.meta}
      />

      {preview.metrics?.length ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {preview.metrics.map((metric) => (
            <Card key={metric.label} size="sm" className="border-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <CardContent className="pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                <p className="mt-1.5 text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-950">{metric.value}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {preview.filters?.length ? (
        <MeWorkspaceSection title="Workspace Filters" description="Read-only selectors and operating context for the current module preview.">
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

      <MeActionBar actions={preview.actionBar} />
      <MeTabs style="detail" tabs={preview.tabs} />

      <MeDetailWorkspace
        main={
          <>
            {preview.sections.map((section) => (
              <RestaurantModuleDetailPreview key={`${module.key}-${section.title}`} section={section} />
            ))}
            {preview.timeline ? <MeStatusTimeline embedded title={preview.timeline.title} items={preview.timeline.items} /> : null}
          </>
        }
        context={<RestaurantModuleRightRail sections={preview.rightRail} />}
      />

      <DemoPresentationNote description={preview.footerNote} />
    </MeDashboardShell>
  );
}
