import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PsiDetailInsight } from "@/types/psi";

interface PsiInsightsCardProps {
  insights: PsiDetailInsight[];
}

const toneClassMap: Record<string, string> = {
  neutral: "bg-muted/20",
  info: "bg-sky-50",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  danger: "bg-rose-50",
  muted: "bg-muted/30",
};

export function PsiInsightsCard({ insights }: PsiInsightsCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">Operational Insights</CardTitle>
        <CardDescription>Insights are placeholder previews and not real calculations.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-2">
        {insights.map((insight) => (
          <div key={insight.key} className={`rounded-lg border p-3 text-xs ${toneClassMap[insight.tone] ?? "bg-muted/20"}`}>
            <div className="font-medium">{insight.label.en}</div>
            <div>{insight.value.en}</div>
            {insight.description ? <div className="text-muted-foreground">{insight.description.en}</div> : null}
          </div>
        ))}
        {insights.length === 0 ? <div className="text-xs text-muted-foreground">No insights</div> : null}
      </CardContent>
    </Card>
  );
}
