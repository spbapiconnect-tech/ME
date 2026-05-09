"use client";

import Link from "next/link";
import { DemoPresentationNote } from "@/components/demo-mode/demo-presentation-note";
import { useUiPreferencesStore } from "@/stores/ui-preferences";
import { getPsiCopy, type PsiLocale } from "@/config/psi-language-copy";
import {
  MeActionBar,
  MeDataTable,
  MeDetailWorkspace,
  MeRightRail,
  MeStatusTimeline,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { ErpPageHeader, ErpShell } from "@/components/erp";

const lineItems = [
  ["Chicken broth base", "12 carton", "High", "Supplier confirmed"],
  ["Burger sauce cup", "600 pcs", "Medium", "Pending manager review"],
  ["Fried chicken patty", "8 carton", "High", "Receiving slot pending"],
];

export function PsiHomePage() {
  const rawLocale = useUiPreferencesStore((state) => state.locale);
  const currentLocale: PsiLocale = rawLocale === "zh" ? "zh" : "en";
  const psiCopy = getPsiCopy(currentLocale);

  const psiModules = [
    {
      title: psiCopy.shared.procurement,
      description: psiCopy.overview.procurementDescription,
      href: "/psi/procurement",
      metric: psiCopy.overview.procurementMetric,
    },
    {
      title: psiCopy.shared.supplier,
      description: psiCopy.overview.supplierDescription,
      href: "/psi/supplier",
      metric: psiCopy.overview.supplierMetric,
    },
    {
      title: psiCopy.shared.inventory,
      description: psiCopy.overview.inventoryDescription,
      href: "/psi/inventory",
      metric: psiCopy.overview.inventoryMetric,
    },
  ];

  const rightRail = [
    {
      title: psiCopy.rightRail.psiStatus,
      badge: psiCopy.rightRail.liveView,
      items: [
        psiCopy.rightRail.procurementQueueVisible,
        psiCopy.rightRail.supplierRisksSurfaced,
        psiCopy.rightRail.inventoryFollowUpCoordinated,
      ],
    },
    {
      title: psiCopy.rightRail.todayFocus,
      items: ["PR-KCH-0001", "KCH replenishment watchlist", "ABC Food Supply"],
    },
    {
      title: psiCopy.rightRail.workCoverage,
      items: [
        psiCopy.rightRail.procurementCoordination,
        psiCopy.rightRail.supplierReview,
        psiCopy.rightRail.inventoryWatch,
        psiCopy.rightRail.operationalFollowUp,
      ],
    },
  ];

  return (
    <ErpShell activeHref="/psi">
      <div className="space-y-6">
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", psiCopy.overview.eyebrow]}
          title={psiCopy.overview.title}
          zhTitle="PSI 工作台"
          subtitle={psiCopy.overview.description}
          actions={
            <>
              <Link href="/psi/procurement">{psiCopy.overview.openProcurement}</Link>
              <Link href="/reports">{psiCopy.overview.openPsiReports}</Link>
              <Link href="/psi/issues">{psiCopy.overview.openIssues}</Link>
            </>
          }
        />

      <MeWorkspaceSection title={psiCopy.overview.operationModules} description={psiCopy.overview.operationModulesDescription}>
        <div className="grid gap-3 md:grid-cols-3">
          {psiModules.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[24px] bg-white/95 p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-28px_rgba(15,23,42,0.32)]"
            >
              <div className="text-sm font-semibold text-slate-950">{item.title}</div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
              <div className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.metric}</div>
            </Link>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="PR-KCH-0001" description={psiCopy.overview.procurementRequest}>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            [psiCopy.shared.supplier, "ABC Food Supply"],
            [psiCopy.shared.branch, "KCH"],
            [psiCopy.overview.requestType, psiCopy.overview.procurementRequest],
            [psiCopy.shared.priority, "High"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[20px] bg-white/95 px-4 py-3 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80">
              <div className="text-xs font-medium text-slate-500">{label}</div>
              <div className="mt-1 text-sm font-semibold text-slate-950">{value}</div>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeActionBar
        actions={[
          { label: psiCopy.overview.createRequest, href: "#" },
          { label: psiCopy.overview.reviewSupplier, variant: "secondary", href: "#" },
          { label: psiCopy.overview.linkInventory, variant: "outline", href: "#" },
        ]}
      />

      <MeWorkspaceSection title={psiCopy.overview.currentFocus} description={psiCopy.rightRail.workCoverage}>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            [psiCopy.shared.procurement, "12"],
            [psiCopy.shared.supplier, "4"],
            [psiCopy.shared.inventory, "8"],
            [psiCopy.shared.issues, "6"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[20px] bg-white/95 px-4 py-3 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80">
              <div className="text-xs font-medium text-slate-500">{label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{value}</div>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeTabs
        tabs={[
          { label: psiCopy.shared.overview, active: true },
          { label: psiCopy.overview.items, badge: "3" },
          { label: psiCopy.shared.supplier },
          { label: psiCopy.shared.receiving },
          { label: psiCopy.shared.activity },
          { label: psiCopy.shared.attachments },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title={psiCopy.shared.overview} description="Structured request information for procurement review.">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  [psiCopy.shared.supplier, "ABC Food Supply"],
                  [psiCopy.shared.branch, "KCH"],
                  [psiCopy.overview.requestType, psiCopy.overview.procurementRequest],
                  [psiCopy.shared.priority, "High"],
                  [psiCopy.shared.status, "Review"],
                  [psiCopy.shared.receivingSite, "KCH backroom"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] bg-slate-50/90 px-4 py-3 ring-1 ring-slate-200/75">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[20px] bg-blue-50/70 p-4 ring-1 ring-blue-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{psiCopy.overview.procurementNote}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This request was raised from the KCH inventory risk watchlist after broth-input coverage dropped below target. Supplier terms are known, but the branch receiving slot is still pending review.
                </p>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title={psiCopy.overview.items} description={psiCopy.overview.itemsDescription}>
              <MeDataTable columns={[psiCopy.shared.item, psiCopy.shared.quantity, psiCopy.shared.priority, psiCopy.shared.status]} rows={lineItems} />
            </MeWorkspaceSection>

            <MeWorkspaceSection title={psiCopy.overview.supplierAndReceiving} description={psiCopy.overview.supplierAndReceivingDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] bg-slate-50/90 p-4 ring-1 ring-slate-200/75">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{psiCopy.shared.supplier}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">ABC Food Supply</p>
                  <p className="mt-1 text-sm text-slate-600">Known supplier, current status requires purchasing review.</p>
                </div>
                <div className="rounded-[20px] bg-slate-50/90 p-4 ring-1 ring-slate-200/75">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{psiCopy.shared.receiving}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">KCH backroom</p>
                  <p className="mt-1 text-sm text-slate-600">Receiving team is available tomorrow morning after review release.</p>
                </div>
              </div>

              <div className="mt-3 rounded-[20px] bg-amber-50/75 p-4 ring-1 ring-amber-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{psiCopy.overview.linkedInventoryStatus}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Inventory coverage for the KCH broth line is below target and this request is linked to the active replenishment watchlist. No posting or stock movement occurs from this UI.
                </p>
              </div>
            </MeWorkspaceSection>
          </>
        }
        context={
          <>
            <MeStatusTimeline
              embedded
              title={psiCopy.shared.activity}
              items={[
                { title: "Supplier quote attached", description: "ABC Food Supply quotation linked for reference.", time: "09:26" },
                { title: "Inventory risk linked", description: "KCH broth coverage risk attached to this request.", time: "09:35" },
                { title: "Awaiting manager review", description: "Procurement request is queued for branch review.", time: "14:22" },
              ]}
            />

            <MeRightRail
              sections={[
                {
                  title: psiCopy.overview.inventoryImpact,
                  items: ["KCH broth coverage below target", "Linked watchlist remains open", "Receiving slot still required"],
                },
                {
                  title: psiCopy.overview.relatedContext,
                  items: ["Inventory risk: Low stock replenishment", "Task coordination: Store manager review", "Attachments: 2 files linked"],
                },
                {
                  title: psiCopy.overview.serviceScope,
                  badge: psiCopy.rightRail.currentRelease,
                  items: ["PSI preview only", "No stock posting", "No supplier write-back"],
                },
              ]}
            />
          </>
        }
      />

      <DemoPresentationNote
        title={psiCopy.overview.workspaceNote}
        description={psiCopy.overview.workspaceNoteDescription}
      />
      </div>
    </ErpShell>
  );
}
