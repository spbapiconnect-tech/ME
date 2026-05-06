import Link from "next/link";

import { MeBreadcrumbs, MeNavigationGroup } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationGroupByKey } from "@/lib/navigation";

export function SystemFoundationPage() {
  const foundationGroup = getNavigationGroupByKey("system-foundation");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl">ME System Foundation</CardTitle>
          <CardDescription>Platform Contracts / Metadata / Source Mapping</CardDescription>
          <CardDescription>
            These routes are admin/developer/system configuration foundations and remain metadata-first, mock, and read-only.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link href="/">Back To ME Workspace</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/navigation">Open Navigation IA</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/reports">Open Reports</Link></Button>
          </div>
        </CardHeader>
      </Card>

      {foundationGroup ? <MeNavigationGroup group={foundationGroup} /> : null}

      <Card size="sm" className="border-dashed">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Foundation Notice</CardTitle>
          <CardDescription>
            Foundation routes remain secondary to the business workspace and stay available without auth, session, or permission enforcement.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          UI-only foundation navigation. No real database, API, write operation, workflow execution, or notification sending is connected.
        </CardContent>
      </Card>
    </main>
  );
}
