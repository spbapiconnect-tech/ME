import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { DisplayRecord } from "@/types/display-model";

interface WorkspacePageProps {
  title: string;
  subtitle: string;
  source: string;
  isMock: boolean;
  error?: string;
  stats: Array<{ label: string; value: string | number }>;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
  detailBasePath: string;
}

export function PsiWorkspacePage(props: WorkspacePageProps) {
  const { title, subtitle, source, isMock, error, stats, records, issueRecords, detailBasePath } = props;

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
        <CardHeader><CardTitle className="text-sm">Issue Preview</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          {issueRecords.map((record) => (
            <div key={record.id} className="rounded-lg border p-3 text-sm">
              <div className="font-medium">{record.title}</div>
              <div className="text-xs text-muted-foreground">{record.description}</div>
            </div>
          ))}
          {issueRecords.length === 0 ? <div className="text-sm text-muted-foreground">No issues</div> : null}
        </CardContent>
      </Card>
    </main>
  );
}
