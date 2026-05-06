import Link from "next/link";

import { DemoPresentationNote } from "@/components/demo-mode";
import { MeDashboardShell, MePageHeader, MeRightRail } from "@/components/layout";
import { MeNavigationGroup } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationGroupByKey } from "@/lib/navigation";

export function SystemFoundationPage() {
  const foundationGroup = getNavigationGroupByKey("system-foundation");

  return (
    <MeDashboardShell
      activeKey="system-foundation"
      rightRail={
        <MeRightRail
          sections={[
            { title: "Foundation Scope", badge: "Admin shell", items: ["Layouts", "Rules", "Workflow", "Notifications", "Audit and access"] },
            { title: "Route Behavior", items: ["Accessible from shared sidebar", "Business routes remain intact", "No runtime settings execution"] },
            { title: "Guardrails", items: ["No database writes", "No API wiring", "No workflow execution", "No notification sending"] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="System Foundation"
        title="Platform foundations and administrative structure"
        description="Platform contracts, metadata, source mapping, and future governance routes inside the shared shell."
        notice="These routes are admin/developer/system configuration foundations and remain metadata-first, mock, and read-only."
        badges={[
          { label: "Secondary foundation" },
          { label: "Shared shell", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/navigation">Open Navigation IA</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/reports">Open Reports</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/roles">Open Roles</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Foundation routes", value: String(foundationGroup?.items.length ?? 0) },
          { label: "Mode", value: "Metadata-first" },
          { label: "Shell", value: "Operational admin style" },
          { label: "Writes", value: "Disabled" },
        ]}
      />

      <DemoPresentationNote description="System foundation now sits inside the same operational shell while remaining read-only. No real platform settings, workflow, notifications, or access execution was added." />

      {foundationGroup ? <MeNavigationGroup group={foundationGroup} /> : null}

      <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">Foundation Notice</CardTitle>
          <CardDescription>Foundation routes remain secondary to the business workspace and stay available without auth, session, or permission enforcement.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-slate-600">
          <p>UI-only foundation navigation. No real database, API, write operation, workflow execution, or notification sending is connected.</p>
          <p>`/roles` remains a preview-only bridge to future role-aware navigation and permission foundations without runtime enforcement.</p>
          <p>`/branches` previews future tenant/store scope without a real branch database, switching persistence, or access enforcement.</p>
          <p>`/demo-story`, `/demo-mode`, `/stakeholder-summary`, and `/demo-readiness` remain presentation surfaces only.</p>
        </CardContent>
      </Card>
    </MeDashboardShell>
  );
}
