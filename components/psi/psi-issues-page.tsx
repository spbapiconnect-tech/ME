import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiIssuePlaceholderRow } from "@/lib/page-data/psi/issues-page-data";

interface PsiIssuesPageProps {
  rows: PsiIssuePlaceholderRow[];
  source: string;
  isMock: boolean;
  error?: string;
}

export function PsiIssuesPage({ rows, source, isMock, error }: PsiIssuesPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>ME PSI Issues</CardTitle>
          <CardDescription>Combined procurement / supplier / inventory issue placeholders.</CardDescription>
          <CardDescription>Source: {source} · {isMock ? "Mock Repository" : "Unknown"}</CardDescription>
          {error ? <CardDescription className="text-destructive">{error}</CardDescription> : null}
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Issue Placeholders</CardTitle>
          <CardDescription>No real issue status changes, no real task creation, and no audit persistence.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {rows.map((row) => (
            <div key={row.issueId} className="rounded-lg border p-3 text-sm">
              <div className="font-medium">{row.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">module: {row.moduleCode}</Badge>
                <Badge variant="outline">priority: {row.priority}</Badge>
                <Badge variant="secondary">status: {row.status}</Badge>
                <Badge variant="outline">source: {row.sourceRef}</Badge>
                <Badge variant="outline">lifecycle: {row.lifecycleStage}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                {row.detailHref ? <Link href={row.detailHref} className="text-primary hover:underline">Open module detail</Link> : null}
                {row.actionHref ? <Link href={row.actionHref} className="text-primary hover:underline">Open action placeholder</Link> : null}
              </div>
            </div>
          ))}
          {rows.length === 0 ? <div className="text-sm text-muted-foreground">No issue placeholders available.</div> : null}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Read-only Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          <div>No real issue status transition is performed.</div>
          <div>No real task creation is performed.</div>
          <div>No real audit write or workflow trigger is performed.</div>
          <div>No real notification sending is performed.</div>
        </CardContent>
      </Card>
    </main>
  );
}
