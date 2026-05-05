import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getWidgetsByAuditEventKey } from "@/lib/report-widgets"
import { getPackagesByFeatureKey } from "@/lib/packages"
import { getRulesByAuditEventKey } from "@/lib/rules"
import type { AuditPreview } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"
import type { WorkflowPreview } from "@/types/workflow"
import type { NotificationPreview } from "@/types/notification"

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function AuditPreviewCard({ preview, locale, workflowPreview, notificationPreview }: { preview: AuditPreview; locale: SupportedLocale; workflowPreview?: WorkflowPreview; notificationPreview?: NotificationPreview }) {
  const reportWidgets = getWidgetsByAuditEventKey(preview.eventKey)
  const rules = getRulesByAuditEventKey(preview.eventKey)
  const packages = getPackagesByFeatureKey(preview.eventKey)

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
        {notificationPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "通知预览", "Notification Preview")}</div>
            <div>{notificationPreview.canSend ? label(locale, "元数据层可发送", "Sendable in metadata layer") : label(locale, "元数据层不可发送", "Not sendable in metadata layer")}</div>
            <div>{label(locale, "状态", "Status")}: {notificationPreview.status}</div>
            <div>{label(locale, "通道", "Channel")}: {notificationPreview.channel}</div>
            <div>{label(locale, "仅预览，不执行真实发送。", "Preview only; no real sending is executed.")}</div>
          </div>
        ) : null}
        {workflowPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "Workflow 预览", "Workflow Preview")}</div>
            <div>{workflowPreview.canTrigger ? label(locale, "元数据层可触发", "Triggerable in metadata layer") : label(locale, "元数据层不可触发", "Not triggerable in metadata layer")}</div>
            <div>{label(locale, "状态", "Status")}: {workflowPreview.status}</div>
            <div>{label(locale, "严重级别", "Severity")}: {workflowPreview.severity}</div>
            <div>{label(locale, "仅预览，不执行真实自动化。", "Preview only; no real automation is executed.")}</div>
          </div>
        ) : null}
        {packages.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "方案预览", "Package Preview")}</div>
            {packages.map((item) => <div key={item.key}>{item.key}</div>)}
            <div>{label(locale, "仅方案元数据映射，不执行订阅门禁。", "Package metadata mapping only; no subscription guard is executed.")}</div>
          </div>
        ) : null}
        {rules.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "规则预览", "Rule Preview")}</div>
            {rules.map((rule) => <div key={rule.key}>{rule.key}</div>)}
            <div>{label(locale, "仅规则元数据映射，不执行规则计算。", "Rule metadata mapping only; no rule calculation is executed.")}</div>
          </div>
        ) : null}
        {reportWidgets.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{label(locale, "关联报表组件", "Linked Report Widgets")}</div>
            {reportWidgets.map((widget) => <div key={widget.key}>{widget.key}</div>)}
            <div>{label(locale, "仅元数据映射，不执行真实报表。", "Metadata mapping only; no real report execution.")}</div>
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
