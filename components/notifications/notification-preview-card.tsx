import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWidgetsByNotificationKey } from "@/lib/report-widgets";
import type { SupportedLocale } from "@/types/module";
import type { NotificationPreview } from "@/types/notification";

import { NotificationChip } from "./notification-chip";

export function NotificationPreviewCard({ preview, locale }: { preview: NotificationPreview; locale: SupportedLocale }) {
  const reportWidgets = getWidgetsByNotificationKey(preview.notificationKey);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? "Notification Preview" : "Notification Preview"}</CardTitle>
          <NotificationChip kind="status" locale={locale} status={preview.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={preview.canSend ? "default" : "outline"}>{preview.canSend ? (locale === "zh" ? "可发送（元数据）" : "Can Send (metadata)") : (locale === "zh" ? "不可发送" : "Cannot Send")}</Badge>
          <NotificationChip kind="severity" locale={locale} severity={preview.severity} />
          <NotificationChip kind="channel" locale={locale} channel={preview.channel} />
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        {preview.recipientLabel ? <div>{locale === "zh" ? "接收人" : "Recipient"}: {preview.recipientLabel}</div> : null}
        {preview.messageTitle ? <div>{locale === "zh" ? "标题" : "Message Title"}: {preview.messageTitle}</div> : null}
        <div>{locale === "zh" ? "人工复核" : "Human Review"}: {String(preview.humanReviewRequired)}</div>
        <div>{locale === "zh" ? "审计要求" : "Audit Required"}: {String(preview.auditRequired)}</div>
        {preview.permissionRequired ? <div>{locale === "zh" ? "权限" : "Permission"}: {preview.permissionRequired}</div> : null}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "说明：通知预览仅用于消息合同元数据。不会发送真实推送/邮件/WhatsApp/SMS/webhook，也不会触发队列、调度、后端或数据库写入。"
            : "Notice: notification preview is metadata-only. It does not send real push/email/WhatsApp/SMS/webhook or trigger queues, schedulers, backend jobs, or database writes."}
        </div>
        {reportWidgets.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "关联报表组件" : "Linked Report Widgets"}</div>
            {reportWidgets.map((widget) => <div key={widget.key}>{widget.key}</div>)}
            <div>{locale === "zh" ? "仅元数据映射，不执行报表查询。" : "Metadata mapping only; no report query execution."}</div>
          </div>
        ) : null}
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
