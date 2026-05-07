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
import type { DisplayRecord } from "@/types/display-model";

interface PsiWorkspaceLayoutV072Props {
  title: string;
  subtitle: string;
  source: string;
  isMock: boolean;
  error?: string;
  stats: Array<{ label: string; value: string | number }>;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
  detailBasePath: string;
  actionShortcuts?: Array<{ label: string; actionKey: string }>;
}

function getMetaValue(record: DisplayRecord, key: string, fallback = "Operational review") {
  return record.meta.find((item) => item.label.en.toLowerCase().includes(key.toLowerCase()))?.value ?? fallback;
}

export function PsiWorkspaceLayoutV072({
  title,
  subtitle,
  source,
  isMock,
  error,
  stats,
  records,
  issueRecords,
  detailBasePath,
  actionShortcuts = [],
}: PsiWorkspaceLayoutV072Props) {
  const selectedRecord = records[0];

  const activeKey = detailBasePath.includes("supplier")
    ? "supplier"
    : detailBasePath.includes("inventory")
      ? "inventory"
      : "procurement";

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Workspace Context",
          badge: activeKey === "procurement" ? "Procurement" : activeKey === "supplier" ? "Supplier" : "Inventory",
          items: ["Queue review", "Linked issue context", "Branch coordination"],
        },
        {
          title: "Service Layer",
          items: [
            isMock ? "Published through the shared catalog layer" : "Published through the connected service layer",
            `Source: ${source}`,
            `${records.length} active records in scope`,
          ],
        },
        {
          title: "Issue Watch",
          items: [`${issueRecords.length} linked issue records`, "Escalation review", "Timeline follow-up"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey={activeKey} rightRail={rightRail}>
      <MePageHeader
        eyebrow="PSI Workspace"
        title={title}
        description={subtitle}
        notice={error ?? `Use this workspace to review queue records, issue watch items, and operating activity for ${title.toLowerCase()}.`}
        badges={[
          { label: activeKey === "procurement" ? "Procurement" : activeKey === "supplier" ? "Supplier" : "Inventory" },
          { label: "Operational queue", variant: "secondary" },
          { label: "Current service scope", variant: "outline" },
        ]}
        meta={[
          { label: "Source", value: source },
          { label: "Visible records", value: String(records.length) },
          { label: "Issue watch", value: String(issueRecords.length) },
          { label: "Delivery mode", value: isMock ? "Catalog layer" : "Connected service" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Open PSI Actions", href: "/psi/actions" },
          { label: "Open Issues", href: "/psi/issues", variant: "secondary" },
          { label: "Open Reports", href: "/reports", variant: "outline" },
          ...actionShortcuts.slice(0, 2).map((item) => ({
            label: item.label,
            href: `/psi/actions/${item.actionKey}`,
            variant: "outline" as const,
          })),
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <MeWorkspaceSection key={item.label} title={item.label} className="shadow-[0_1px_2px_rgba(15,23,42,0.04)]" description={undefined}>
            <p className="text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-950">{item.value}</p>
          </MeWorkspaceSection>
        ))}
      </section>

      {selectedRecord ? (
        <MeRecordSummary
          title={selectedRecord.id}
          subtitle={selectedRecord.title}
          status={selectedRecord.status}
          guardrail="Current service scope"
          meta={[
            { label: "Priority", value: selectedRecord.priority },
            { label: "Owner", value: getMetaValue(selectedRecord, "owner") },
            { label: "Supplier", value: getMetaValue(selectedRecord, "supplier") },
            { label: "Branch", value: getMetaValue(selectedRecord, "branch") },
            { label: "Lifecycle", value: getMetaValue(selectedRecord, "lifecycle", "Active") },
            { label: "Action", value: getMetaValue(selectedRecord, "related action", "Operational follow-up") },
          ]}
        />
      ) : null}

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Queue", badge: String(records.length) },
          { label: "Issues", badge: String(issueRecords.length) },
          { label: "Activity" },
          { label: "Attachments" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Main Records" description="Primary queue records currently visible for operational review.">
              <MeDataTable
                embedded
                columns={["Record", "Title", "Status", "Priority", "Open"]}
                rows={records.map((record) => [
                  record.id,
                  <div key={`${record.id}-title`}>
                    <p className="font-medium text-slate-900">{record.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.subtitle}</p>
                  </div>,
                  record.status,
                  record.priority,
                  <Link key={`${record.id}-open`} href={`${detailBasePath}/${record.id}`} className="text-blue-700 hover:underline">
                    Open record
                  </Link>,
                ])}
              />
            </MeWorkspaceSection>

            {selectedRecord ? (
              <MeWorkspaceSection title="Selected Record" description="Structured metadata for the currently highlighted queue record.">
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedRecord.meta.map((item) => (
                    <div key={item.label.en} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label.en}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </MeWorkspaceSection>
            ) : null}

            <MeWorkspaceSection title="Issue Queue" description="Issue and follow-up records linked to the current PSI workspace.">
              <MeDataTable
                embedded
                columns={["Issue", "Status", "Priority", "Lifecycle"]}
                rows={issueRecords.map((record) => [
                  record.title,
                  record.status,
                  record.priority,
                  getMetaValue(record, "lifecycle"),
                ])}
              />
            </MeWorkspaceSection>
          </>
        }
        context={
          <MeStatusTimeline
            embedded
            title="Activity"
            items={issueRecords.slice(0, 4).map((record, index) => ({
              title: record.title,
              description: record.description,
              time: getMetaValue(record, "source", `Update ${index + 1}`),
            }))}
          />
        }
      />
    </MeDashboardShell>
  );
}
