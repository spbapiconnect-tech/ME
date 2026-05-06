import Link from "next/link";

import { BranchProfileCard } from "@/components/branches/branch-profile-card";
import { BranchSelectorPlaceholder } from "@/components/branches/branch-selector-placeholder";
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
import type { MeBranchProfile } from "@/types/branch-context";

interface BranchWorkspacePageProps {
  branches: MeBranchProfile[];
}

export function BranchWorkspacePage({ branches }: BranchWorkspacePageProps) {
  const aggregateBranches = branches.filter((branch) => branch.isAggregate);
  const localBranches = branches.filter((branch) => !branch.isAggregate && branch.status !== "coming-soon");
  const futureBranches = branches.filter((branch) => branch.status === "coming-soon");

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Branch Context",
          badge: "KCH",
          items: ["Local operations scope", "PSI, reports, and roles linked", "Manager placeholder remains visual-only"],
        },
        {
          title: "Active Modules",
          items: ["PSI operational preview", "Reports workspace", "Roles and staff preview"],
        },
        {
          title: "Recent Activity",
          items: ["KCH branch context reviewed", "Inventory watch linked to PSI", "Issue queue remains placeholder-only"],
        },
        {
          title: "Guardrails",
          items: ["No branch database", "No branch switching persistence", "No permission enforcement", "No writes"],
        },
        {
          title: "Next Steps",
          items: ["Review branch summary", "Open PSI for branch context", "Export local branch summary if needed"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="branches" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Branch Workspace"
        title="Branch context and operations status"
        description="Branch management shell for aggregate and local operating views."
        notice="Branch preview only. No tenant switching, no branch database, and no branch permission enforcement."
        badges={[
          { label: "All Stores" },
          { label: "KCH / BTU", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/psi">Open PSI</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/roles">Open Roles</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports">Open Reports</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Scope", value: "All Stores / KCH / BTU / Future Branch" },
          { label: "Current Mode", value: "Context preview" },
          { label: "Operations", value: "Status and inspection placeholders" },
          { label: "Writes", value: "Disabled" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review branch context" },
          { label: "Compare performance", variant: "outline" },
          { label: "Open inspection", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <MeWorkspaceSection title="Branch Selector" description="Shared branch frame for future workspace mapping.">
        <BranchSelectorPlaceholder branches={branches} />
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Branch Overview" description="Operational context cards instead of presentation-only tiles.">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Total contexts", String(branches.length)],
            ["Aggregate", String(aggregateBranches.length)],
            ["Operational branches", String(localBranches.length)],
            ["Future branch", String(futureBranches.length)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] px-4 py-3.5 ring-1 ring-slate-200/75">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeRecordSummary
        title="KCH"
        subtitle="Branch detail preview"
        status="Active"
        guardrail="Branch preview only"
        meta={[
          { label: "Scope", value: "Local operations" },
          { label: "Manager", value: "Placeholder" },
          { label: "Linked modules", value: "PSI / Reports / Roles" },
          { label: "Context", value: "KCH branch view" },
          { label: "Issue watch", value: "2 open placeholders" },
          { label: "Inventory status", value: "Replenishment review active" },
          { label: "Reports status", value: "Weekly view ready" },
          { label: "Last updated", value: "Today 15:05" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review Branch", href: "#" },
          { label: "Open PSI", variant: "outline", href: "/psi" },
          { label: "Open Reports", variant: "outline", href: "/reports" },
          { label: "Export Summary", variant: "outline", href: "#" },
          { label: "View History", variant: "ghost", href: "#" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Operations" },
          { label: "Staff" },
          { label: "Inventory" },
          { label: "Reports" },
          { label: "Issues", badge: "2" },
          { label: "Activity" },
        ]}
      />

      <MeDetailWorkspace
        main={
          <>
            <MeWorkspaceSection title="Overview" description="Branch profile fields and local operating scope.">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    ["Branch", "KCH"],
                    ["Status", "Active"],
                    ["Scope", "Local operations"],
                    ["Manager", "Placeholder"],
                    ["Linked modules", "PSI / Reports / Roles"],
                    ["Inventory watch", "Replenishment review active"],
                    ["Issue load", "2 open placeholders"],
                    ["Report cadence", "Weekly operating review"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-slate-100/90 pb-3 last:border-b-0 md:last:border-b md:last:pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Branch Note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    KCH is the local branch context used to frame PSI, reports, and staff previews. This remains a shell-only branch record with no tenant persistence or permission enforcement.
                  </p>
                </div>
              </div>
            </MeWorkspaceSection>

            <MeWorkspaceSection title="Operations" description="Compact operating rows and branch-linked issue context.">
              <MeDataTable
                embedded
                columns={["Area", "Status", "Owner", "Notes"]}
                rows={[
                  ["PSI operations", "Watch", "Purchasing", "Procurement review linked to replenishment queue"],
                  ["Inventory readiness", "Active", "Warehouse", "Freezer and dry storage tracked in mock scope"],
                  ["Staff alignment", "Placeholder", "Branch manager", "No live staffing model connected"],
                ]}
              />
            </MeWorkspaceSection>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <MeWorkspaceSection title="Issues and Linked Modules" description="Branch-facing issue rows and module references.">
                <div className="grid gap-4">
                  <MeDataTable
                    embedded
                    columns={["Issue", "Module", "Status", "Action"]}
                    rows={[
                      ["Low-stock review", "PSI", "Open", "Link procurement placeholder"],
                      ["Weekly performance variance", "Reports", "Watch", "Review report workspace"],
                    ]}
                  />
                  <div className="rounded-[22px] bg-slate-50/82 px-4 py-4 ring-1 ring-slate-200/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Linked Modules</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      PSI, reports, and roles remain the active linked modules for this branch preview. No tenant-aware switching or branch-specific permissions are applied.
                    </p>
                  </div>
                </div>
              </MeWorkspaceSection>

              <MeStatusTimeline
                embedded
                title="Activity"
                items={[
                  { title: "Branch context reviewed", description: "KCH selected as the current local branch frame.", time: "09:00" },
                  { title: "PSI link opened", description: "Procurement and inventory previews remain available for KCH.", time: "10:15" },
                  { title: "Issue watch linked", description: "Low-stock branch issue attached to operating overview.", time: "12:05" },
                  { title: "Report preview updated", description: "Weekly review remains visible from the branch context.", time: "15:05" },
                ]}
              />
            </div>
          </>
        }
        context={
          <MeWorkspaceSection title="Branch Modules" description="Local branch links and context pointers.">
            <div className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-[22px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">PSI workspace linked for local replenishment review</div>
              <div className="rounded-[22px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">Reports workspace linked for branch performance review</div>
              <div className="rounded-[22px] bg-slate-50/82 px-4 py-3.5 ring-1 ring-slate-200/70">Roles preview linked for local staff context</div>
            </div>
          </MeWorkspaceSection>
        }
      />

      <MeWorkspaceSection title="All Stores" description="Portfolio-style branch overview for headquarters and leadership review.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aggregateBranches.map((branch) => (
            <BranchProfileCard key={branch.key} branch={branch} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Operational Branches" description="Store-level workspace previews for PSI, reporting, and role context.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {localBranches.map((branch) => (
            <BranchProfileCard key={branch.key} branch={branch} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Future Branch Planning" description="Placeholder capacity for onboarding and inspection workflows without implementing them yet.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {futureBranches.map((branch) => (
            <BranchProfileCard key={branch.key} branch={branch} />
          ))}
        </div>
      </MeWorkspaceSection>

      <DemoPresentationNote description="Branch pages now use the same SaaS shell while remaining mock/read-only. No tenant model, persistence, auth, access enforcement, or write behavior was added." />
    </MeDashboardShell>
  );
}
