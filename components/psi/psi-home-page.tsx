import Link from "next/link";

import { MeBreadcrumbs } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNavigationItemByKey, resolveNavigationLabel } from "@/lib/navigation";

const quickNavigationKeys = ["dashboard", "reports", "navigation-ia", "system-foundation"] as const;

export function PsiHomePage() {
  const quickLinks = quickNavigationKeys
    .map((key) => getNavigationItemByKey(key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <MeBreadcrumbs />

      <Card>
        <CardHeader className="gap-2">
          <CardTitle>ME PSI Workspace</CardTitle>
          <CardDescription>Procurement / Supplier / Inventory Service MVP Design</CardDescription>
          <CardDescription>
            Read-only foundation with mock repositories only. No database/API, no stock posting, no approval workflow,
            no supplier portal, and no write operations.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Button key={item.key} asChild size="sm" variant="outline">
                <Link href={item.href}>{resolveNavigationLabel(item)}</Link>
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Link href="/psi/procurement" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Procurement Workspace</Link>
          <Link href="/psi/supplier" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Supplier Workspace</Link>
          <Link href="/psi/inventory" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Inventory Workspace</Link>
          <Link href="/psi/issues" className="rounded-xl border p-4 text-sm hover:bg-muted/40">PSI Issue Placeholders</Link>
          <Link href="/psi/actions" className="rounded-xl border p-4 text-sm hover:bg-muted/40 md:col-span-3">PSI Action Drafts</Link>
          <Link href="/reports" className="rounded-xl border p-4 text-sm hover:bg-muted/40 md:col-span-3">PSI Report Preview</Link>
          <Link href="/system-foundation" className="rounded-xl border p-4 text-sm hover:bg-muted/40 md:col-span-3">ME System Foundation</Link>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Cross-Module Loop</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Supplier → Procurement → Receiving → Inventory → Stock Risk → Task Placeholder
        </CardContent>
      </Card>
    </main>
  );
}
