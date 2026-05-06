import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const foundationCards = [
  { key: "layout-engine", title: "Layout Engine", route: "/layout-engine", description: "Layout/skin and renderer foundations." },
  { key: "action-contracts", title: "Action Contracts", route: "/action-contracts", description: "Action metadata contracts and mapping." },
  { key: "access-control", title: "Access Control", route: "/access-control", description: "Permission and role contract previews." },
  { key: "audit-trail", title: "Audit Trail", route: "/audit-trail", description: "Audit contract metadata previews." },
  { key: "workflow", title: "Workflow", route: "/workflow", description: "Workflow trigger and contract placeholders." },
  { key: "notifications", title: "Notifications", route: "/notifications", description: "Notification contract placeholders only." },
  { key: "reports", title: "Reports", route: "/reports", description: "Report widget and source contract previews." },
  { key: "rules", title: "Rules", route: "/rules", description: "Rule and formula contract foundations." },
  { key: "packages", title: "Packages", route: "/packages", description: "SaaS package/plan metadata previews." },
  { key: "psi", title: "PSI Foundation", route: "/psi", description: "Read-only PSI workspace and report placeholders." },
] as const;

export function SystemFoundationPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl">ME System Foundation</CardTitle>
          <CardDescription>Platform Contracts / Metadata / Source Mapping</CardDescription>
          <CardDescription>
            These routes are admin/developer/system configuration foundations and remain metadata-first, mock, and read-only.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link href="/">Back To ME Workspace</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="/reports">Open Reports</Link></Button>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {foundationCards.map((item) => (
          <Card key={item.key} size="sm" className="h-full">
            <CardHeader className="gap-1">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline">
                <Link href={item.route}>Open {item.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
