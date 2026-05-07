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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const psiModules = [
  { title: "Procurement", description: "Request queues, supplier handoff, and receiving checkpoints.", href: "/psi/procurement", metric: "12 pending review" },
  { title: "Supplier", description: "Supplier readiness, issue context, and communication status.", href: "/psi/supplier", metric: "4 vendor issues" },
  { title: "Inventory", description: "Low stock, coverage visibility, and replenishment context.", href: "/psi/inventory", metric: "8 watch items" },
];

export function PsiHomePage() {
  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "PSI Status",
          badge: "Current release",
          items: ["Procurement queue visible", "Supplier risks surfaced", "Inventory follow-up remains coordinated through the workspace"],
        },
        {
          title: "Recent Activity",
          items: ["PR-KCH-0001 pending review", "KCH replenishment watchlist updated", "Supplier ABC Food Supply remains linked"],
        },
        {
          title: "Guardrail Notice",
          items: ["No approvals", "No stock posting", "No supplier portal", "No write execution"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="psi-workspace" rightRail={rightRail}>
      <MePageHeader
        eyebrow="PSI Workspace"
        title="Procurement, supplier, and inventory operations"
        description="Operational PSI shell with review queues, detail preview, and related context panels."
        notice="Current release supports PSI visibility, review context, and linked navigation. Stock posting, approval workflow, supplier portal, and execution flows remain outside this release."
        badges={[
          { label: "Procurement" },
          { label: "Supplier", variant: "secondary" },
          { label: "Inventory", variant: "secondary" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/psi/procurement">Open Procurement</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports">Open PSI Reports</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/psi/issues">Open Issues</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Branch", value: "KCH" },
          { label: "Owner", value: "Purchasing" },
          { label: "Queue State", value: "Pending review" },
          { label: "Refresh Window", value: "Today" },
        ]}
      />

      <MeWorkspaceSection title="PSI Operation Modules" description="Primary entry points for daily PSI work.">
        <div className="grid gap-3 xl:grid-cols-3">
          {psiModules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-[22px] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.9))] p-4 ring-1 ring-slate-200/75 transition hover:bg-white hover:shadow-[0_18px_24px_-20px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-slate-950">{module.title}</p>
                <Badge variant="outline">Open</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{module.description}</p>
              <div className="mt-4 border-t border-slate-200/80 pt-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{module.metric}</p>
              </div>
            </Link>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeRecordSummary
        title="PR-KCH-0001"
        subtitle="Procurement request"
        status="Pending Review"
        guardrail="Current release scope"
        meta={[
          { label: "Branch", value: "KCH" },
          { label: "Supplier", value: "ABC Food Supply" },
          { label: "Owner", value: "Purchasing" },
          { label: "Last updated", value: "Today 14:22" },
          { label: "Request type", value: "Procurement request" },
          { label: "Requested by", value: "Operations planning" },
          { label: "Expected delivery", value: "Tomorrow 09:00" },
          { label: "Current stage", value: "Awaiting manager review" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review", href: "#" },
          { label: "Open queue", variant: "secondary", href: "#" },
          { label: "Assign", variant: "outline", href: "#" },
          { label: "Export", variant: "outline", href: "#" },
          { label: "Add Note", variant: "outline", href: "#" },
          { label: "View History", variant: "ghost", href: "#" },
          { label: "Link Inventory", variant: "outline", href: "#" },
          { label: "Attach Document", variant: "outline", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Items", badge: "12" },
          { label: "Supplier" },
          { label: "Receiving" },
          { label: "Activity" },
          { label: "Attachments", badge: "Planned" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Overview" description="Structured request information for procurement review.">
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_17rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["Request ID", "PR-KCH-0001"],
                    ["Branch", "KCH"],
                    ["Supplier", "ABC Food Supply"],
                    ["Requested by", "Operations planning"],
                    ["Request date", "Today 09:10"],
                    ["Expected delivery", "Tomorrow 09:00"],
                    ["Total estimated amount", "RM 3,480.00"],
                    ["Priority", "Medium"],
                    ["Current stage", "Awaiting manager review"],
                    ["Receiving site", "KCH backroom"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[20px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Procurement Note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    This request was raised from the KCH inventory risk watchlist after broth-input coverage dropped below target. Supplier terms are known, but the branch receiving slot still needs review.
                  </p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Items" description="Line items under the current procurement request.">
              <MeDataTable
                embedded
                columns={["SKU", "Item", "Qty", "Unit", "Est. cost", "Status", "Linked inventory"]}
                rows={[
                  [
                    "SKU-BTH-001",
                    <div key="item-1">
                      <p className="font-medium text-slate-900">Chicken stock base</p>
                      <p className="mt-1 text-xs text-slate-500">Core broth input</p>
                    </div>,
                    "24",
                    "ctn",
                    "RM 1,320",
                    "Pending review",
                    "Low stock risk linked",
                  ],
                  [
                    "SKU-NDL-008",
                    <div key="item-2">
                      <p className="font-medium text-slate-900">Rice noodle pack</p>
                      <p className="mt-1 text-xs text-slate-500">High-turn branch item</p>
                    </div>,
                    "18",
                    "ctn",
                    "RM 1,080",
                    "Supplier confirmed",
                    "Coverage watch",
                  ],
                  [
                    "SKU-GRN-014",
                    <div key="item-3">
                      <p className="font-medium text-slate-900">Soup garnish set</p>
                      <p className="mt-1 text-xs text-slate-500">Receiving slot pending</p>
                    </div>,
                    "12",
                    "ctn",
                    "RM 1,080",
                    "Awaiting slot",
                    "Replenishment linked",
                  ],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title="Supplier and Receiving" description="Operational context tied to vendor and branch receiving readiness.">
                <div className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[20px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Supplier</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">ABC Food Supply</p>
                      <p className="mt-1 text-sm text-slate-600">Preferred supplier with known lead times and current quote attached.</p>
                    </div>
                    <div className="rounded-[20px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Receiving</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">KCH backroom slot pending</p>
                      <p className="mt-1 text-sm text-slate-600">Receiving team is available tomorrow morning after review release.</p>
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Linked Inventory Status</p>
                    <p className="mt-1.5 text-sm text-slate-600">
                      Inventory coverage for the KCH broth line is below target and this request is linked to the active replenishment watchlist. No posting or stock movement occurs from this screen.
                    </p>
                  </div>
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title="Activity"
                items={[
                  { title: "Created request", description: "PR-KCH-0001 created from low stock watchlist.", time: "09:10" },
                  { title: "Supplier quote attached", description: "ABC Food Supply quotation linked for reference.", time: "09:26" },
                  { title: "Inventory risk linked", description: "KCH broth coverage risk attached to this request.", time: "09:35" },
                  { title: "Awaiting manager review", description: "Procurement request is queued for branch review.", time: "14:22" },
                ]}
              />
            </div>
          </>
        }
        context={
          <MeRightRail
            sections={[
              {
                title: "Approval Status",
                badge: "Pending",
                items: ["Current approver: Branch manager", "Current stage: Awaiting review", "Escalation: None"],
              },
              {
                title: "Inventory Impact",
                items: ["KCH broth coverage below target", "Linked watchlist remains open", "Receiving slot still required"],
              },
              {
                title: "Related Records",
                items: ["Inventory risk: Low stock replenishment", "Task coordination: Store manager review", "Attachments: 2 files linked"],
              },
              {
                title: "Next Steps",
                items: ["Review request amount", "Confirm receiving window", "Export or attach document if needed"],
              },
              {
                title: "Guardrail",
                badge: "Current release",
                items: ["No approval execution", "No task creation", "No notification sending", "No write behavior"],
              },
            ]}
          />
        }
      />

      <Card size="sm" className="border-border/60 bg-white/90 shadow-[0_16px_24px_-26px_rgba(15,23,42,0.12)]">
        <CardContent className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Object", "Procurement request"],
            ["Side panel", "Approval, inventory, related records"],
            ["Tabs", "Overview, Items, Supplier, Receiving, Activity, Attachments"],
            ["Behavior", "Operational visibility"],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b xl:border-b-0 xl:pb-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <DemoPresentationNote description="PSI now uses the production detail-workspace pattern with object header, action toolbar, tabs, table, activity, and side context. Approval execution, write actions, tasks, and notifications remain scheduled for later phases." />
    </MeDashboardShell>
  );
}
