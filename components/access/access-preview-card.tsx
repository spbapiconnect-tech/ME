import * as React from "react"

import { AccessChip } from "@/components/access/access-chip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AccessPreview } from "@/types/access-control"
import type { AuditPreview } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

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

export function AccessPreviewCard({ preview, locale, auditPreview }: { preview: AccessPreview; locale: SupportedLocale; auditPreview?: AuditPreview }) {
  const t = copy[locale]

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
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  )
}
