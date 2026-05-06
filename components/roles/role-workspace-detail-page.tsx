import Link from "next/link";

import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { RoleActionPanel } from "@/components/roles/role-action-panel";
import { RoleChip } from "@/components/roles/role-chip";
import { RoleMetricCard } from "@/components/roles/role-metric-card";
import { RoleNavigationPreview } from "@/components/roles/role-navigation-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeRoleWorkspaceData } from "@/types/role-workspace";

interface RoleWorkspaceDetailPageProps {
  data: MeRoleWorkspaceData | null;
  roleKey: string;
}

export function RoleWorkspaceDetailPage({ data, roleKey }: RoleWorkspaceDetailPageProps) {
  if (!data) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <MeBreadcrumbs />
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">ME Role Workspace Not Found</CardTitle>
            <CardDescription>No role preview exists for `{roleKey}`.</CardDescription>
            <CardDescription>
              Available role previews remain UI-only and do not create real auth, session, or permission rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/roles">Back To Roles</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/navigation">Open Navigation IA</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="roles" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">{data.title.en}</CardTitle>
                  <CardDescription>{data.title.zh}</CardDescription>
                  <CardDescription>{data.subtitle.en}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <RoleChip label={data.role.status} tone={data.role.tone} status={data.role.status} />
                  <RoleChip label={data.role.foundationAccessLevel} tone="muted" />
                </div>
              </div>
              <CardDescription>{data.notice.en}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={data.role.defaultRoute}>Open Default Route</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/roles">All Roles</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/navigation">Navigation IA</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <RoleMetricCard key={metric.key} metric={metric} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <Card size="sm" className="border border-border/70 bg-card/95">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">Visible Modules</CardTitle>
                <CardDescription>Role-specific module placeholders and status context</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {data.modules.map((module) => (
                  <div key={module.key} className="rounded-xl border border-border/70 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{module.title.en}</p>
                        <p className="text-xs text-muted-foreground">{module.title.zh}</p>
                      </div>
                      <RoleChip label={module.status} tone={module.tone} status={module.status} />
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{module.description.en}</p>
                    {module.reason ? <p className="mb-3 text-xs text-muted-foreground">{module.reason.en}</p> : null}
                    <Button asChild size="sm" variant="outline">
                      <Link href={module.route}>Open</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <RoleActionPanel actions={data.actions} />
          </section>

          <RoleNavigationPreview navigationPreview={data.navigationPreview} foundationPreview={data.foundationPreview} />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Role Notes</CardTitle>
              <CardDescription>Generated at: {data.generatedAt}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>{data.role.notes}</p>
              <p>No real auth/session/permission enforcement or middleware is added in this milestone.</p>
              <p>No database, API, workflow execution, notification sending, or business write path is added.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
