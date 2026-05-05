import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditPreview } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"
import type { WorkflowPreview } from "@/types/workflow"

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function AuditPreviewCard({ preview, locale, workflowPreview }: { preview: AuditPreview; locale: SupportedLocale; workflowPreview?: WorkflowPreview }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{label(locale, "审计预览", "Audit Preview")}</CardTitle>
        <CardDescription className="text-xs">{preview.eventKey}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={preview.shouldCapture ? "default" : "outline"}>
            {preview.shouldCapture ? label(locale, "应捕获", "Should Capture") : label(locale, "不捕获", "Do Not Capture")}
          </Badge>
          <Badge variant="outline">{preview.status}</Badge>
          <Badge variant="outline">{preview.severity}</Badge>
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        {preview.actorLabel ? <div>{label(locale, "参与者", "Actor")}: {preview.actorLabel}</div> : null}
        {preview.sourceLabel ? <div>{label(locale, "来源", "Source")}: {preview.sourceLabel}</div> : null}
        {preview.targetLabel ? <div>{label(locale, "目标", "Target")}: {preview.targetLabel}</div> : null}
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{label(locale, "审计必需", "Audit Required")}: {String(preview.auditRequired)}</div>
          {preview.permissionRequired ? <div>{label(locale, "权限", "Permission")}: {preview.permissionRequired}</div> : null}
          {preview.accessRuleKey ? <div>{label(locale, "访问规则", "Access Rule")}: {preview.accessRuleKey}</div> : null}
        </div>
        {workflowPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "Workflow 预览", "Workflow Preview")}</div>
            <div>{workflowPreview.canTrigger ? label(locale, "元数据层可触发", "Triggerable in metadata layer") : label(locale, "元数据层不可触发", "Not triggerable in metadata layer")}</div>
            <div>{label(locale, "状态", "Status")}: {workflowPreview.status}</div>
            <div>{label(locale, "严重级别", "Severity")}: {workflowPreview.severity}</div>
            <div>{label(locale, "仅预览，不执行真实自动化。", "Preview only; no real automation is executed.")}</div>
          </div>
        ) : null}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {label(
            locale,
            "说明：当前仅展示审计元数据预览，不包含真实日志写入、后端服务、数据库或事件队列。",
            "Notice: metadata preview only. No real log writes, backend service, database, or event queue is implemented.",
          )}
        </div>
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  )
}
