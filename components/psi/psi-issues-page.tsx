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
      <div className="space-y-3 pb-24 md:space-y-6 md:pb-0">
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

      <div className="hidden md:block">
      <MeActionBar
        actions={[
          { label: psiCopy.issues.openPsi, href: "/psi" },
          { label: psiCopy.issues.openReports, href: "/reports", variant: "secondary" },
          { label: psiCopy.rightRail.openBranches, href: "/branches", variant: "outline" },
          { label: psiCopy.issues.openActions, href: "/psi/actions", variant: "outline" },
        ]}
      />
      </div>

      <div className="hidden md:block">
      <MeTabs
        style="detail"
        tabs={[
          { label: psiCopy.shared.overview, active: true },
          { label: psiCopy.rightRail.queue, badge: String(rows.length) },
          { label: psiCopy.rightRail.lifecycle },
          { label: psiCopy.shared.activity },
        ]}
      />
      </div>

      <div className="rounded-xl border border-border bg-card p-3 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <Link href="/psi/actions" className="rounded-md border border-border px-3 py-1.5 text-xs">Actions</Link>
          <Link href="/reports" className="rounded-md border border-border px-3 py-1.5 text-xs">Reports</Link>
          <Link href="/psi" className="rounded-md border border-border px-3 py-1.5 text-xs">PSI Home</Link>
        </div>
      </div>

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={psiCopy.issues.issueQueue} description={psiCopy.issues.issueQueueDescription} className="md:hidden">
              <div className="space-y-2">
                {rows.map((row) => (
                  <div key={row.issueId} className="rounded-lg border border-border/70 bg-card px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{row.issueId}</p>
                      </div>
                      <span className="rounded-md border border-border px-2 py-0.5 text-[11px]">{row.priority}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>Module: <span className="text-foreground">{getModuleLabel(row.moduleCode, psiCopy)}</span></div>
                      <div>Branch: <span className="text-foreground">{row.sourceRef}</span></div>
                      <div>Status: <span className="text-foreground">{row.status}</span></div>
                      <div>Date: <span className="text-foreground">{row.lifecycleStage}</span></div>
                    </div>
                    {row.detailHref ? (
                      <Link href={row.detailHref} className="mt-2 inline-block text-sm text-primary hover:underline">
                        Open
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </MeWorkspaceSection>
            <MeWorkspaceSection title={psiCopy.issues.issueQueue} description={psiCopy.issues.issueQueueDescription} className="hidden md:block">
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
          <div className="hidden md:block">
            <MeStatusTimeline
              embedded
              title={psiCopy.issues.issueActivity}
              items={rows.slice(0, 4).map((row) => ({
                title: row.title,
                description: `${getModuleLabel(row.moduleCode, psiCopy)} · ${row.sourceRef} · ${row.status}`,
                time: row.lifecycleStage,
              }))}
            />
          </div>
        }
      />
      </div>
    </ErpShell>
  );
}
