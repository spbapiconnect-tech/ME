import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { NotificationContract } from "@/types/notification";

import { NotificationChip } from "./notification-chip";

export function NotificationSourceCard({ notification, locale }: { notification: NotificationContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "Notification Source" : "Notification Source"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{notification.source.sourceModule} / {notification.source.sourcePage} / {notification.source.sourceComponent}</div>
        <div>{locale === "zh" ? "事件" : "Event"}: {notification.source.sourceEvent}</div>
        {notification.source.sourceRoute ? <div>{locale === "zh" ? "路由" : "Route"}: {notification.source.sourceRoute}</div> : null}
        <div className="flex flex-wrap gap-1.5">
          <NotificationChip kind="channel" locale={locale} channel={notification.channel} />
          <NotificationChip kind="category" locale={locale} category={notification.category} />
        </div>
        <div>{locale === "zh" ? "动作键" : "Action Key"}: {notification.source.actionKey ?? "-"}</div>
        <div>{locale === "zh" ? "访问规则键" : "Access Rule Key"}: {notification.source.accessRuleKey ?? "-"}</div>
        <div>{locale === "zh" ? "审计键" : "Audit Event Key"}: {notification.source.auditEventKey ?? "-"}</div>
        <div>{locale === "zh" ? "工作流键" : "Workflow Key"}: {notification.source.workflowKey ?? "-"}</div>
      </CardContent>
    </Card>
  );
}
