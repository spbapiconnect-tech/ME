import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReportWidgetPreview } from "@/lib/report-widgets";
import { getRulesByReportWidgetKey } from "@/lib/rules";
import type { SupportedLocale } from "@/types/module";
import type { ReportWidgetContract } from "@/types/report-widget";

import { ReportWidgetChip } from "./report-widget-chip";

export function ReportWidgetPreviewCard({ widget, locale }: { widget: ReportWidgetContract; locale: SupportedLocale }) {
  const preview = getReportWidgetPreview(widget);
  const rules = getRulesByReportWidgetKey(widget.key);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? "组件预览" : "Widget Preview"}</CardTitle>
          <ReportWidgetChip kind="status" locale={locale} status={preview.status} />
        </div>
        <CardDescription className="text-xs">{preview.widgetKey}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={preview.canRender ? "default" : "outline"}>
            {preview.canRender
              ? locale === "zh"
                ? "可渲染（元数据）"
                : "Can Render (metadata)"
              : locale === "zh"
                ? "不可渲染"
                : "Cannot Render"}
          </Badge>
          <ReportWidgetChip kind="severity" locale={locale} severity={preview.severity} />
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        <div>{locale === "zh" ? "来源模块" : "Source Module"}: {preview.sourceModule}</div>
        <div className="grid grid-cols-2 gap-2">
          <div>{locale === "zh" ? "指标数" : "Metrics"}: {preview.metricCount}</div>
          <div>{locale === "zh" ? "筛选数" : "Filters"}: {preview.filterCount}</div>
          <div>{locale === "zh" ? "可导出" : "Exportable"}: {String(preview.exportable)}</div>
          <div>{locale === "zh" ? "可刷新" : "Refreshable"}: {String(preview.refreshable)}</div>
          <div>{locale === "zh" ? "可下钻" : "Drill Down"}: {String(preview.drillDownEnabled)}</div>
        </div>
        {rules.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "关联规则" : "Linked Rules"}</div>
            {rules.map((rule) => <div key={rule.key}>{rule.key}</div>)}
            <div>{locale === "zh" ? "仅规则元数据映射，不执行规则计算。" : "Rule metadata mapping only; no rule calculation is executed."}</div>
          </div>
        ) : null}
        {widget.sampleData ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "样例数据" : "Sample Data"}</div>
            <pre className="overflow-auto whitespace-pre-wrap text-[11px]">{JSON.stringify(widget.sampleData, null, 2)}</pre>
          </div>
        ) : null}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "说明：仅展示报表/看板组件元数据预览，不执行 BI 引擎、图表引擎、SQL、数据库查询、API 调用、导出或调度。"
            : "Notice: metadata-only report/dashboard widget preview. No BI engine, chart execution engine, SQL, database query, API call, export, or scheduling is executed."}
        </div>
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
