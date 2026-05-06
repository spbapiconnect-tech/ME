import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { ReportWidgetContract } from "@/types/report-widget";
import type { PsiReportWidgetData } from "@/types/psi";

interface PsiReportSourceCardProps {
  widget: PsiReportWidgetData;
  contract?: ReportWidgetContract;
  locale: SupportedLocale;
}

export function PsiReportSourceCard({ widget, contract, locale }: PsiReportSourceCardProps) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "PSI 来源映射" : "PSI Source Mapping"}</CardTitle>
        <CardDescription className="text-xs">{widget.widgetKey}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? "来源模块" : "Source Module"}: {widget.sourceModule}</div>
        <div>{locale === "zh" ? "来源服务占位" : "Source Service Placeholder"}: {contract?.source.sourceService ?? "service.psi.placeholder"}</div>
        <div>{locale === "zh" ? "来源仓储占位" : "Source Repository Placeholder"}: {contract?.source.sourceRepository ?? "repository.psi.placeholder"}</div>
        <div>{locale === "zh" ? "未来查询键" : "Future Query Key"}: {contract?.futureQueryKey ?? "query.psi.placeholder"}</div>
        <div>{locale === "zh" ? "未来报表构建键" : "Future Report Builder Key"}: {contract?.futureReportBuilderKey ?? "report-builder.psi.placeholder"}</div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "仅元数据映射预览，不执行 BI、SQL、数据库查询、API 调用、导出或调度。"
            : "Metadata mapping preview only; no BI, SQL, database query, API call, export, or scheduling is executed."}
        </div>
      </CardContent>
    </Card>
  );
}
