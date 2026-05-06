import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
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
            <Button asChild size="sm" variant="outline"><Link href="/demo-mode">Open Demo Mode</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/stakeholder-summary">Open Stakeholder Summary</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/demo-readiness">Open Demo Readiness</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/demo-story/system-foundation">View In Demo Story</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/reports">Open Reports</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/roles">Open Roles Preview</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/branches">Open Branch Context</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <DemoPresentationNote description="Screenshot-ready placeholder — all data is mock/read-only. System foundation remains secondary and presentation-friendly without activating any real platform settings." />

      {foundationGroup ? <MeNavigationGroup group={foundationGroup} /> : null}

      <Card size="sm" className="border-dashed">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Foundation Notice</CardTitle>
          <CardDescription>
            Foundation routes remain secondary to the business workspace and stay available without auth, session, or permission enforcement.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>UI-only foundation navigation. No real database, API, write operation, workflow execution, or notification sending is connected.</p>
          <p>`/roles` remains a preview-only bridge to future role-aware navigation and permission foundations without any runtime enforcement.</p>
          <p>`/branches` previews future tenant/store scope and selector foundations without adding a real branch database, switching persistence, or access enforcement.</p>
          <p>`/demo-story` now reconnects foundation routes back into the business narrative without adding onboarding state, analytics, or tracking.</p>
          <p>`/demo-mode` adds screenshot framing only and does not enable a real presentation mode engine.</p>
          <p>`/stakeholder-summary` turns the existing routes into a presentation-ready overview without adding an investor portal, CRM, analytics, or sharing permissions.</p>
          <p>`/demo-readiness` provides the final static QA pass without adding monitoring, analytics, tracking, browser automation, runtime crawling, or CI changes.</p>
        </CardContent>
      </Card>
    </main>
  );
}
