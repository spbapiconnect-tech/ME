import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveNotificationLabel } from "@/lib/notifications";
import type { SupportedLocale } from "@/types/module";
import type { NotificationContract } from "@/types/notification";

import { NotificationChip } from "./notification-chip";

export function NotificationRuleCard({ notification, locale }: { notification: NotificationContract; locale: SupportedLocale }) {
  const summaryRecipient = notification.recipient.label
    ? locale === "zh"
      ? notification.recipient.label.zh
      : notification.recipient.label.en
    : notification.recipient.role ?? notification.recipient.userId ?? notification.recipient.recipientType;

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">{resolveNotificationLabel(notification, locale)}</CardTitle>
          <NotificationChip kind="status" locale={locale} status={notification.status} />
        </div>
        <CardDescription className="text-xs">{notification.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <NotificationChip kind="channel" locale={locale} channel={notification.channel} />
          <NotificationChip kind="category" locale={locale} category={notification.category} />
          <NotificationChip kind="severity" locale={locale} severity={notification.severity} />
        </div>
        <div>{locale === "zh" ? "来源" : "Source"}: {notification.source.sourceModule} / {notification.source.sourcePage} / {notification.source.sourceEvent}</div>
        <div>{locale === "zh" ? "接收人" : "Recipient"}: {summaryRecipient}</div>
        <div>
          {locale === "zh" ? "关联键" : "Linked Keys"}: {notification.source.actionKey ?? "-"} / {notification.source.auditEventKey ?? "-"} / {notification.source.accessRuleKey ?? "-"} / {notification.source.workflowKey ?? "-"}
        </div>
        <div>
          {locale === "zh" ? "要求" : "Requirements"}: audit={String(notification.requirement.auditRequired)} / humanReview={String(notification.requirement.humanReviewRequired)}{notification.requirement.permissionRequired ? ` / permission=${notification.requirement.permissionRequired}` : ""}
        </div>
        {notification.isPlaceholder ? <div>{locale === "zh" ? "该通知为占位或预览用途，不进行真实发送。" : "This notification is placeholder/preview only and is not delivered for real."}</div> : null}
      </CardContent>
    </Card>
  );
}
