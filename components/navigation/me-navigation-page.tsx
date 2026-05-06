import Link from "next/link";

import { MeBreadcrumbs } from "@/components/navigation/me-breadcrumbs";
import { MeNavigationCard } from "@/components/navigation/me-navigation-card";
import { MeNavigationGroup } from "@/components/navigation/me-navigation-group";
import { MeTopbar } from "@/components/navigation/me-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationMap } from "@/lib/navigation";

export function MeNavigationPage() {
  const navigation = getNavigationMap();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />
      <MeTopbar />

      <Card>
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">ME Navigation IA</CardTitle>
              <CardDescription>Business Navigation / System Foundation Map</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/">Back To ME Workspace</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/system-foundation">Open System Foundation</Link>
              </Button>
            </div>
          </div>
          <CardDescription>{navigation.notice.en}</CardDescription>
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-sm">Primary Navigation Preview</CardTitle>
            <Badge variant="outline">UI-only</Badge>
          </div>
          <CardDescription>Business-first destinations appear before secondary foundation links.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {navigation.primaryItems.map((item) => (
            <MeNavigationCard key={item.key} item={item} />
          ))}
        </CardContent>
      </Card>

      {navigation.groups.map((group) => (
        <MeNavigationGroup key={group.key} group={group} />
      ))}

      <Card size="sm" className="border-dashed">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Footer / Secondary Links</CardTitle>
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

      <Card size="sm" className="border-dashed">
        <CardHeader className="gap-1">
          <CardTitle className="text-sm">Notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>UI-only.</p>
          <p>No permission enforcement.</p>
          <p>No auth/session.</p>
          <p>Foundation routes remain accessible.</p>
        </CardContent>
      </Card>
    </main>
  );
}
