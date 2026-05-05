import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { ReportWidgetContract } from "@/types/report-widget";

export function ReportWidgetSourceCard({ widget, locale }: { widget: ReportWidgetContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "来源映射" : "Source Mapping"}</CardTitle>
        <CardDescription className="text-xs">{widget.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? "来源模块" : "Source Module"}: {widget.source.sourceModule}</div>
        {widget.source.sourcePage ? <div>{locale === "zh" ? "来源页面" : "Source Page"}: {widget.source.sourcePage}</div> : null}
        {widget.source.sourceRoute ? <div>{locale === "zh" ? "来源路由" : "Source Route"}: {widget.source.sourceRoute}</div> : null}
        {widget.source.sourceComponent ? <div>{locale === "zh" ? "来源组件" : "Source Component"}: {widget.source.sourceComponent}</div> : null}
        {widget.source.sourceService ? <div>{locale === "zh" ? "来源服务" : "Source Service"}: {widget.source.sourceService}</div> : null}
        {widget.source.sourceRepository ? <div>{locale === "zh" ? "来源仓储" : "Source Repository"}: {widget.source.sourceRepository}</div> : null}
        {widget.source.sourceDataset ? <div>{locale === "zh" ? "来源数据集" : "Source Dataset"}: {widget.source.sourceDataset}</div> : null}
        {widget.source.dataSourceType ? <div>{locale === "zh" ? "数据源类型" : "Data Source Type"}: {widget.source.dataSourceType}</div> : null}
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{locale === "zh" ? "关联合同键" : "Linked Contract Keys"}</div>
          {widget.source.actionKey ? <div>ActionContract: {widget.source.actionKey}</div> : null}
          {widget.source.accessRuleKey ? <div>AccessRule: {widget.source.accessRuleKey}</div> : null}
          {widget.source.auditEventKey ? <div>AuditEventContract: {widget.source.auditEventKey}</div> : null}
          {widget.source.workflowKey ? <div>WorkflowContract: {widget.source.workflowKey}</div> : null}
          {widget.source.notificationKey ? <div>NotificationContract: {widget.source.notificationKey}</div> : null}
          {!widget.source.actionKey &&
          !widget.source.accessRuleKey &&
          !widget.source.auditEventKey &&
          !widget.source.workflowKey &&
          !widget.source.notificationKey ? (
            <div>{locale === "zh" ? "未设置关联合同键。" : "No linked contract keys are defined."}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
