import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowChip } from "@/components/workflow/workflow-chip";
import { getWidgetsByWorkflowKey } from "@/lib/report-widgets";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowPreview } from "@/types/workflow";
import type { NotificationPreview } from "@/types/notification";

export function WorkflowPreviewCard({ preview, locale, notificationPreview }: { preview: WorkflowPreview; locale: SupportedLocale; notificationPreview?: NotificationPreview }) {
  const reportWidgets = getWidgetsByWorkflowKey(preview.workflowKey);

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? "Workflow Preview" : "Workflow Preview"}</CardTitle>
          <WorkflowChip kind="status" locale={locale} status={preview.status} />
        </div>
        <CardDescription className="text-xs">{preview.workflowKey}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={preview.canTrigger ? "default" : "outline"}>
            {preview.canTrigger ? (locale === "zh" ? "可触发（元数据）" : "Triggerable (metadata)") : (locale === "zh" ? "不可触发" : "Not Triggerable")}
          </Badge>
          <WorkflowChip kind="severity" locale={locale} severity={preview.severity} />
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        {preview.triggerLabel ? <div>{locale === "zh" ? "触发标签" : "Trigger Label"}: {preview.triggerLabel}</div> : null}
        {preview.targetLabel ? <div>{locale === "zh" ? "目标标签" : "Target Label"}: {preview.targetLabel}</div> : null}
        {notificationPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "通知预览" : "Notification Preview"}</div>
            <div>{notificationPreview.canSend ? (locale === "zh" ? "元数据层可发送" : "Sendable in metadata layer") : (locale === "zh" ? "元数据层不可发送" : "Not sendable in metadata layer")}</div>
            <div>{locale === "zh" ? "状态" : "Status"}: {notificationPreview.status}</div>
            <div>{locale === "zh" ? "通道" : "Channel"}: {notificationPreview.channel}</div>
            <div>{locale === "zh" ? "仅通知元数据预览，不执行真实发送。" : "Notification metadata preview only; no real sending is executed."}</div>
          </div>
        ) : null}
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "人工确认" : "Human Confirmation"}: {String(preview.humanConfirmationRequired)}</div>
          <div>{locale === "zh" ? "审计要求" : "Audit Required"}: {String(preview.auditRequired)}</div>
          {preview.permissionRequired ? <div>{locale === "zh" ? "权限" : "Permission"}: {preview.permissionRequired}</div> : null}
        </div>
        {reportWidgets.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "关联报表组件" : "Linked Report Widgets"}</div>
            {reportWidgets.map((widget) => <div key={widget.key}>{widget.key}</div>)}
            <div>{locale === "zh" ? "仅组件元数据预览，不执行真实报表。" : "Widget metadata preview only; no real report execution."}</div>
          </div>
        ) : null}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "说明：当前仅为工作流元数据预览，不执行真实自动化、队列、调度、通知、任务创建或审批引擎。"
            : "Notice: workflow metadata preview only. No real automation, queue, scheduler, notifications, task creation, or approval engine is executed."}
        </div>
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
