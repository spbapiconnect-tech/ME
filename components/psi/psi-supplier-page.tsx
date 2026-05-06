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

interface PsiSupplierPageProps {
  source: DataMeta["source"];
  isMock: boolean;
}

export function PsiSupplierPage({ source, isMock }: PsiSupplierPageProps) {
  return (
    <MeDashboardShell activeKey="supplier">
      <MePageHeader
        eyebrow="PSI Supplier"
        title="Supplier operations detail"
        description="Supplier profile, contact context, linked orders, and issue visibility inside the shared detail workspace pattern."
        notice={`Source: ${source}. Supplier preview remains ${isMock ? "mock/read-only" : "read-only"} with no supplier portal, writes, or execution.`}
        badges={[
          { label: "Supplier detail" },
          { label: "Operations preview", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
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
              <Link href="/psi/inventory">Open Inventory</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Coverage", value: "KCH / BTU" },
          { label: "Category", value: "Food Supply" },
          { label: "Lead time", value: "3-5 days" },
          { label: "Owner", value: "Purchasing" },
        ]}
      />

      <MeRecordSummary
        title="ABC Food Supply"
        subtitle="Supplier profile"
        status="Active / Review Needed"
        guardrail="Mock / Read-only"
        meta={[
          { label: "Branch coverage", value: "KCH / BTU" },
          { label: "Category", value: "Food Supply" },
          { label: "Lead time", value: "3-5 days" },
          { label: "Owner", value: "Purchasing" },
          { label: "Service region", value: "Kuching / Bintulu corridor" },
          { label: "Contact status", value: "Primary contact active" },
          { label: "Current risk", value: "Review pricing alignment" },
          { label: "Last updated", value: "Today 13:18" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review Supplier", href: "#" },
          { label: "Assign Follow-up", variant: "outline", href: "#" },
          { label: "Export Profile", variant: "outline", href: "#" },
          { label: "Add Note", variant: "outline", href: "#" },
          { label: "View History", variant: "ghost", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Contacts" },
          { label: "Orders", badge: "3" },
          { label: "Issues", badge: "2" },
          { label: "Documents" },
          { label: "Activity" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Overview" description="Core supplier profile fields and commercial context.">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["Supplier name", "ABC Food Supply"],
                    ["Supplier code", "SUP-KCH-0012"],
                    ["Category", "Food Supply"],
                    ["Branch coverage", "KCH / BTU"],
                    ["Lead time", "3-5 days"],
                    ["Owner", "Purchasing"],
                    ["Commercial status", "Review needed"],
                    ["Primary escalation", "Pricing update requested"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Supplier Note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    ABC Food Supply is an active food supplier used by KCH and BTU. Current follow-up is focused on price review and keeping delivery windows aligned with procurement demand.
                  </p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Contacts" description="Primary contacts and communication ownership.">
              <MeDataTable
                embedded
                columns={["Contact", "Role", "Phone", "Email", "Status"]}
                rows={[
                  ["Alice Wong", "Account Manager", "+60 12-555 0101", "alice@abcfoodsupply.example", "Active"],
                  ["Ben Lau", "Operations Liaison", "+60 12-555 0188", "ben@abcfoodsupply.example", "Standby"],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title="Orders and Issues" description="Recent linked procurement records and current supplier issues.">
                <div className="grid gap-4">
                  <MeDataTable
                    embedded
                    columns={["Order", "Branch", "Value", "Status"]}
                    rows={[
                      ["PR-KCH-0001", "KCH", "RM 3,480", "Pending review"],
                      ["PR-BTU-0004", "BTU", "RM 2,140", "Awaiting quote refresh"],
                      ["PR-KCH-0007", "KCH", "RM 1,260", "Delivered placeholder"],
                    ]}
                  />
                  <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Open Issue Snapshot</p>
                    <p className="mt-2 text-sm text-slate-600">Two supplier issues remain open: one price confirmation gap and one delivery-slot coordination issue tied to KCH replenishment.</p>
                  </div>
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title="Activity"
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
                title: "Supplier Health",
                badge: "Review",
                items: ["Coverage active for KCH / BTU", "Pricing follow-up required", "Lead time remains within target"],
              },
              {
                title: "Open Issues",
                items: ["2 active supplier issues", "1 pricing variance", "1 delivery coordination gap"],
              },
              {
                title: "Linked Records",
                items: ["PR-KCH-0001", "PR-BTU-0004", "PR-KCH-0007"],
              },
              {
                title: "Next Steps",
                items: ["Review current quote", "Confirm next delivery slot", "Export profile if needed"],
              },
              {
                title: "Guardrail",
                badge: "Read-only",
                items: ["No supplier portal", "No API writes", "No note submission", "No workflow execution"],
              },
            ]}
          />
        }
      />

      <DemoPresentationNote description="Supplier detail preview now uses the shared detail-workspace pattern. It remains mock/read-only with no supplier portal, no write actions, and no API execution." />
    </MeDashboardShell>
  );
}
