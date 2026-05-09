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
import { Button } from "@/components/ui/button";
import { PsiModuleCard, PsiSoftCard, psiVisual } from "@/components/psi/psi-visual";

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
    {
      title: currentLocale === "zh" ? "收货" : "Receiving",
      description:
        currentLocale === "zh"
          ? "供应商到货、数量差异、入库交接与收货检查。"
          : "Supplier receiving, variance review, inventory handoff, and delivery checks.",
      href: "/psi/receiving",
      metric: currentLocale === "zh" ? "3 条待验证" : "3 awaiting verification",
    },
  ];


  return (
    <ErpShell activeHref="/psi">
      <div className={psiVisual.pageStack}>
        <ErpPageHeader
          breadcrumbs={["ME", "PSI", psiCopy.overview.eyebrow]}
          title={psiCopy.overview.title}
          zhTitle="PSI 工作台"
          subtitle={psiCopy.overview.description}
          actions={
            <>
              <Button asChild size="sm">
                <Link href="/psi/procurement">{psiCopy.overview.openProcurement}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/reports">{psiCopy.overview.openPsiReports}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/psi/issues">{psiCopy.overview.openIssues}</Link>
              </Button>
            </>
          }
        />

      <MeWorkspaceSection className={psiVisual.section} title={psiCopy.overview.operationModules} description={psiCopy.overview.operationModulesDescription}>
        <div className={psiVisual.moduleGrid}>
          {psiModules.map((item) => (
            <PsiModuleCard
              key={item.href}
              href={item.href}
              title={item.title}
              description={item.description}
              metric={item.metric}
            />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection className={psiVisual.section} title="PR-KCH-0001" description={psiCopy.overview.procurementRequest}>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            [psiCopy.shared.supplier, "ABC Food Supply"],
            [psiCopy.shared.branch, "KCH"],
            [psiCopy.overview.requestType, psiCopy.overview.procurementRequest],
            [psiCopy.shared.priority, "High"],
          ].map(([label, value]) => (
            <PsiSoftCard key={label}>
              <div className={psiVisual.eyebrow}>{label}</div>
              <div className={psiVisual.value}>{value}</div>
            </PsiSoftCard>
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

      <MeWorkspaceSection className={psiVisual.section} title={psiCopy.overview.currentFocus} description={psiCopy.rightRail.workCoverage}>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            [psiCopy.shared.procurement, "12"],
            [psiCopy.shared.supplier, "4"],
            [psiCopy.shared.inventory, "8"],
            [psiCopy.shared.issues, "6"],
          ].map(([label, value]) => (
            <PsiSoftCard key={label}>
              <div className={psiVisual.eyebrow}>{label}</div>
              <div className={psiVisual.metric}>{value}</div>
            </PsiSoftCard>
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
            <MeWorkspaceSection className={psiVisual.section} title={psiCopy.shared.overview} description="Structured request information for procurement review.">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  [psiCopy.shared.supplier, "ABC Food Supply"],
                  [psiCopy.shared.branch, "KCH"],
                  [psiCopy.overview.requestType, psiCopy.overview.procurementRequest],
                  [psiCopy.shared.priority, "High"],
                  [psiCopy.shared.status, "Review"],
                  [psiCopy.shared.receivingSite, "KCH backroom"],
                ].map(([label, value]) => (
                  <PsiSoftCard key={label}>
                    <p className={psiVisual.eyebrow}>{label}</p>
                    <p className={psiVisual.value}>{value}</p>
                  </PsiSoftCard>
                ))}
              </div>

              <div className={`mt-4 ${psiVisual.noteCard}`}>
                <p className={psiVisual.eyebrow}>{psiCopy.overview.procurementNote}</p>
                <p className={`mt-2 ${psiVisual.body}`}>
                  This request was raised from the KCH inventory risk watchlist after broth-input coverage dropped below target. Supplier terms are known, but the branch receiving slot is still pending review.
                </p>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection className={psiVisual.section} title={psiCopy.overview.items} description={psiCopy.overview.itemsDescription}>
              <MeDataTable columns={[psiCopy.shared.item, psiCopy.shared.quantity, psiCopy.shared.priority, psiCopy.shared.status]} rows={lineItems} />
            </MeWorkspaceSection>

            <MeWorkspaceSection className={psiVisual.section} title={psiCopy.overview.supplierAndReceiving} description={psiCopy.overview.supplierAndReceivingDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className={psiVisual.softCard}>
                  <p className={psiVisual.eyebrow}>{psiCopy.shared.supplier}</p>
                  <p className={psiVisual.value}>ABC Food Supply</p>
                  <p className={`mt-1 ${psiVisual.body}`}>Known supplier, current status requires purchasing review.</p>
                </div>
                <div className={psiVisual.softCard}>
                  <p className={psiVisual.eyebrow}>{psiCopy.shared.receiving}</p>
                  <p className={psiVisual.value}>KCH backroom</p>
                  <p className={`mt-1 ${psiVisual.body}`}>Receiving team is available tomorrow morning after review release.</p>
                </div>
              </div>

              <div className={`mt-3 ${psiVisual.warningCard}`}>
                <p className={psiVisual.eyebrow}>{psiCopy.overview.linkedInventoryStatus}</p>
                <p className={`mt-2 ${psiVisual.body}`}>
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
