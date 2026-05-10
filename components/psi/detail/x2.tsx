"use client";

import Link from "next/link";

import {
  MeActionBar,
  MeDataTable,
  MeDetailWorkspace,
  MeRecordSummary,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { ErpPageHeader, ErpShell } from "@/components/erp";
import { psiVisual } from "@/components/psi/psi-visual";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
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

function getLocalizedMetaLabel(record: DisplayRecord["meta"][number], locale: PsiLocale) {
  return locale === "zh" ? record.label.zh : record.label.en;
}

function getModuleLabel(activeKey: "procurement" | "supplier" | "inventory", psiCopy: ReturnType<typeof getPsiCopy>) {
  if (activeKey === "supplier") return psiCopy.shared.supplier;
  if (activeKey === "inventory") return psiCopy.shared.inventory;
  return psiCopy.shared.procurement;
}

function getPageTitle(activeKey: "procurement" | "supplier" | "inventory", fallbackTitle: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  if (activeKey === "supplier") return psiCopy.workspace.supplierTitle;
  if (activeKey === "inventory") return psiCopy.workspace.inventoryTitle;
  if (activeKey === "procurement") return psiCopy.workspace.procurementTitle;
  return fallbackTitle;
}

function getPageSubtitle(activeKey: "procurement" | "supplier" | "inventory", fallbackSubtitle: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  if (activeKey === "supplier") return psiCopy.workspace.supplierSubtitle;
  if (activeKey === "inventory") return psiCopy.workspace.inventorySubtitle;
  if (activeKey === "procurement") return psiCopy.workspace.procurementSubtitle;
  return fallbackSubtitle;
}

function getStatLabel(label: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  const key = label.toLowerCase();
  if (key.includes("purchase requests")) return psiCopy.workspace.stats.purchaseRequests;
  if (key.includes("pending requests")) return psiCopy.workspace.stats.pendingRequests;
  if (key.includes("purchase orders")) return psiCopy.workspace.stats.purchaseOrders;
  if (key.includes("issue open")) return psiCopy.workspace.stats.issueOpen;
  return label;
}

function getActionShortcutLabel(actionKey: string, fallbackLabel: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  if (actionKey === "psi.action.createPurchaseRequest") return psiCopy.workspace.createPurchaseRequest;
  if (actionKey === "psi.action.recordReceiving") return psiCopy.workspace.recordReceiving;
  if (actionKey === "psi.action.reportPurchaseIssue") return psiCopy.workspace.reportPurchaseIssue;
  return fallbackLabel;
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
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);

  const selectedRecord = records[0];

  const activeKey = detailBasePath.includes("supplier")
    ? "supplier"
    : detailBasePath.includes("inventory")
      ? "inventory"
      : "procurement";

  const moduleLabel = getModuleLabel(activeKey, psiCopy);
  const pageTitle = getPageTitle(activeKey, title, psiCopy);
  const pageSubtitle = getPageSubtitle(activeKey, subtitle, psiCopy);


  return (
    <ErpShell activeHref={detailBasePath}>
      <div className={`${psiVisual.pageStack} psi-procurement-scope`}>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", moduleLabel]}
          title={pageTitle}
          zhTitle={moduleLabel}
          subtitle={
            error ??
            `${pageSubtitle} · ${psiCopy.shared.source}: ${source} · ${
              isMock ? psiCopy.rightRail.catalogLayerShort : psiCopy.rightRail.connectedServiceShort
            } · ${records.length} ${psiCopy.rightRail.visibleRecordsSuffix}`
          }
        />

      <MeActionBar
        actions={[
          { label: psiCopy.workspace.openPsiActions, href: "/psi/actions" },
          { label: psiCopy.workspace.openIssues, href: "/psi/issues", variant: "secondary" },
          { label: psiCopy.workspace.openReports, href: "/reports", variant: "outline" },
          ...actionShortcuts.slice(0, 2).map((item) => ({
            label: getActionShortcutLabel(item.actionKey, item.label, psiCopy),
            href: `/psi/actions/${item.actionKey}`,
            variant: "outline" as const,
          })),
        ]}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <MeWorkspaceSection key={item.label} title={getStatLabel(item.label, psiCopy)} className="shadow-[0_1px_2px_rgba(15,23,42,0.04)]" description={undefined}>
            <p className="text-[1.55rem] font-semibold tracking-[-0.02em] text-foreground">{item.value}</p>
          </MeWorkspaceSection>
        ))}
      </section>

      {selectedRecord ? (
        <MeRecordSummary
          title={selectedRecord.id}
          subtitle={selectedRecord.title}
          status={selectedRecord.status}
          guardrail={psiCopy.rightRail.currentServiceScope}
          meta={[
            { label: psiCopy.shared.priority, value: selectedRecord.priority },
            { label: psiCopy.workspace.owner, value: getMetaValue(selectedRecord, "owner") },
            { label: psiCopy.workspace.supplier, value: getMetaValue(selectedRecord, "supplier") },
            { label: psiCopy.workspace.branch, value: getMetaValue(selectedRecord, "branch") },
            { label: psiCopy.workspace.lifecycle, value: getMetaValue(selectedRecord, "lifecycle", "Active") },
            { label: psiCopy.workspace.action, value: getMetaValue(selectedRecord, "related action", psiCopy.workspace.operationalFollowUp) },
          ]}
        />
      ) : null}

      <MeTabs
        style="detail"
        tabs={[
          { label: psiCopy.shared.overview, active: true },
          { label: psiCopy.workspace.queue, badge: String(records.length) },
          { label: psiCopy.shared.issues, badge: String(issueRecords.length) },
          { label: psiCopy.shared.activity },
          { label: psiCopy.shared.attachments },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={psiCopy.workspace.mainRecords} description={psiCopy.workspace.mainRecordsDescription}>
              <MeDataTable
                embedded
                columns={[psiCopy.workspace.columns.record, psiCopy.workspace.title, psiCopy.shared.status, psiCopy.shared.priority, psiCopy.workspace.openRecord]}
                rows={records.map((record) => [
                  record.id,
                  <div key={`${record.id}-title`}>
                    <p className="font-medium text-foreground">{record.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{record.subtitle}</p>
                  </div>,
                  record.status,
                  record.priority,
                  <Link key={`${record.id}-open`} href={`${detailBasePath}/${record.id}`} className="text-blue-700 hover:underline">
                    {psiCopy.workspace.openRecord}
                  </Link>,
                ])}
              />
            </MeWorkspaceSection>

            {selectedRecord ? (
              <MeWorkspaceSection title={psiCopy.workspace.selectedRecord} description={psiCopy.workspace.selectedRecordDescription}>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedRecord.meta.map((item) => (
                    <div key={item.label.en} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{getLocalizedMetaLabel(item, currentLocale)}</p>
                      <p className="mt-1.5 text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </MeWorkspaceSection>
            ) : null}

            <MeWorkspaceSection title={psiCopy.workspace.issueQueue} description={psiCopy.workspace.issueQueueDescription}>
              <MeDataTable
                embedded
                columns={[psiCopy.workspace.columns.issue, psiCopy.shared.status, psiCopy.shared.priority, psiCopy.workspace.columns.lifecycle]}
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
            title={psiCopy.shared.activity}
            items={issueRecords.slice(0, 4).map((record, index) => ({
              title: record.title,
              description: record.description,
              time: getMetaValue(record, "source", `Update ${index + 1}`),
            }))}
          />
        }
      />
      </div>
    </ErpShell>
  );
}
