import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
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
import { Button } from "@/components/ui/button";
import type { DataMeta } from "@/lib/data";

interface PsiInventoryPageProps {
  source: DataMeta["source"];
  isMock: boolean;
}

export function PsiInventoryPage({ source, isMock }: PsiInventoryPageProps) {
  return (
    <MeDashboardShell activeKey="inventory">
      <MePageHeader
        eyebrow="PSI Inventory"
        title="Inventory stock detail"
        description="Stock profile, movement context, expiry visibility, and linked procurement records using the shared detail pattern."
        notice={`Source: ${source}. ${isMock ? "This workspace is currently published through the shared catalog layer." : "This workspace is currently published through the connected service layer."} Use it to review stock position, movement history, expiry watch, and replenishment linkage.`}
        badges={[
          { label: "Inventory detail" },
          { label: "Warehouse workspace", variant: "secondary" },
          { label: "Inventory control", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/psi">Back to PSI</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/psi/procurement">Open Procurement</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/psi/supplier">Open Supplier</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Branch", value: "KCH" },
          { label: "Storage", value: "Freezer" },
          { label: "Owner", value: "Warehouse" },
          { label: "Risk", value: "Low stock" },
        ]}
      />

      <MeRecordSummary
        title="SKU-KCH-0007"
        subtitle="Coated Fries"
        status="Low Stock"
        meta={[
          { label: "Branch", value: "KCH" },
          { label: "Storage", value: "Freezer" },
          { label: "Current stock", value: "42 bags" },
          { label: "Min stock", value: "60 bags" },
          { label: "Owner", value: "Warehouse" },
          { label: "Supplier", value: "ABC Food Supply" },
          { label: "Coverage", value: "2.1 days" },
          { label: "Last updated", value: "Today 11:40" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review Stock", href: "#" },
          { label: "Open risk watch", variant: "secondary", href: "#" },
          { label: "Link Procurement", variant: "outline", href: "#" },
          { label: "Export Stock Card", variant: "outline", href: "#" },
          { label: "Add Note", variant: "outline", href: "#" },
          { label: "View Movement", variant: "ghost", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Stock Movement" },
          { label: "Expiry" },
          { label: "Procurement" },
          { label: "Issues" },
          { label: "Activity" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Overview" description="Stock profile and operating thresholds for the selected SKU.">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["SKU", "SKU-KCH-0007"],
                    ["Item", "Coated Fries"],
                    ["Branch", "KCH"],
                    ["Storage", "Freezer"],
                    ["Current stock", "42 bags"],
                    ["Minimum stock", "60 bags"],
                    ["Reorder signal", "Triggered"],
                    ["Owner", "Warehouse"],
                    ["Status", "Low Stock"],
                    ["Linked supplier", "ABC Food Supply"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Stock Note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    KCH freezer stock for coated fries is below threshold and is already linked to the active procurement queue. This is a planning view only and does not post movements or adjust stock.
                  </p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Stock Movement" description="Recent movement rows and replenishment context.">
              <MeDataTable
                embedded
                columns={["Date", "Movement", "Qty", "Reference", "Status"]}
                rows={[
                  ["Today 08:20", "Outlet issue", "-12", "SO-KCH-091", "Posted in prior cycle"],
                  ["Yesterday 17:10", "Receiving", "+18", "RCV-KCH-044", "Linked to last inbound"],
                  ["Yesterday 11:00", "Transfer out", "-8", "TR-KCH-009", "Complete"],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title="Expiry and Procurement" description="Operational watch items tied to stock quality and replenishment.">
                <div className="grid gap-3">
                  <div className="rounded-[22px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Expiry Watch</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">No immediate expiry risk</p>
                    <p className="mt-1 text-sm text-slate-600">Nearest tracked expiry window is 19 days out and remains outside escalation range.</p>
                  </div>
                  <MeDataTable
                    embedded
                    columns={["Procurement", "ETA", "Qty", "Status"]}
                    rows={[
                      ["PR-KCH-0001", "Tomorrow 09:00", "24 bags", "Pending review"],
                      ["PR-KCH-0009", "This week", "18 bags", "Planned replenishment"],
                    ]}
                  />
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title="Activity"
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
                title: "Low-stock Risk",
                badge: "Watch",
                items: ["Current stock below minimum", "Coverage at 2.1 days", "Replenishment already linked"],
              },
              {
                title: "Expiry Watch",
                items: ["No immediate expiry risk", "Next tracked expiry in 19 days", "Freezer storage stable"],
              },
              {
                title: "Related Context",
                items: ["Supplier: ABC Food Supply", "Warehouse review: inventory follow-up", "Procurement: PR-KCH-0001"],
              },
              {
                title: "Next Steps",
                items: ["Review stock card", "Confirm inbound timing", "Export stock card if needed"],
              },
              {
                title: "Operating Notes",
                badge: "Inventory view",
                items: ["Warehouse review remains active", "Procurement linkage is visible", "Movement history stays in sync with the workspace", "Follow-up actions can be escalated from this page"],
              },
            ]}
          />
        }
      />

      <DemoPresentationNote title="Workspace Note" description="Inventory detail brings stock position, movement review, supplier linkage, and replenishment context into one operational record page." />
    </MeDashboardShell>
  );
}
