import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DisplayRecord } from "@/types/display-model";

interface PsiWorkspaceLayoutV072Props {
  title: string;
  subtitle: string;
  source: string;
  isMock: boolean;
  error?: string;
  stats: Array<{ label: string; value: string | number }>;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
  detailBasePath: string;
  actionShortcuts?: Array<{ label: string; actionKey: string }>;
}

function getMetaValue(record: DisplayRecord, key: string): string {
  return record.meta.find((item) => item.label.en.toLowerCase().includes(key.toLowerCase()))?.value ?? "placeholder";
}

export function PsiWorkspaceLayoutV072(props: PsiWorkspaceLayoutV072Props) {
  const { title, subtitle, source, isMock, error, stats, records, issueRecords, detailBasePath, actionShortcuts = [] } = props;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
          <CardDescription>
            Source: {source} · {isMock ? "Mock Repository" : "Unknown"}
          </CardDescription>
          {error ? <CardDescription className="text-destructive">{error}</CardDescription> : null}
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader><CardTitle className="text-sm">KPI Preview</CardTitle></CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader><CardTitle className="text-sm">Action Shortcuts</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/psi/actions" className="rounded-lg border px-3 py-2 text-xs hover:bg-muted/40">Open PSI Actions</Link>
          <Link href="/psi/issues" className="rounded-lg border px-3 py-2 text-xs hover:bg-muted/40">Open PSI Issues</Link>
          <Link href="/reports" className="rounded-lg border px-3 py-2 text-xs hover:bg-muted/40">PSI Report Preview</Link>
          {actionShortcuts.map((item) => (
            <Link key={item.actionKey} href={`/psi/actions/${item.actionKey}`} className="rounded-lg border px-3 py-2 text-xs hover:bg-muted/40">
              {item.label}
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader><CardTitle className="text-sm">Main Records</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          {records.map((record) => (
            <Link key={record.id} href={`${detailBasePath}/${record.id}`} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
              <div className="font-medium">{record.title}</div>
              <div className="text-xs text-muted-foreground">{record.subtitle}</div>
              <div className="text-xs text-muted-foreground">{record.description}</div>
            </Link>
          ))}
          {records.length === 0 ? <div className="text-sm text-muted-foreground">No records</div> : null}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Issue Preview</CardTitle>
          <CardDescription>Lifecycle and related action are placeholders only. No real issue updates are executed.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {issueRecords.map((record) => {
            const lifecycle = getMetaValue(record, "lifecycle");
            const sourceRef = getMetaValue(record, "source");
            const relatedAction = getMetaValue(record, "related action");
            const actionHref = relatedAction.startsWith("psi.action.") ? `/psi/actions/${relatedAction}` : "/psi/actions";

            return (
              <div key={record.id} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">{record.title}</div>
                <div className="text-xs text-muted-foreground">{record.description}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">status: {record.status}</Badge>
                  <Badge variant="outline">priority: {record.priority}</Badge>
                  <Badge variant="outline">lifecycle: {lifecycle}</Badge>
                  <Badge variant="outline">source: {sourceRef}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <Link href={actionHref} className="text-primary hover:underline">Related action placeholder</Link>
                  <Link href="/psi/issues" className="text-primary hover:underline">Open issue hub</Link>
                </div>
              </div>
            );
          })}
          {issueRecords.length === 0 ? <div className="text-sm text-muted-foreground">No issues</div> : null}
        </CardContent>
      </Card>
    </main>
  );
}
