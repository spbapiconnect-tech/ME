import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PsiDetailPageProps {
  title: string;
  source: string;
  isMock: boolean;
  error?: string;
  rows: Array<{ key: string; value: string }>;
  backHref: string;
}

export function PsiDetailPage({ title, source, isMock, error, rows, backHref }: PsiDetailPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Source: {source} · {isMock ? "Mock" : "Unknown"}
          </CardDescription>
          {error ? <CardDescription className="text-destructive">{error}</CardDescription> : null}
        </CardHeader>
        <CardContent className="grid gap-2">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-lg border p-2 text-sm">
              <span className="text-muted-foreground">{row.key}</span>
              <span>{row.value}</span>
            </div>
          ))}
          {rows.length === 0 ? <div className="text-sm text-muted-foreground">No detail available</div> : null}
        </CardContent>
      </Card>

      <Link href={backHref} className="text-sm text-primary hover:underline">Back to workspace</Link>
    </main>
  );
}
