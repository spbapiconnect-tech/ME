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
          badge: "Read-only",
          items: ["Procurement queue visible", "Supplier risks surfaced", "Inventory actions remain placeholder-only"],
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
        notice="Read-only foundation with mock repositories only. No database/API, stock posting, approval workflow, supplier portal, or write operations."
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

      <MeActionBar
        actions={[
          { label: "Review" },
          { label: "Assign", variant: "outline" },
          { label: "Export", variant: "outline" },
          { label: "Add Note", variant: "outline" },
          { label: "View History", variant: "ghost" },
        ]}
      />

      <MeWorkspaceSection title="PSI Operation Modules" description="Primary entry points for daily PSI work.">
        <div className="grid gap-3 md:grid-cols-3">
          {psiModules.map((module) => (
            <Link key={module.title} href={module.href} className="rounded-[24px] bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.9))] p-4 ring-1 ring-slate-200/75 transition hover:bg-white hover:shadow-[0_18px_28px_-20px_rgba(15,23,42,0.16)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-slate-950">{module.title}</p>
                <Badge variant="outline">Open</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{module.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{module.metric}</p>
            </Link>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeRecordSummary
        title="Procurement Request PR-KCH-0001"
        status="Pending Review"
        meta={[
          { label: "Branch", value: "KCH" },
          { label: "Supplier", value: "ABC Food Supply" },
          { label: "Owner", value: "Purchasing" },
          { label: "Last updated", value: "Today" },
          { label: "Receiving", value: "Awaiting slot confirmation" },
          { label: "Linked inventory", value: "Low stock replenishment" },
        ]}
      />

      <MeTabs
        tabs={[
          { label: "Overview", active: true },
          { label: "Items", badge: "12" },
          { label: "Supplier" },
          { label: "Receiving" },
          { label: "Activity" },
          { label: "Attachments", badge: "Soon" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Field Summary" description="Operational record fields for review without write actions.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Request type", "Procurement replenishment"],
                  ["Priority", "Medium"],
                  ["Assignee", "Purchasing"],
                  ["Approval lane", "Branch manager review"],
                  ["Receiving site", "KCH backroom"],
                  ["Related task", "Low stock follow-up"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </MeWorkspaceSection>

            <MeDataTable
              title="Requested Items"
              columns={["Item", "Qty", "UOM", "Target ETA", "Status"]}
              rows={[
                ["Chicken stock base", "24", "ctn", "Today", "Pending review"],
                ["Rice noodle pack", "18", "ctn", "Today", "Supplier confirmed"],
                ["Soup garnish set", "12", "ctn", "Tomorrow", "Awaiting receiving slot"],
              ]}
            />

            <MeWorkspaceSection title="Issue and Action Preview" description="Related PSI queues surfaced beside the active request.">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50/88 p-4 ring-1 ring-slate-200/75">
                  <p className="text-sm font-semibold text-slate-950">Issue Preview</p>
                  <p className="mt-2 text-sm text-slate-600">Inventory buffer for KCH broth inputs dropped below target coverage and triggered the current replenishment request.</p>
                </div>
                <div className="rounded-[24px] bg-slate-50/88 p-4 ring-1 ring-slate-200/75">
                  <p className="text-sm font-semibold text-slate-950">Action Draft Preview</p>
                  <p className="mt-2 text-sm text-slate-600">Assign branch manager review, confirm supplier delivery slot, and prepare receiving checklist for arrival.</p>
                </div>
              </div>
            </MeWorkspaceSection>
          </>
        }
        context={
          <>
            <MeStatusTimeline
              title="Approval Timeline"
              items={[
                { title: "Request raised", description: "Procurement request created from low stock watchlist.", time: "09:10" },
                { title: "Supplier linked", description: "ABC Food Supply attached as preferred source.", time: "09:35" },
                { title: "Awaiting review", description: "Branch review and receiving coordination pending.", time: "10:00" },
              ]}
            />
            <MeWorkspaceSection title="Context Rail" description="Related module and quick-link placeholders.">
              <div className="grid gap-2 text-sm text-slate-600">
                <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/75">Related inventory: KCH replenishment watchlist</div>
                <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/75">Linked task: Store manager review placeholder</div>
                <div className="rounded-[22px] bg-slate-50/88 px-4 py-3.5 ring-1 ring-slate-200/75">Module: PSI procurement detail preview</div>
              </div>
            </MeWorkspaceSection>
          </>
        }
      />

      <DemoPresentationNote description="PSI remains a mock/read-only operational shell. No approvals, supplier portal, receiving transactions, stock posting, API calls, or write execution were added." />
    </MeDashboardShell>
  );
}
