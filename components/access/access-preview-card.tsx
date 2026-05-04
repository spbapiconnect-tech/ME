import * as React from "react"

import { AccessChip } from "@/components/access/access-chip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AccessPreview } from "@/types/access-control"
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

export function AccessPreviewCard({ preview, locale }: { preview: AccessPreview; locale: SupportedLocale }) {
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
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  )
}
