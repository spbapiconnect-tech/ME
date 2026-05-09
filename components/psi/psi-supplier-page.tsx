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

interface PsiSupplierPageProps {
  source: DataMeta["source"];
  isMock: boolean;
}

export function PsiSupplierPage({ source, isMock }: PsiSupplierPageProps) {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);
  const c = psiCopy.standalone.common;
  const sup = psiCopy.standalone.supplier;

  return (
    <ErpShell activeHref="/psi/supplier">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", "Supplier"]}
          title={sup.title}
          zhTitle="供应商工作台"
          subtitle={sup.description}
        />

      <MeRecordSummary
        title="ABC Food Supply"
        subtitle={sup.supplierProfile}
        status="Active / Review Needed"
        meta={[
          { label: sup.branchCoverage, value: "KCH / BTU" },
          { label: c.category, value: "Food Supply" },
          { label: c.leadTime, value: "3-5 days" },
          { label: c.owner, value: "Purchasing" },
          { label: sup.serviceRegion, value: "Kuching / Bintulu corridor" },
          { label: sup.contactStatus, value: "Primary contact active" },
          { label: sup.currentRisk, value: "Review pricing alignment" },
          { label: c.lastUpdated, value: "Today 13:18" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: sup.reviewSupplier, href: "#" },
          { label: sup.openIssueQueue, variant: "secondary", href: "#" },
          { label: sup.assignFollowUp, variant: "outline", href: "#" },
          { label: c.exportProfile, variant: "outline", href: "#" },
          { label: c.addNote, variant: "outline", href: "#" },
          { label: c.viewHistory, variant: "ghost", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: c.overview, active: true },
          { label: sup.contacts },
          { label: sup.orders, badge: "3" },
          { label: c.issues, badge: "2" },
          { label: c.documents },
          { label: c.activity },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={c.overview} description={sup.supplierOverviewDescription}>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    [sup.supplierName, "ABC Food Supply"],
                    [sup.supplierCode, "SUP-KCH-0012"],
                    [c.category, "Food Supply"],
                    [sup.branchCoverage, "KCH / BTU"],
                    [c.leadTime, "3-5 days"],
                    [c.owner, "Purchasing"],
                    [sup.commercialStatus, "Review needed"],
                    [sup.primaryEscalation, "Pricing update requested"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{sup.supplierNote}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{sup.supplierNoteBody}</p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title={sup.contacts} description={sup.contactsDescription}>
              <MeDataTable
                embedded
                columns={[sup.contact, sup.role, sup.phone, sup.email, c.status]}
                rows={[
                  ["Alice Wong", "Account Manager", "+60 12-555 0101", "alice@abcfoodsupply.example", "Active"],
                  ["Ben Lau", "Operations Liaison", "+60 12-555 0188", "ben@abcfoodsupply.example", "Standby"],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title={sup.ordersAndIssues} description={sup.ordersAndIssuesDescription}>
                <div className="grid gap-4">
                  <MeDataTable
                    embedded
                    columns={[sup.order, c.branch, sup.value, c.status]}
                    rows={[
                      ["PR-KCH-0001", "KCH", "RM 3,480", "Pending review"],
                      ["PR-BTU-0004", "BTU", "RM 2,140", "Awaiting quote refresh"],
                      ["PR-KCH-0007", "KCH", "RM 1,260", "Delivered this cycle"],
                    ]}
                  />
                  <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{sup.openIssueSnapshot}</p>
                    <p className="mt-2 text-sm text-slate-600">{sup.openIssueSnapshotBody}</p>
                  </div>
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title={c.activity}
                items={[
                  { title: "Profile reviewed", description: "Commercial details verified for current procurement cycle.", time: "08:45" },
                  { title: "Quote refreshed", description: "Latest quote attached to linked procurement records.", time: "10:10" },
                  { title: "Issue linked", description: "Price review issue attached for purchasing follow-up.", time: "11:30" },
                  { title: "Awaiting review", description: "Supplier remains active with follow-up pending.", time: "13:18" },
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
                title: sup.supplierHealth,
                badge: sup.review,
                items: ["Coverage active for KCH / BTU", "Pricing follow-up required", "Lead time remains within target"],
              },
              {
                title: sup.openIssues,
                items: ["2 active supplier issues", "1 pricing variance", "1 delivery coordination gap"],
              },
              {
                title: sup.linkedRecords,
                items: ["PR-KCH-0001", "PR-BTU-0004", "PR-KCH-0007"],
              },
              {
                title: c.nextSteps,
                items: ["Review current quote", "Confirm next delivery slot", "Export profile if needed"],
              },
              {
                title: c.operatingNotes,
                badge: "Supplier view",
                items: ["Portal coordination managed centrally", "Document uploads reviewed in workspace", "Operational history remains visible", "Activity follows workspace actions"],
              },
            ]}
          />
        }
      />

      <DemoPresentationNote title={sup.workspaceNote} description={sup.workspaceNoteDescription} />
      </div>
    </ErpShell>
  );
}
