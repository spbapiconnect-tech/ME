import * as React from "react"

import { AccessChip } from "@/components/access/access-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resolveAccessDescription, resolveAccessLabel } from "@/lib/access"
import type { AccessRule } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

export interface AccessRuleCardProps {
  rule: AccessRule
  locale: SupportedLocale
}

const copy = {
  zh: {
    scope: "范围",
    module: "模块",
    page: "页面",
    action: "动作",
    permission: "权限",
    role: "角色",
    plan: "方案",
    flags: "标记",
    audit: "需审计",
    confirm: "需确认",
    placeholder: "占位规则",
  },
  en: {
    scope: "Scope",
    module: "Module",
    page: "Page",
    action: "Action",
    permission: "Permission",
    role: "Role",
    plan: "Plan",
    flags: "Flags",
    audit: "Audit",
    confirm: "Confirm",
    placeholder: "Placeholder Rule",
  },
} as const

export function AccessRuleCard({ rule, locale }: AccessRuleCardProps) {
  const t = copy[locale]
  const label = resolveAccessLabel(rule, locale)
  const description = resolveAccessDescription(rule, locale)

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">{label}</CardTitle>
          <AccessChip kind="status" locale={locale} status={rule.status} />
        </div>
        <div className="text-xs text-muted-foreground">{rule.key}</div>
        {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          <span>{t.scope}: {rule.scope}</span>
          {rule.targetModule ? <span>{t.module}: {rule.targetModule}</span> : null}
          {rule.targetPage ? <span>{t.page}: {rule.targetPage}</span> : null}
          {rule.targetAction ? <span>{t.action}: {rule.targetAction}</span> : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rule.condition.requiredPermission ? <AccessChip kind="permission" locale={locale} permission={`${t.permission}: ${rule.condition.requiredPermission}`} /> : null}
          {rule.condition.requiredRole ? <AccessChip kind="role" locale={locale} role={rule.condition.requiredRole} /> : null}
          {rule.condition.requiredPlan ? <AccessChip kind="plan" locale={locale} plan={rule.condition.requiredPlan} /> : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rule.condition.requiresAudit ? <AccessChip kind="permission" locale={locale} permission={t.audit} /> : null}
          {rule.condition.requiresConfirmation ? <AccessChip kind="permission" locale={locale} permission={t.confirm} /> : null}
          {rule.condition.isPlaceholder ? <AccessChip kind="permission" locale={locale} permission={t.placeholder} /> : null}
        </div>
      </CardContent>
    </Card>
  )
}
