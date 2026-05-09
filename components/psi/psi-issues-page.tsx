"use client";

import Link from "next/link";

import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MeDetailWorkspace,
  MePageHeader,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import type { PsiIssuePlaceholderRow } from "@/lib/page-data/psi/issues-page-data";

interface PsiIssuesPageProps {
  rows: PsiIssuePlaceholderRow[];
  source: string;
  isMock: boolean;
  error?: string;
}

function getModuleLabel(moduleCode: PsiIssuePlaceholderRow["moduleCode"], psiCopy: ReturnType<typeof getPsiCopy>) {
  if (moduleCode === "supplier") return psiCopy.shared.supplier;
  if (moduleCode === "inventory") return psiCopy.shared.inventory;
  return psiCopy.shared.procurement;
}

export function PsiIssuesPage({ rows, source, isMock, error }: PsiIssuesPageProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: psiCopy.rightRail.issueContext,
          badge: psiCopy.shared.psi,
          items: [
            psiCopy.rightRail.procurementFollowUp,
            psiCopy.rightRail.supplierCoordination,
            psiCopy.rightRail.inventoryRiskReview,
          ],
        },
        {
          title: psiCopy.rightRail.currentQueue,
          items: [
            currentLocale === "zh" ? `${rows.length} ${psiCopy.rightRail.activeIssuesSuffix}` : `${rows.length} ${psiCopy.rightRail.activeIssuesSuffix}`,
            isMock ? psiCopy.rightRail.catalogLayer : psiCopy.rightRail.connectedService,
            `${psiCopy.shared.source}: ${source}`,
          ],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="psi-issues" rightRail={rightRail}>
      <MePageHeader
        eyebrow={psiCopy.issues.eyebrow}
        title={psiCopy.issues.title}
        description={psiCopy.issues.description}
        notice={error ?? psiCopy.issues.notice}
        badges={[
          { label: psiCopy.issues.issues },
          { label: psiCopy.issues.psiCoordination, variant: "secondary" },
          { label: psiCopy.rightRail.currentRelease, variant: "outline" },
        ]}
        meta={[
          { label: psiCopy.shared.source, value: source },
          { label: psiCopy.rightRail.queueSize, value: String(rows.length) },
          { label: psiCopy.issues.coverage, value: psiCopy.issues.coverageValue },
          { label: psiCopy.rightRail.deliveryMode, value: isMock ? psiCopy.rightRail.catalogLayerShort : psiCopy.rightRail.connectedServiceShort },
        ]}
      />

      <MeActionBar
        actions={[
          { label: psiCopy.issues.openPsi, href: "/psi" },
          { label: psiCopy.issues.openReports, href: "/reports", variant: "secondary" },
          { label: psiCopy.rightRail.openBranches, href: "/branches", variant: "outline" },
          { label: psiCopy.issues.openActions, href: "/psi/actions", variant: "outline" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: psiCopy.shared.overview, active: true },
          { label: psiCopy.rightRail.queue, badge: String(rows.length) },
          { label: psiCopy.rightRail.lifecycle },
          { label: psiCopy.shared.activity },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={psiCopy.issues.issueQueue} description={psiCopy.issues.issueQueueDescription}>
              <MeDataTable
                embedded
                columns={[
                  psiCopy.issues.columns.issue,
                  psiCopy.issues.columns.module,
                  psiCopy.issues.columns.priority,
                  psiCopy.issues.columns.status,
                  psiCopy.issues.columns.lifecycle,
                  psiCopy.issues.columns.detail,
                ]}
                rows={rows.map((row) => [
                  row.title,
                  getModuleLabel(row.moduleCode, psiCopy),
                  row.priority,
                  row.status,
                  row.lifecycleStage,
                  row.detailHref ? (
                    <Link key={`${row.issueId}-detail`} href={row.detailHref} className="text-blue-700 hover:underline">
                      {psiCopy.rightRail.openDetail}
                    </Link>
                  ) : (
                    psiCopy.rightRail.currentWorkspace
                  ),
                ])}
              />
            </MeWorkspaceSection>
          </>
        }
        context={
          <MeStatusTimeline
            embedded
            title={psiCopy.issues.issueActivity}
            items={rows.slice(0, 4).map((row) => ({
              title: row.title,
              description: `${getModuleLabel(row.moduleCode, psiCopy)} · ${row.sourceRef} · ${row.status}`,
              time: row.lifecycleStage,
            }))}
          />
        }
      />
    </MeDashboardShell>
  );
}
