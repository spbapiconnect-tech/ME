"use client";

import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
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
import { Button } from "@/components/ui/button";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import type { DataMeta } from "@/lib/data";
import { useUiPreferencesStore } from "@/stores/ui-preferences";

interface PsiInventoryPageProps {
  source: DataMeta["source"];
  isMock: boolean;
}

export function PsiInventoryPage({ source, isMock }: PsiInventoryPageProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);
  const c = psiCopy.standalone.common;
  const inv = psiCopy.standalone.inventory;

  return (
    <ErpShell activeHref="/psi/inventory">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", "Inventory"]}
          title={inv.title}
          zhTitle="库存工作台"
          subtitle={`${inv.description} ${c.sourceNotice}: ${source}. ${isMock ? c.catalogLayerNotice : c.connectedServiceNotice} ${inv.noticeSuffix}`}
          actions={
            <>
              <Button asChild size="sm">
                <Link href="/psi">{c.backToPsi}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/procurement">{c.openProcurement}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/supplier">{c.openSupplier}</Link>
              </Button>
            </>
          }
        />

      <MeRecordSummary
        title="SKU-KCH-0007"
        subtitle="Coated Fries"
        status="Low Stock"
        meta={[
          { label: c.branch, value: "KCH" },
          { label: c.storage, value: "Freezer" },
          { label: inv.currentStock, value: "42 bags" },
          { label: inv.minStock, value: "60 bags" },
          { label: c.owner, value: "Warehouse" },
          { label: psiCopy.shared.supplier, value: "ABC Food Supply" },
          { label: c.coverage, value: "2.1 days" },
          { label: c.lastUpdated, value: "Today 11:40" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: inv.reviewStock, href: "#" },
          { label: inv.openRiskWatch, variant: "secondary", href: "#" },
          { label: inv.linkProcurement, variant: "outline", href: "#" },
          { label: inv.exportStockCard, variant: "outline", href: "#" },
          { label: c.addNote, variant: "outline", href: "#" },
          { label: inv.viewMovement, variant: "ghost", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: c.overview, active: true },
          { label: inv.stockMovement },
          { label: inv.expiry },
          { label: psiCopy.shared.procurement },
          { label: c.issues },
          { label: c.activity },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={c.overview} description={inv.stockOverviewDescription}>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["SKU", "SKU-KCH-0007"],
                    [inv.item, "Coated Fries"],
                    [c.branch, "KCH"],
                    [c.storage, "Freezer"],
                    [inv.currentStock, "42 bags"],
                    [inv.minimumStock, "60 bags"],
                    [inv.reorderSignal, "Triggered"],
                    [c.owner, "Warehouse"],
                    [c.status, "Low Stock"],
                    [inv.linkedSupplier, "ABC Food Supply"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{inv.stockNote}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{inv.stockNoteBody}</p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title={inv.stockMovement} description={inv.movementDescription}>
              <MeDataTable
                embedded
                columns={[inv.date, inv.movement, inv.qty, inv.reference, c.status]}
                rows={[
                  ["Today 08:20", "Outlet issue", "-12", "SO-KCH-091", "Posted in prior cycle"],
                  ["Yesterday 17:10", psiCopy.shared.receiving, "+18", "RCV-KCH-044", "Linked to last inbound"],
                  ["Yesterday 11:00", "Transfer out", "-8", "TR-KCH-009", "Complete"],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title={inv.expiryAndProcurement} description={inv.expiryAndProcurementDescription}>
                <div className="grid gap-3">
                  <div className="rounded-[22px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{inv.expiryWatch}</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{inv.noImmediateExpiryRisk}</p>
                    <p className="mt-1 text-sm text-slate-600">{inv.nearestExpiry}</p>
                  </div>
                  <MeDataTable
                    embedded
                    columns={[psiCopy.shared.procurement, inv.eta, inv.qty, c.status]}
                    rows={[
                      ["PR-KCH-0001", "Tomorrow 09:00", "24 bags", "Pending review"],
                      ["PR-KCH-0009", "This week", "18 bags", "Planned replenishment"],
                    ]}
                  />
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title={c.activity}
                items={[
                  { title: "Low stock threshold hit", description: "Available stock dropped below minimum target.", time: "07:55" },
                  { title: "Procurement linked", description: "PR-KCH-0001 attached as replenishment response.", time: "08:10" },
                  { title: "Supplier context attached", description: "ABC Food Supply linked to active replenishment chain.", time: "09:00" },
                  { title: "Awaiting warehouse review", description: "Warehouse owner to review stock card and next inbound.", time: "11:40" },
                ]}
              />
            </div>
          </>
        }
        context={
          <MeRightRail
            sticky={false}
            sections={[
              {
                title: inv.lowStockRisk,
                badge: inv.watch,
                items: ["Current stock below minimum", "Coverage at 2.1 days", "Replenishment already linked"],
              },
              {
                title: inv.expiryWatch,
                items: [inv.noImmediateExpiryRisk, "Next tracked expiry in 19 days", "Freezer storage stable"],
              },
              {
                title: inv.relatedContext,
                items: ["Supplier: ABC Food Supply", "Warehouse review: inventory follow-up", "Procurement: PR-KCH-0001"],
              },
              {
                title: c.nextSteps,
                items: ["Review stock card", "Confirm inbound timing", "Export stock card if needed"],
              },
              {
                title: c.operatingNotes,
                badge: "Inventory view",
                items: ["Warehouse review remains active", "Procurement linkage is visible", "Movement history stays in sync with the workspace", "Follow-up actions can be escalated from this page"],
              },
            ]}
          />
        }
      />

      <DemoPresentationNote title={inv.workspaceNote} description={inv.workspaceNoteDescription} />
      </div>
    </ErpShell>
  );
}
