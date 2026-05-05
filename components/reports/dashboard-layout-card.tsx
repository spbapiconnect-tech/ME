import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { DashboardLayoutContract } from "@/types/report-widget";

import { ReportWidgetChip } from "./report-widget-chip";

export function DashboardLayoutCard({ layout, locale }: { layout: DashboardLayoutContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? layout.name.zh : layout.name.en}</CardTitle>
          <ReportWidgetChip kind="status" locale={locale} status={layout.status} />
        </div>
        <CardDescription className="text-xs">{layout.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? layout.description.zh : layout.description.en}</div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{locale === "zh" ? "布局模式" : "Layout Mode"}: {layout.layoutMode}</Badge>
          <Badge variant="secondary">{locale === "zh" ? "组件数量" : "Widgets"}: {layout.widgets.length}</Badge>
          {layout.targetRole ? <Badge variant="outline">{locale === "zh" ? "角色" : "Role"}: {layout.targetRole}</Badge> : null}
          {layout.targetPlan ? <Badge variant="outline">{locale === "zh" ? "套餐" : "Plan"}: {layout.targetPlan}</Badge> : null}
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{locale === "zh" ? "组件键" : "Widget Keys"}</div>
          <div className="flex flex-wrap gap-1.5">
            {layout.widgets.map((widgetKey) => (
              <Badge key={widgetKey} variant="outline" className="text-[11px]">
                {widgetKey}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
