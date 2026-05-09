import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import {
  MeActionBar,
  MeDashboardShell,
  MeDataTable,
  MePageHeader,
  MeRightRail,
  MeTabs,
  MeWorkspaceSection,
} from "@/components/layout";
import { RoleProfileCard } from "@/components/roles/role-profile-card";
import { Button } from "@/components/ui/button";
import type { MeRoleProfile } from "@/types/role-workspace";

interface RoleWorkspacePageProps {
  roles: MeRoleProfile[];
}

export function RoleWorkspacePage({ roles }: RoleWorkspacePageProps) {
  const businessRoles = roles.filter((role) => role.key !== "system-admin");
  const platformRoles = roles.filter((role) => role.key === "system-admin");

  const rightRail = (
    <MeRightRail
      sections={[
        {
          title: "Role Context",
          badge: "Access review",
          items: ["Business roles visible", "System foundation kept accessible", "Staff and access structure remain visible"],
        },
        {
          title: "Workspace Focus",
          items: ["Role profiles", "Access structure", "Training coverage", "Staff context"],
        },
        {
          title: "Service Scope",
          items: ["Role catalog", "Branch access view", "Staff mapping", "Security review"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="roles" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Roles & Staff"
        title="Role profiles and access workspace"
        description="Role-based operations and access workspace for leadership, branch management, and platform administration."
        notice="Use this workspace to review role coverage, branch access scope, staff mapping, and security-administration context."
        badges={[
          { label: "Roles" },
          { label: "Access catalog", variant: "secondary" },
          { label: "Security administration", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/navigation">Open Navigation IA</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/system-foundation">Open System Foundation</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/branches">Open Branches</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Profiles", value: String(roles.length) },
          { label: "Business roles", value: String(businessRoles.length) },
          { label: "Platform roles", value: String(platformRoles.length) },
          { label: "Operating mode", value: "Access review" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review role profile" },
          { label: "Open access view", variant: "secondary" },
          { label: "Open permissions", variant: "outline" },
          { label: "Preview training scope", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <MeTabs
        style="detail"
        tabs={[
          { label: "Overview", active: true },
          { label: "Role Profiles" },
          { label: "Staff Mapping" },
          { label: "Access Groups" },
          { label: "Activity" },
        ]}
      />

      <MeWorkspaceSection title="Role Workspace Summary" description="Operational summary cards for the role/staff area.">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Role profiles", String(roles.length)],
            ["Business users", String(businessRoles.length)],
            ["Platform admins", String(platformRoles.length)],
            ["Permission mode", "Structured"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.94))] px-4 py-3.5 ring-1 ring-slate-200/75">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Business Role Profiles" description="Leadership, operations, and frontline workspace perspectives.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businessRoles.map((role) => (
            <RoleProfileCard key={role.key} role={role} />
          ))}
        </div>
      </MeWorkspaceSection>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <MeWorkspaceSection title="Staff Mapping" description="Current staff-to-role alignment across branches and operating teams.">
          <MeDataTable
            embedded
            columns={["Staff", "Role", "Branch", "Access scope", "Status"]}
            rows={[
              ["KCH Store Manager", "Branch manager", "KCH", "Operations and reports", "Current scope"],
              ["Purchasing Lead", "Procurement lead", "All Stores", "PSI and supplier detail", "Current scope"],
              ["Platform Administrator", "System admin", "Global", "Foundation routes", "Current scope"],
            ]}
          />
        </MeWorkspaceSection>

        <MeWorkspaceSection title="Access Groups" description="Module-level access structure for store, operations, and platform administration.">
          <MeDataTable
            embedded
            columns={["Group", "Surface", "Mode", "Operating Rule"]}
            rows={[
              ["Operations review", "PSI / Branches", "Visibility", "No approval execution"],
              ["Reporting review", "Reports", "Visibility", "No export runtime"],
              ["Foundation admin", "System routes", "Customer preview", "Access workflow managed centrally"],
            ]}
          />
        </MeWorkspaceSection>
      </div>

      <MeWorkspaceSection title="Platform Administration" description="Governance and foundation access previews.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformRoles.map((role) => (
            <RoleProfileCard key={role.key} role={role} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Staff Workspace Surfaces" description="Operational regions reserved for directory, access, and training coordination.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Staff profile directory",
            "Permission matrix",
            "Training and certification",
          ].map((item) => (
            <div key={item} className="rounded-[24px] bg-slate-50/88 p-4 text-sm text-slate-600 ring-1 ring-slate-200/75">
              {item}
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <DemoPresentationNote title="Workspace Note" description="Roles and access now use the same production workspace structure as branch, PSI, and reporting surfaces." />
    </MeDashboardShell>
  );
}
