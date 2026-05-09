"use client";

import Link from "next/link";

import {
  MeActionBar,
  MeDataTable,
  MeDetailWorkspace,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { ErpPageHeader, ErpShell } from "@/components/erp";
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


  return (
    <ErpShell activeHref="/psi/issues">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", "Issues"]}
          title={psiCopy.issues.title}
          zhTitle="PSI 问题队列"
          subtitle={
            error ??
            `${psiCopy.issues.description} · ${psiCopy.shared.source}: ${source} · ${
              isMock ? psiCopy.rightRail.catalogLayerShort : psiCopy.rightRail.connectedServiceShort
            }`
          }
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
      </div>
    </ErpShell>
  );
}
