import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiDetailPanelData } from "@/types/psi";

import { PsiDetailNotice } from "./psi-detail-notice";
import { PsiInsightsCard } from "./psi-insights-card";
import { PsiLifecycleStrip } from "./psi-lifecycle-strip";
import { PsiLinkedRecordsCard } from "./psi-linked-records-card";
import { PsiRelatedActionsCard } from "./psi-related-actions-card";
import { PsiRelatedTasksCard } from "./psi-related-tasks-card";
import { PsiTimeline } from "./psi-timeline";

interface PsiDetailLayoutV072Props {
  title: string;
  source: string;
  isMock: boolean;
  error?: string;
  rows: Array<{ key: string; value: string }>;
  backHref: string;
  detailPanelData?: PsiDetailPanelData | null;
  relatedActions?: Array<{ label: string; actionKey: string }>;
}

export function PsiDetailLayoutV072({
  title,
  source,
  isMock,
  error,
  rows,
  backHref,
  detailPanelData = null,
  relatedActions = [],
}: PsiDetailLayoutV072Props) {
  const summaryTitle = detailPanelData?.title.en ?? title;
  const summarySubtitle = detailPanelData?.subtitle?.en;
  const relatedActionKeys = detailPanelData?.relatedActionDraftKeys ?? relatedActions.map((item) => item.actionKey);
  const panel = detailPanelData;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{summaryTitle}</CardTitle>
          {summarySubtitle ? <CardDescription>{summarySubtitle}</CardDescription> : null}
          <CardDescription>
            Source: {source} · {isMock ? "Mock" : "Unknown"}
          </CardDescription>
          <CardDescription>Summary header placeholder only. No real status transition or persistence is performed.</CardDescription>
          {error ? <CardDescription className="text-destructive">{error}</CardDescription> : null}
        </CardHeader>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Key Fields</CardTitle>
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

      {panel ? <PsiLifecycleStrip stages={panel.lifecycle} /> : null}
      {panel ? <PsiTimeline events={panel.timeline} /> : null}
      {panel ? <PsiLinkedRecordsCard records={panel.linkedRecords} /> : null}
      {panel ? <PsiInsightsCard insights={panel.insights} /> : null}
      <PsiRelatedActionsCard actionKeys={relatedActionKeys} />
      {panel ? <PsiRelatedTasksCard tasks={panel.relatedTaskPlaceholders} /> : null}
      <PsiDetailNotice notice={panel?.notice} />

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Source / Mock Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <div>Current detail page is read-only placeholder content.</div>
          <div>No database/API write, status change, timeline persistence, or task creation is executed.</div>
          <div>
            Source path: {source} · {isMock ? "mock repository" : "unknown"}
          </div>
          <Link href="/psi/actions" className="text-primary hover:underline">
            Open PSI Actions
          </Link>
          <Link href="/reports" className="text-primary hover:underline">
            Open PSI Report Preview
          </Link>
        </CardContent>
      </Card>

      <Link href={backHref} className="text-sm text-primary hover:underline">
        Back to workspace
      </Link>
    </main>
  );
}
