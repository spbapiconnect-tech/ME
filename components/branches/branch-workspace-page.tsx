import Link from "next/link";

import { BranchProfileCard } from "@/components/branches/branch-profile-card";
import { BranchSelectorPlaceholder } from "@/components/branches/branch-selector-placeholder";
import { DemoPresentationNote } from "@/components/demo-mode";
import {
  MeActionBar,
  MeDashboardShell,
  MePageHeader,
  MeRightRail,
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
          title: "Branch Status",
          badge: "Preview only",
          items: ["All Stores overview available", "KCH and BTU context visible", "Future branch remains placeholder-only"],
        },
        {
          title: "Quick Context",
          items: ["Related routes: PSI, reports, roles", "No tenant switching", "No persisted branch selection"],
        },
        {
          title: "Guardrails",
          items: ["No branch database", "No permission enforcement", "No auth or session", "No writes"],
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
            <div key={label} className="rounded-2xl border border-border/50 bg-slate-50/90 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

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
