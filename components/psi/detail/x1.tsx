"use client";

import Link from "next/link";

import {
  MeActionBar,
  MeDataTable,
  MeDetailWorkspace,
  MeRecordSummary,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { ErpPageHeader, ErpShell } from "@/components/erp";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
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

type PsiActiveKey = "procurement" | "supplier" | "inventory";

function resolveActiveKey(backHref: string): PsiActiveKey {
  if (backHref.includes("supplier")) return "supplier";
  if (backHref.includes("inventory")) return "inventory";
  return "procurement";
}

function getModuleLabel(activeKey: PsiActiveKey, psiCopy: ReturnType<typeof getPsiCopy>) {
  if (activeKey === "supplier") return psiCopy.shared.supplier;
  if (activeKey === "inventory") return psiCopy.shared.inventory;
  return psiCopy.shared.procurement;
}

function getLocalizedActionLabel(actionKey: string, fallback: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  const map: Record<string, string> = {
    "psi.action.createPurchaseRequest": psiCopy.workspace.createPurchaseRequest,
    "psi.action.recordReceiving": psiCopy.workspace.recordReceiving,
    "psi.action.reportPurchaseIssue": psiCopy.workspace.reportPurchaseIssue,
    "psi.action.addSupplier": psiCopy.actions.options.supplier,
    "psi.action.reviewSupplier": psiCopy.overview.reviewSupplier,
    "psi.action.reportSupplierIssue": psiCopy.actions.options.reportIssue,
    "psi.action.adjustInventory": psiCopy.actions.options.adjust,
    "psi.action.transferStock": psiCopy.actions.options.transfer,
    "psi.action.reportInventoryIssue": psiCopy.actions.options.reportIssue,
  };

  return map[actionKey] ?? fallback;
}

function getLocalizedRowKey(key: string, psiCopy: ReturnType<typeof getPsiCopy>) {
  const normalized = key.toLowerCase();

  if (normalized.includes("source")) return psiCopy.shared.source;
  if (normalized.includes("status")) return psiCopy.shared.status;
  if (normalized.includes("priority")) return psiCopy.shared.priority;
  if (normalized.includes("supplier")) return psiCopy.shared.supplier;
  if (normalized.includes("inventory")) return psiCopy.shared.inventory;
  if (normalized.includes("procurement")) return psiCopy.shared.procurement;
  if (normalized.includes("branch")) return psiCopy.workspace.branch;
  if (normalized.includes("owner")) return psiCopy.workspace.owner;
  if (normalized.includes("lifecycle")) return psiCopy.workspace.lifecycle;
  if (normalized.includes("action")) return psiCopy.workspace.action;
  if (normalized.includes("record")) return psiCopy.shared.record;
  if (normalized.includes("module")) return psiCopy.shared.module;

  return key;
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
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);

  const activeKey = resolveActiveKey(backHref);
  const moduleLabel = getModuleLabel(activeKey, psiCopy);
  const summaryTitle = detailPanelData ? (currentLocale === "zh" ? detailPanelData.title.zh : detailPanelData.title.en) : title;
  const summarySubtitle = detailPanelData?.subtitle
    ? currentLocale === "zh"
      ? detailPanelData.subtitle.zh
      : detailPanelData.subtitle.en
    : psiCopy.detail.psiRecord;

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: psiCopy.detail.recordContext,
          badge: moduleLabel,
          items: [
            isMock ? psiCopy.rightRail.catalogLayer : psiCopy.rightRail.connectedService,
            `${psiCopy.shared.source}: ${source}`,
            `${psiCopy.detail.actionsCountPrefix}: ${relatedActions.length}`,
          ],
        },
        {
          title: psiCopy.shared.linkedRecords,
          items: detailPanelData?.linkedRecords.map((record) => `${record.moduleCode} · ${record.recordId}`) ?? [psiCopy.detail.noLinkedRecords],
        },
        {
          title: psiCopy.detail.operationalWatch,
          items:
            detailPanelData?.insights.slice(0, 3).map((item) => {
              const label = currentLocale === "zh" ? item.label.zh : item.label.en;
              const value = currentLocale === "zh" ? item.value.zh : item.value.en;
              return `${label}: ${value}`;
            }) ?? [psiCopy.detail.queueReview, psiCopy.detail.relatedActivity, psiCopy.detail.crossModuleFollowUp],
        },
      ]}
    />
  );

  return (
    <ErpShell activeHref={backHref}>
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", moduleLabel, psiCopy.detail.recordDetail]}
          title={summaryTitle}
          zhTitle={moduleLabel}
          subtitle={
            error ??
            `${summarySubtitle} · ${psiCopy.shared.source}: ${source} · ${
              isMock ? psiCopy.rightRail.catalogLayerShort : psiCopy.rightRail.connectedServiceShort
            } · ${psiCopy.shared.relatedActions}: ${relatedActions.length}`
          }
        />

      <MeRecordSummary
        title={summaryTitle}
        subtitle={summarySubtitle}
        status={rows[0]?.value ?? psiCopy.detail.monitoring}
        guardrail={psiCopy.rightRail.currentServiceScope}
        meta={rows.slice(0, 8).map((row) => ({ label: getLocalizedRowKey(row.key, psiCopy), value: row.value }))}
      />

      <MeActionBar
        actions={[
          { label: psiCopy.detail.backToWorkspace, href: backHref },
          ...relatedActions.slice(0, 4).map((action, index) => ({
            label: getLocalizedActionLabel(action.actionKey, action.label, psiCopy),
            href: `/psi/actions/${action.actionKey}`,
            variant: (index === 0 ? "secondary" : "outline") as "secondary" | "outline",
          })),
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: psiCopy.shared.overview, active: true },
          { label: psiCopy.shared.relatedRecords, badge: String(detailPanelData?.linkedRecords.length ?? 0) },
          { label: psiCopy.shared.activity, badge: String(detailPanelData?.timeline.length ?? 0) },
          { label: psiCopy.detail.insights },
          { label: psiCopy.shared.attachments },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={psiCopy.detail.keyInformation} description={psiCopy.detail.keyInformationDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.key} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{getLocalizedRowKey(row.key, psiCopy)}</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{row.value}</p>
                  </div>
                ))}
              </div>
            </MeWorkspaceSection>

            {detailPanelData?.linkedRecords?.length ? (
              <MeWorkspaceSection title={psiCopy.shared.relatedRecords} description={psiCopy.detail.relatedRecordsDescription}>
                <MeDataTable
                  embedded
                  columns={[psiCopy.shared.module, psiCopy.shared.record, psiCopy.shared.status, psiCopy.detail.route]}
                  rows={detailPanelData.linkedRecords.map((record) => [
                    record.moduleCode,
                    record.recordId,
                    record.status ?? psiCopy.detail.active,
                    record.route ? (
                      <Link key={`${record.key}-route`} href={record.route} className="text-blue-700 hover:underline">
                        {psiCopy.detail.openRecord}
                      </Link>
                    ) : (
                      psiCopy.detail.linkedInCurrentWorkspace
                    ),
                  ])}
                />
              </MeWorkspaceSection>
            ) : null}

            {detailPanelData?.insights?.length ? (
              <MeWorkspaceSection title={psiCopy.detail.insights} description={psiCopy.detail.insightsDescription}>
                <MeDataTable
                  embedded
                  columns={[psiCopy.detail.indicator, psiCopy.detail.value, psiCopy.detail.description]}
                  rows={detailPanelData.insights.map((item) => [
                    currentLocale === "zh" ? item.label.zh : item.label.en,
                    currentLocale === "zh" ? item.value.zh : item.value.en,
                    item.description ? (currentLocale === "zh" ? item.description.zh : item.description.en) : psiCopy.detail.operationalReviewContext,
                  ])}
                />
              </MeWorkspaceSection>
            ) : null}
          </>
        }
        context={
          <MeStatusTimeline
            embedded
            title={psiCopy.shared.activity}
            items={
              detailPanelData?.timeline.map((event) => ({
                title: currentLocale === "zh" ? event.title.zh : event.title.en,
                description: `${event.description ? (currentLocale === "zh" ? event.description.zh : event.description.en) : psiCopy.detail.operationalUpdate} · ${
                  currentLocale === "zh" ? event.actor.name.zh : event.actor.name.en
                }`,
                time: event.occurredAt,
              })) ?? []
            }
          />
        }
      />
      </div>
    </ErpShell>
  );
}
