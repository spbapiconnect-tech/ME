import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { RuleContract } from "@/types/rule";

export function RuleSourceCard({ rule, locale }: { rule: RuleContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "来源映射" : "Source Mapping"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5 text-xs text-muted-foreground">
        <div>{locale === "zh" ? "来源模块" : "Source Module"}: {rule.source.sourceModule}</div>
        {rule.source.sourcePage ? <div>{locale === "zh" ? "来源页面" : "Source Page"}: {rule.source.sourcePage}</div> : null}
        {rule.source.sourceRoute ? <div>{locale === "zh" ? "来源路由" : "Source Route"}: {rule.source.sourceRoute}</div> : null}
        {rule.source.sourceComponent ? <div>{locale === "zh" ? "来源组件" : "Source Component"}: {rule.source.sourceComponent}</div> : null}
        {rule.source.sourceService ? <div>{locale === "zh" ? "来源服务" : "Source Service"}: {rule.source.sourceService}</div> : null}
        {rule.source.sourceRepository ? <div>{locale === "zh" ? "来源仓库" : "Source Repository"}: {rule.source.sourceRepository}</div> : null}
        {rule.source.sourceDataset ? <div>{locale === "zh" ? "来源数据集" : "Source Dataset"}: {rule.source.sourceDataset}</div> : null}
        {rule.source.actionKey ? <div>ActionContract key: {rule.source.actionKey}</div> : null}
        {rule.source.accessRuleKey ? <div>AccessRule key: {rule.source.accessRuleKey}</div> : null}
        {rule.source.auditEventKey ? <div>AuditEventContract key: {rule.source.auditEventKey}</div> : null}
        {rule.source.workflowKey ? <div>WorkflowContract key: {rule.source.workflowKey}</div> : null}
        {rule.source.notificationKey ? <div>NotificationContract key: {rule.source.notificationKey}</div> : null}
        {rule.source.reportWidgetKey ? <div>ReportWidgetContract key: {rule.source.reportWidgetKey}</div> : null}
      </CardContent>
    </Card>
  );
}
