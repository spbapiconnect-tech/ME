import Link from "next/link";

import { BranchActionPanel } from "@/components/branches/branch-action-panel";
import { BranchChip } from "@/components/branches/branch-chip";
import { BranchMetricCard } from "@/components/branches/branch-metric-card";
import { BranchNavigationPreview } from "@/components/branches/branch-navigation-preview";
import { BranchSelectorPlaceholder } from "@/components/branches/branch-selector-placeholder";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBranchProfiles } from "@/lib/branch-context";
import type { MeBranchWorkspaceData } from "@/types/branch-context";

interface BranchWorkspaceDetailPageProps {
  data: MeBranchWorkspaceData | null;
  branchKey: string;
}

interface PreviewLinkSectionProps {
  title: string;
  description: string;
  links: MeBranchWorkspaceData["roleLinks"];
}

function PreviewLinkSection({ title, description, links }: PreviewLinkSectionProps) {
  return (
    <Card className="border border-border/70 bg-card/95">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <div key={link.key} className="rounded-xl border border-border/70 p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{link.label.en}</p>
                <p className="text-xs text-muted-foreground">{link.label.zh}</p>
              </div>
              <BranchChip label={link.tone} tone={link.tone} />
            </div>
            {link.description ? <p className="mb-3 text-xs text-muted-foreground">{link.description.en}</p> : null}
            <Button asChild  variant="outline">
              <Link href={link.route}>Open</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function BranchWorkspaceDetailPage({ data, branchKey }: BranchWorkspaceDetailPageProps) {
  if (!data) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <MeBreadcrumbs />
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">ME Branch Context Not Found</CardTitle>
            <CardDescription>No branch preview exists for `{branchKey}`.</CardDescription>
            <CardDescription>
              Available branch previews remain UI-only and do not create real tenant switching, database state, auth, or permission rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild  variant="outline">
              <Link href="/branches">Back To Branches</Link>
            </Button>
            <Button asChild  variant="outline">
              <Link href="/navigation">Open Navigation IA</Link>
            </Button>
            <Button asChild  variant="outline">
              <Link href="/reports">Open Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const branches = getBranchProfiles();

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="branches" className="self-start" />

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
                  <BranchChip label={data.branch.status} tone={data.branch.tone} status={data.branch.status} />
                  <BranchChip label={data.branch.isAggregate ? "aggregate" : "local"} tone="muted" />
                </div>
              </div>
              <CardDescription>{data.notice.en}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button asChild  variant="outline">
                  <Link href="/branches">All Branches</Link>
                </Button>
                <Button asChild  variant="outline">
                  <Link href="/roles">Roles</Link>
                </Button>
                <Button asChild  variant="outline">
                  <Link href="/navigation">Navigation IA</Link>
                </Button>
                <Button asChild  variant="outline">
                  <Link href="/reports">Reports</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <BranchSelectorPlaceholder branches={branches} selectedBranchKey={data.branch.key} compact />

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <BranchMetricCard key={metric.key} metric={metric} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <Card className="border border-border/70 bg-card/95">
              <CardHeader className="gap-1">
                <CardTitle className="text-sm">Branch Alerts</CardTitle>
                <CardDescription>Read-only alerts that describe the selected branch preview context.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {data.alerts.map((alert) => (
                  <div key={alert.key} className="rounded-xl border border-border/70 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{alert.title.en}</p>
                      <BranchChip label={alert.tone} tone={alert.tone} />
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">{alert.description.en}</p>
                    <p className="text-xs text-muted-foreground">Source: {alert.sourceModule}</p>
                    {alert.timestampLabel ? <p className="mt-1 text-xs text-muted-foreground">{alert.timestampLabel.en}</p> : null}
                    {alert.route ? (
                      <Button asChild  variant="outline" className="mt-3">
                        <Link href={alert.route}>Open</Link>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>

            <BranchActionPanel actions={data.actions} />
          </section>

          <PreviewLinkSection
            title="Role Preview Links"
            description="Branch-aware role preview links remain descriptive only and do not apply branch filtering."
            links={data.roleLinks}
          />

          <PreviewLinkSection
            title="PSI Preview Links"
            description="PSI routes stay shared globally; these links simply describe which PSI surfaces matter for the selected branch context."
            links={data.psiLinks}
          />

          <PreviewLinkSection
            title="Report Preview Links"
            description="Reports remain shared routes with branch-aware placeholder context only."
            links={data.reportLinks}
          />

          <BranchNavigationPreview navigationPreview={data.navigationPreview} />

          <Card className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Branch Notes</CardTitle>
              <CardDescription>Generated at: {data.generatedAt}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>{data.branch.notes}</p>
              <p>No real tenant switching, no branch database, and no permission enforcement are added in this milestone.</p>
              <p>No auth/session/middleware, API, workflow execution, notification sending, task creation, or write path is added.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
