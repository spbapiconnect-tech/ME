import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowChip } from "@/components/workflow/workflow-chip";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowTargetCatalogItem } from "@/types/workflow";

export function WorkflowTargetCard({ target, locale }: { target: WorkflowTargetCatalogItem; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? target.name.zh : target.name.en}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <WorkflowChip kind="target" locale={locale} targetType={target.targetType} />
            <WorkflowChip kind="status" locale={locale} status={target.status} />
          </div>
        </div>
        <CardDescription className="text-xs">{target.code}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        <div>{locale === "zh" ? target.description.zh : target.description.en}</div>
        {target.targetModule ? <div className="mt-1">{locale === "zh" ? "目标模块" : "Target Module"}: {target.targetModule}</div> : null}
      </CardContent>
    </Card>
  );
}
