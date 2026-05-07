import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeDetailWorkspace,
  MePageHeader,
  MeRecordSummary,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import type { PsiDetailPanelData } from "@/types/psi";

interface PsiDetailLayoutV072Props {
  title: string;
  source: string;
  isMock: boolean;
  error?: string;
  rows: Array<{ key: string; value: string }>;
  backHref: string;
  detailPanelData?: PsiDetailPanelData | null;
  relatedActions?: Array<{ label: string; actionKey: string }>;
}

function resolveActiveKey(backHref: string) {
  if (backHref.includes("supplier")) return "supplier";
  if (backHref.includes("inventory")) return "inventory";
  return "procurement";
}

export function PsiDetailLayoutV072({
  title,
  source,
  isMock,
  error,
  rows,
  backHref,
  detailPanelData = null,
  relatedActions = [],
}: PsiDetailLayoutV072Props) {
  const activeKey = resolveActiveKey(backHref);
  const summaryTitle = detailPanelData?.title.en ?? title;
  const summarySubtitle = detailPanelData?.subtitle?.en ?? "Operational record";

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Record Context",
          badge: activeKey === "procurement" ? "Procurement" : activeKey === "supplier" ? "Supplier" : "Inventory",
          items: [
            isMock ? "Published through the shared catalog layer" : "Published through the connected service layer",
            `Source: ${source}`,
            `Related actions: ${relatedActions.length}`,
          ],
        },
        {
          title: "Linked Records",
          items: detailPanelData?.linkedRecords.map((record) => `${record.moduleCode} · ${record.recordId}`) ?? ["No linked records in scope"],
        },
        {
          title: "Operational Watch",
          items: detailPanelData?.insights.slice(0, 3).map((item) => `${item.label.en}: ${item.value.en}`) ?? ["Queue review", "Related activity", "Cross-module follow-up"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey={activeKey} rightRail={rightRail}>
      <MePageHeader
        eyebrow="PSI Record"
        title={summaryTitle}
        description={summarySubtitle}
        notice={error ?? "Review the record summary, linked business records, operating timeline, and related actions from one detail workspace."}
        badges={[
          { label: activeKey === "procurement" ? "Procurement" : activeKey === "supplier" ? "Supplier" : "Inventory" },
          { label: "Record detail", variant: "secondary" },
          { label: "Current service scope", variant: "outline" },
        ]}
        meta={[
          { label: "Source", value: source },
          { label: "Timeline", value: String(detailPanelData?.timeline.length ?? 0) },
          { label: "Related actions", value: String(relatedActions.length) },
          { label: "Related records", value: String(detailPanelData?.linkedRecords.length ?? 0) },
        ]}
      />

      <MeRecordSummary
        title={summaryTitle}
        subtitle={summarySubtitle}
        status={rows[0]?.value ?? "Monitoring"}
        guardrail="Current service scope"
        meta={rows.slice(0, 8).map((row) => ({ label: row.key, value: row.value }))}
      />

      <MeActionBar
        actions={[
          { label: "Back to Workspace", href: backHref },
          ...relatedActions.slice(0, 4).map((action, index) => ({
            label: action.label,
            href: `/psi/actions/${action.actionKey}`,
            variant: (index === 0 ? "secondary" : "outline") as "secondary" | "outline",
          })),
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Related Records", badge: String(detailPanelData?.linkedRecords.length ?? 0) },
          { label: "Activity", badge: String(detailPanelData?.timeline.length ?? 0) },
          { label: "Insights" },
          { label: "Attachments" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Key Information" description="Core record fields for day-to-day operational review.">
              <div className="grid gap-3 md:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.key} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{row.key}</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{row.value}</p>
                  </div>
                ))}
              </div>
            </MeWorkspaceSection>

            {detailPanelData?.linkedRecords?.length ? (
              <MeWorkspaceSection title="Related Records" description="Connected PSI records used during review, coordination, and follow-up.">
                <MeDataTable
                  embedded
                  columns={["Module", "Record", "Status", "Route"]}
                  rows={detailPanelData.linkedRecords.map((record) => [
                    record.moduleCode,
                    record.recordId,
                    record.status ?? "Active",
                    record.route ? (
                      <Link key={`${record.key}-route`} href={record.route} className="text-blue-700 hover:underline">
                        Open record
                      </Link>
                    ) : (
                      "Linked in current workspace"
                    ),
                  ])}
                />
              </MeWorkspaceSection>
            ) : null}

            {detailPanelData?.insights?.length ? (
              <MeWorkspaceSection title="Insights" description="Operational indicators linked to the current record.">
                <MeDataTable
                  embedded
                  columns={["Indicator", "Value", "Description"]}
                  rows={detailPanelData.insights.map((item) => [item.label.en, item.value.en, item.description?.en ?? "Operational review context"])}
                />
              </MeWorkspaceSection>
            ) : null}
          </>
        }
        context={
          <MeStatusTimeline
            embedded
            title="Activity"
            items={
              detailPanelData?.timeline.map((event) => ({
                title: event.title.en,
                description: `${event.description?.en ?? "Operational update"} · ${event.actor.name.en}`,
                time: event.occurredAt,
              })) ?? []
            }
          />
        }
      />
    </MeDashboardShell>
  );
}
