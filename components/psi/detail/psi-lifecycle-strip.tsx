import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiIssueLifecycleStage } from "@/types/psi";

interface PsiLifecycleStripProps {
  stages: PsiIssueLifecycleStage[];
}

const toneClassMap: Record<string, string> = {
  neutral: "border-border",
  info: "border-sky-200",
  success: "border-emerald-200",
  warning: "border-amber-200",
  danger: "border-rose-200",
  muted: "border-muted",
};

export function PsiLifecycleStrip({ stages }: PsiLifecycleStripProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Lifecycle Placeholder</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-5">
        {stages.map((stage) => (
          <div
            key={stage.key}
            className={`rounded-lg border p-2 text-xs ${toneClassMap[stage.tone] ?? "border-border"} ${stage.isCurrent ? "bg-muted/30" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{stage.label.en}</span>
              {stage.isCurrent ? <Badge variant="secondary">Current</Badge> : null}
            </div>
            <div className="text-muted-foreground">{stage.description?.en ?? "Placeholder stage"}</div>
          </div>
        ))}
        {stages.length === 0 ? <div className="text-xs text-muted-foreground">No lifecycle stages</div> : null}
      </CardContent>
    </Card>
  );
}
