import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportWidgetPreview, resolveReportWidgetDescription, resolveReportWidgetTitle } from "@/lib/report-widgets";
import type { SupportedLocale } from "@/types/module";
import type { ReportWidgetContract } from "@/types/report-widget";

import { ReportWidgetChip } from "./report-widget-chip";

export function ReportWidgetCard({ widget, locale }: { widget: ReportWidgetContract; locale: SupportedLocale }) {
  const preview = getReportWidgetPreview(widget);
  const title = resolveReportWidgetTitle(widget, locale);
  const description = resolveReportWidgetDescription(widget, locale);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          <ReportWidgetChip kind="status" locale={locale} status={widget.status} />
        </div>
        <CardDescription className="text-xs">{widget.key}</CardDescription>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <ReportWidgetChip kind="type" locale={locale} widgetType={widget.widgetType} />
          <ReportWidgetChip kind="severity" locale={locale} severity={widget.severity} />
          <ReportWidgetChip kind="size" locale={locale} size={widget.size} />
          <Badge variant="outline">{locale === "zh" ? "模块" : "Module"}: {widget.source.sourceModule}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/40 p-2">
            <div>{locale === "zh" ? "指标" : "Metrics"}</div>
            <div className="font-semibold text-foreground">{widget.metrics.length}</div>
          </div>
          <div className="rounded-xl bg-muted/40 p-2">
            <div>{locale === "zh" ? "筛选" : "Filters"}</div>
            <div className="font-semibold text-foreground">{widget.filters.length}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{locale === "zh" ? "可导出" : "Exportable"}: {String(widget.requirement.exportable)}</Badge>
          <Badge variant="outline">{locale === "zh" ? "可刷新" : "Refreshable"}: {String(widget.requirement.refreshable)}</Badge>
          <Badge variant="outline">{locale === "zh" ? "可下钻" : "Drill Down"}: {String(widget.requirement.drillDownEnabled)}</Badge>
        </div>
        {!preview.canRender ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-2">
            {locale === "zh" ? preview.reason.zh : preview.reason.en}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
