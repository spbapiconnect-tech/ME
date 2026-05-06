import Link from "next/link";

import { BranchChip } from "@/components/branches/branch-chip";
import { BranchProfileCard } from "@/components/branches/branch-profile-card";
import { BranchSelectorPlaceholder } from "@/components/branches/branch-selector-placeholder";
import { MeBreadcrumbs, MeSidebar, MeTopbar } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MeBranchProfile } from "@/types/branch-context";

interface BranchWorkspacePageProps {
  branches: MeBranchProfile[];
}

export function BranchWorkspacePage({ branches }: BranchWorkspacePageProps) {
  const aggregateBranches = branches.filter((branch) => branch.isAggregate);
  const localBranches = branches.filter((branch) => !branch.isAggregate && branch.status !== "coming-soon");
  const futureBranches = branches.filter((branch) => branch.status === "coming-soon");

  return (
    <main className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <MeSidebar activeKey="branches" className="self-start" />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">ME Branch Context</CardTitle>
                  <CardDescription>Store / Branch Context Placeholder</CardDescription>
                </div>
                <BranchChip label="preview-only" tone="info" />
              </div>
              <CardDescription>
                Branch preview only — no tenant switching, no branch database, and no branch permission enforcement.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/">Back To ME Workspace</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/roles">Open Roles Preview</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/navigation">Open Navigation IA</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <BranchSelectorPlaceholder branches={branches} />

          <Card size="sm" className="border-dashed">
            <CardHeader className="gap-1">
              <CardTitle className="text-sm">Overview</CardTitle>
              <CardDescription>
                Compare how ME business workspace, roles, navigation, PSI, and reports can be previewed under aggregate and branch-specific contexts before any tenant model exists.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>UI-only and mock/read-only only.</p>
              <p>No real tenant model, branch database, branch switching persistence, or permission enforcement.</p>
              <p>No auth/session/middleware, API, workflow execution, notification sending, or write paths.</p>
            </CardContent>
          </Card>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Aggregate Context</p>
              <p className="text-sm text-muted-foreground">Portfolio-style preview for headquarters and leadership review.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {aggregateBranches.map((branch) => (
                <BranchProfileCard key={branch.key} branch={branch} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Local Branch Contexts</p>
              <p className="text-sm text-muted-foreground">Operational branch previews for store-level PSI, reporting, and role workflows.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {localBranches.map((branch) => (
                <BranchProfileCard key={branch.key} branch={branch} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <div>
              <p className="text-sm font-semibold">Future Branch Planning</p>
              <p className="text-sm text-muted-foreground">Placeholder for future tenant and branch onboarding flows.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {futureBranches.map((branch) => (
                <BranchProfileCard key={branch.key} branch={branch} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
