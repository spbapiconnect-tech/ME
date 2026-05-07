import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MeDetailWorkspace,
  MePageHeader,
  MeRecordSummary,
  MeStatusTimeline,
  MeTabs,
} from "@/components/layout";
import type { RestaurantModuleDefinition } from "@/config/restaurant-modules";

import { RestaurantModuleDetailPreview } from "./restaurant-module-detail-preview";
import { RestaurantModuleRightRail } from "./restaurant-module-right-rail";

interface RestaurantModuleDetailPageProps {
  module: RestaurantModuleDefinition;
  recordId: string;
}

export function RestaurantModuleDetailPage({ module, recordId }: RestaurantModuleDetailPageProps) {
  const preview = module.preview;

  if (!preview) {
    throw new Error(`Missing preview config for module ${module.key}`);
  }

  const titlePrefix = module.label.en;

  return (
    <MeDashboardShell activeKey={preview.activeNavKey}>
      <MePageHeader
        eyebrow={titlePrefix}
        title={`${recordId}`}
        description={preview.description}
        badges={preview.badges}
        actions={
          <>
            <Link href={module.route} className="inline-flex h-8 items-center rounded-[8px] border border-border bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Back to List
            </Link>
          </>
        }
        meta={preview.meta}
      />
      <MeRecordSummary
        title={recordId}
        subtitle={preview.recordSummary.subtitle}
        status={preview.recordSummary.status}
        meta={preview.recordSummary.meta.map((item, index) => (index === 0 ? { ...item, value: recordId } : item))}
      />
      <MeActionBar actions={preview.actionBar.map((action) => ({ ...action, href: action.href && action.href.startsWith("/") ? action.href : undefined }))} />
      <MeTabs style="detail" tabs={preview.tabs} />
      <MeDetailWorkspace
        main={
          <>
            {preview.sections.map((section) => (
              <RestaurantModuleDetailPreview key={`${module.key}-${recordId}-${section.title}`} section={section} />
            ))}
            {preview.timeline ? <MeStatusTimeline embedded title={preview.timeline.title} items={preview.timeline.items} /> : null}
          </>
        }
        context={<RestaurantModuleRightRail sections={preview.rightRail} />}
      />
    </MeDashboardShell>
  );
}
