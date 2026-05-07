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
          badge: "Current release",
          items: ["Business roles visible", "System foundation kept accessible", "Staff and access structure remain visible"],
        },
        {
          title: "Workspace Focus",
          items: ["Role profiles", "Access structure", "Training coverage", "Staff context"],
        },
        {
          title: "Guardrails",
          items: ["No auth", "No session middleware", "No permission enforcement", "No write paths"],
        },
      ]}
    />
  );

  return (
    <MeDashboardShell activeKey="roles" rightRail={rightRail}>
      <MePageHeader
        eyebrow="Roles & Staff"
        title="Role profiles and staff workspace shell"
        description="Role-based workspace framing for leadership, operations, and platform administration."
        notice="Current release provides role profiles, access structure, and staff context visibility. Auth, session, and permission enforcement remain outside this release."
        badges={[
          { label: "Roles" },
          { label: "Access catalog", variant: "secondary" },
          { label: "Current release", variant: "outline" },
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
          { label: "Write actions", value: "Disabled" },
        ]}
      />

      <MeActionBar
        actions={[
          { label: "Review role profile" },
          { label: "Open access view", variant: "secondary" },
          { label: "Open permissions", variant: "outline" },
          { label: "Assign training", variant: "outline" },
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
        <MeWorkspaceSection title="Staff Mapping Preview" description="Future user-to-role mapping stays visible without introducing auth or persistence.">
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

        <MeWorkspaceSection title="Access Group Preview" description="Admin-style permission framing without runtime enforcement.">
          <MeDataTable
            embedded
            columns={["Group", "Surface", "Mode", "Guardrail"]}
            rows={[
              ["Operations review", "PSI / Branches", "Visibility", "No approval execution"],
              ["Reporting review", "Reports", "Visibility", "No export runtime"],
              ["Foundation admin", "System routes", "Current release", "No auth/session enforced"],
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

      <DemoPresentationNote description="Roles now sit inside the shared customer-facing shell with role profiles, access structure, and staff context. Auth, session, permission enforcement, and write behavior remain in later phases." />
    </MeDashboardShell>
  );
}
