import * as React from "react"

import { AccessChip } from "@/components/access/access-chip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AccessPreview } from "@/types/access-control"
import type { AuditPreview } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"
import type { WorkflowPreview } from "@/types/workflow"
import { getWidgetsByAccessRuleKey } from "@/lib/report-widgets"
import { getPackagesByFeatureKey } from "@/lib/packages"
import { getRulesByAccessRuleKey } from "@/lib/rules"
import type { NotificationPreview } from "@/types/notification"

const copy = {
  zh: {
    title: "访问预览",
    canAccess: "可访问",
    cannotAccess: "不可访问",
    metadata: "仅元数据预览，不代表真实权限执行。",
  },
  en: {
    title: "Access Preview",
    canAccess: "Can Access",
    cannotAccess: "Cannot Access",
    metadata: "Metadata preview only, not real authorization behavior.",
  },
} as const

export function AccessPreviewCard({
  preview,
  locale,
  auditPreview,
  workflowPreview,
  notificationPreview,
}: {
  preview: AccessPreview
  locale: SupportedLocale
  auditPreview?: AuditPreview
  workflowPreview?: WorkflowPreview
  notificationPreview?: NotificationPreview
}) {
  const t = copy[locale]
  const reportWidgets = getWidgetsByAccessRuleKey(preview.ruleKey)
  const rules = getRulesByAccessRuleKey(preview.ruleKey)
  const packages = getPackagesByFeatureKey(preview.ruleKey)

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{t.title}</CardTitle>
          <AccessChip kind="status" locale={locale} status={preview.status} />
        </div>
        <CardDescription className="text-xs">{preview.ruleKey}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{preview.canAccess ? t.canAccess : t.cannotAccess}</div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        <div className="flex flex-wrap gap-1.5">
          {preview.requiredPermission ? <AccessChip kind="permission" locale={locale} permission={preview.requiredPermission} /> : null}
          {preview.requiredRole ? <AccessChip kind="role" locale={locale} role={preview.requiredRole} /> : null}
          {preview.requiredPlan ? <AccessChip kind="plan" locale={locale} plan={preview.requiredPlan} /> : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {preview.requiresAudit ? <AccessChip kind="permission" locale={locale} permission={locale === "zh" ? "需审计" : "Audit"} /> : null}
          {preview.requiresConfirmation ? <AccessChip kind="permission" locale={locale} permission={locale === "zh" ? "需确认" : "Confirm"} /> : null}
        </div>
        <div>{t.metadata}</div>
        {auditPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "审计预览" : "Audit Preview"}</div>
            <div>{auditPreview.shouldCapture ? (locale === "zh" ? "预览层标记为应捕获" : "Marked as should-capture in preview") : (locale === "zh" ? "预览层标记为不捕获" : "Marked as not-captured in preview")}</div>
            <div>{locale === "zh" ? "状态" : "Status"}: {auditPreview.status}</div>
            <div>{locale === "zh" ? "严重级别" : "Severity"}: {auditPreview.severity}</div>
            {auditPreview.accessRuleKey ? <div>{locale === "zh" ? "访问规则" : "Access Rule"}: {auditPreview.accessRuleKey}</div> : null}
            <div>{locale === "zh" ? "仅元数据预览，不做真实审计写入。" : "Metadata preview only; no real audit writes."}</div>
          </div>
        ) : null}
        {notificationPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "通知预览" : "Notification Preview"}</div>
            <div>{notificationPreview.canSend ? (locale === "zh" ? "元数据层可发送" : "Sendable in metadata layer") : (locale === "zh" ? "元数据层不可发送" : "Not sendable in metadata layer")}</div>
            <div>{locale === "zh" ? "状态" : "Status"}: {notificationPreview.status}</div>
            <div>{locale === "zh" ? "通道" : "Channel"}: {notificationPreview.channel}</div>
            <div>{locale === "zh" ? "仅通知合同预览，不执行真实发送。" : "Notification contract preview only; no real sending."}</div>
          </div>
        ) : null}
        {workflowPreview ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "Workflow 预览" : "Workflow Preview"}</div>
            <div>{workflowPreview.canTrigger ? (locale === "zh" ? "元数据层可触发" : "Triggerable in metadata layer") : (locale === "zh" ? "元数据层不可触发" : "Not triggerable in metadata layer")}</div>
            <div>{locale === "zh" ? "状态" : "Status"}: {workflowPreview.status}</div>
            <div>{locale === "zh" ? "严重级别" : "Severity"}: {workflowPreview.severity}</div>
            <div>{locale === "zh" ? "需人工确认" : "Human Confirmation"}: {String(workflowPreview.humanConfirmationRequired)}</div>
            <div>{locale === "zh" ? "仅预览，不执行自动化。" : "Preview only; no automation execution."}</div>
          </div>
        ) : null}
        {packages.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "方案预览" : "Package Preview"}</div>
            {packages.map((item) => <div key={item.key}>{item.key}</div>)}
            <div>{locale === "zh" ? "仅方案元数据映射，不执行方案门禁。" : "Package metadata mapping only; no plan guard is executed."}</div>
          </div>
        ) : null}
        {rules.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "规则预览" : "Rule Preview"}</div>
            {rules.map((rule) => <div key={rule.key}>{rule.key}</div>)}
            <div>{locale === "zh" ? "仅规则元数据映射，不执行规则计算。" : "Rule metadata mapping only; no rule calculation is executed."}</div>
          </div>
        ) : null}
        {reportWidgets.length > 0 ? (
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{locale === "zh" ? "关联报表组件" : "Linked Report Widgets"}</div>
            {reportWidgets.map((widget) => <div key={widget.key}>{widget.key}</div>)}
            <div>{locale === "zh" ? "仅元数据映射，不执行真实报表查询。" : "Metadata mapping only; no real report query."}</div>
          </div>
        ) : null}
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  )
}
