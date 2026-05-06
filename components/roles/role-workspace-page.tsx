import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { RoleChip } from "@/components/roles/role-chip";
import { RoleProfileCard } from "@/components/roles/role-profile-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeRoleProfile } from "@/types/role-workspace";

interface RoleWorkspacePageProps {
  roles: MeRoleProfile[];
}

export function RoleWorkspacePage({ roles }: RoleWorkspacePageProps) {
  const businessRoles = roles.filter((role) => role.key !== "system-admin");
  const platformRoles = roles.filter((role) => role.key === "system-admin");

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="roles" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">ME Role Workspaces</CardTitle>
                  <CardDescription>Role-Based Workspace Placeholder</CardDescription>
                </div>
                <RoleChip label="preview-only" tone="info" />
              </div>
              <CardDescription>Role preview only — no auth or permission enforcement.</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-story/role-workspaces">View In Demo Story</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/demo-mode">Open Demo Mode</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/navigation">Open Navigation IA</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <DemoPresentationNote description="Screenshot-ready placeholder — all data is mock/read-only. Role framing is visual only and does not introduce real permissions or session-aware mode." />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Overview</CardTitle>
              <CardDescription>
                Compare how the same ME platform can be previewed for business leadership, frontline execution, and system governance without introducing real sessions, permissions, or route guards.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>UI-only and mock/read-only only.</p>
              <p>No real auth, session, middleware, or permission enforcement.</p>
              <p>No database, API, workflow execution, notification sending, or business writes.</p>
            </CardContent>
          </Card>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Business Roles</p>
              <p className="text-sm text-muted-foreground">Leadership, operations, and frontline workspace perspectives.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {businessRoles.map((role) => (
                <RoleProfileCard key={role.key} role={role} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Platform Roles</p>
              <p className="text-sm text-muted-foreground">Metadata, governance, and system foundation preview.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {platformRoles.map((role) => (
                <RoleProfileCard key={role.key} role={role} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
