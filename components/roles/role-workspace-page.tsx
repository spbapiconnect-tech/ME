import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import {
  MeActionBar,
  MeDashboardShell,
  MePageHeader,
  MeRightRail,
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
          badge: "Preview only",
          items: ["Business roles visible", "System foundation kept accessible", "Staff and permissions remain placeholders"],
        },
        {
          title: "Workspace Focus",
          items: ["Role profiles", "Access preview", "Training placeholder", "Staff context placeholder"],
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
        notice="Role preview only. No auth, session, or permission enforcement is connected."
        badges={[
          { label: "Roles" },
          { label: "Permissions placeholder", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
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
          { label: "Open permissions", variant: "outline" },
          { label: "Assign training", variant: "outline" },
          { label: "View history", variant: "ghost" },
        ]}
      />

      <MeWorkspaceSection title="Role Workspace Summary" description="Operational summary cards for the role/staff area.">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Role profiles", String(roles.length)],
            ["Business users", String(businessRoles.length)],
            ["Platform admins", String(platformRoles.length)],
            ["Permission mode", "Placeholder"],
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

      <MeWorkspaceSection title="Platform Administration" description="Governance and foundation access previews.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformRoles.map((role) => (
            <RoleProfileCard key={role.key} role={role} />
          ))}
        </div>
      </MeWorkspaceSection>

      <MeWorkspaceSection title="Placeholder Staff Surfaces" description="Reserved operational regions without implementing staff management or permission writes.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Staff profile directory placeholder",
            "Permission matrix placeholder",
            "Training and certification placeholder",
          ].map((item) => (
            <div key={item} className="rounded-[24px] bg-slate-50/88 p-4 text-sm text-slate-600 ring-1 ring-slate-200/75">
              {item}
            </div>
          ))}
        </div>
      </MeWorkspaceSection>

      <DemoPresentationNote description="Roles now sit inside the shared SaaS shell and remain visual-only. No auth, session, permission, or staff write behavior was added." />
    </MeDashboardShell>
  );
}
