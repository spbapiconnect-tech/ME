import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PsiHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>ME PSI Workspace</CardTitle>
          <CardDescription>Procurement / Supplier / Inventory Service MVP Design</CardDescription>
          <CardDescription>
            Read-only foundation with mock repositories only. No database/API, no stock posting, no approval workflow,
            no supplier portal, no POS integration, and no write operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Link href="/psi/procurement" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Procurement Workspace</Link>
          <Link href="/psi/supplier" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Supplier Workspace</Link>
          <Link href="/psi/inventory" className="rounded-xl border p-4 text-sm hover:bg-muted/40">Inventory Workspace</Link>
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
