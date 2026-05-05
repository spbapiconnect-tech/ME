import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowChip } from "@/components/workflow/workflow-chip";
import type { SupportedLocale } from "@/types/module";
import type { WorkflowPreview } from "@/types/workflow";

export function WorkflowPreviewCard({ preview, locale }: { preview: WorkflowPreview; locale: SupportedLocale }) {
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
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "人工确认" : "Human Confirmation"}: {String(preview.humanConfirmationRequired)}</div>
          <div>{locale === "zh" ? "审计要求" : "Audit Required"}: {String(preview.auditRequired)}</div>
          {preview.permissionRequired ? <div>{locale === "zh" ? "权限" : "Permission"}: {preview.permissionRequired}</div> : null}
        </div>
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
