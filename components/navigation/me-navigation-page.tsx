import Link from "next/link";

import { MeDashboardShell, MePageHeader, MeRightRail, MeWorkspaceSection } from "@/components/layout";
import { MeNavigationCard } from "@/components/navigation/me-navigation-card";
import { MeNavigationGroup } from "@/components/navigation/me-navigation-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationMap } from "@/lib/navigation";

export function MeNavigationPage() {
  const navigation = getNavigationMap();

  return (
    <MeDashboardShell
      activeKey="navigation-ia"
      rightRail={
        <MeRightRail
          sections={[
            { title: "Sidebar Logic", badge: "Config-driven", items: ["Grouped navigation", "Route-aware expansion", "Placeholder-safe child items"] },
            { title: "Primary Routes", items: navigation.primaryItems.map((item) => item.label.en) },
            { title: "Guardrails", items: ["No route rewrites", "No auth/permission logic", "No storage persistence", "No write execution"] },
          ]}
        />
      }
    >
      <MePageHeader
        eyebrow="Navigation IA"
        title="ME grouped navigation and route map"
        description="Business navigation, system foundations, and presentation routes aligned under one shell."
        notice={navigation.notice.en}
        badges={[
          { label: "Shared config" },
          { label: "Expandable sidebar", variant: "secondary" },
          { label: "Read-only", variant: "outline" },
        ]}
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/">Open Workspace</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/system-foundation">Open System Foundation</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/branches">Open Branch Context</Link>
            </Button>
          </>
        }
        meta={[
          { label: "Primary routes", value: String(navigation.primaryItems.length) },
          { label: "Sidebar groups", value: String(navigation.sidebarGroups.length) },
          { label: "Footer routes", value: String(navigation.footerItems.length) },
          { label: "Generated", value: navigation.generatedAt },
        ]}
      />

      <MeWorkspaceSection title="Primary Navigation Preview" description="Business-first destinations appear before secondary foundation links.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {navigation.primaryItems.map((item) => (
            <MeNavigationCard key={item.key} item={item} />
          ))}
        </div>
      </MeWorkspaceSection>

      {navigation.groups.map((group) => (
        <MeNavigationGroup key={group.key} group={group} />
      ))}

      <Card size="sm" className="border-border/40 bg-white/90 shadow-sm shadow-slate-900/5">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm text-slate-900">Footer / Secondary Links</CardTitle>
          <CardDescription>Support routes remain accessible without competing with the primary business IA.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {navigation.footerItems.map((item) => (
            <Button key={item.key} asChild size="sm" variant="outline">
              <Link href={item.href}>{item.label.en}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </MeDashboardShell>
  );
}
