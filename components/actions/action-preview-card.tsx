import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getActionExecutionPreview, resolveActionDescription, resolveActionLabel } from "@/lib/actions"
import { getActionAccessPreview } from "@/lib/access"
import type { ActionContract } from "@/types/action-contract"
import type { SupportedLocale } from "@/types/module"

export interface ActionPreviewCardProps {
  action: ActionContract
  locale: SupportedLocale
}

function flagLabel(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function ActionPreviewCard({ action, locale }: ActionPreviewCardProps) {
  const preview = getActionExecutionPreview(action)
  const accessPreview = getActionAccessPreview(action)
  const label = resolveActionLabel(action, locale)
  const description = resolveActionDescription(action, locale)

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <span className="max-w-[24rem] truncate">{label}</span>
            {action.isPlaceholder ? (
              <Badge variant="outline">{flagLabel(locale, "占位", "Placeholder")}</Badge>
            ) : null}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{action.intent}</Badge>
            <Badge variant={action.status === "active" ? "default" : "outline"}>{action.status}</Badge>
            {action.requirement.auditRequired ? <Badge variant="outline">{flagLabel(locale, "需审计", "Audit")}</Badge> : null}
            {action.requirement.permissionRequired ? (
              <Badge variant="outline">{flagLabel(locale, "权限", "Permission")}</Badge>
            ) : null}
            {action.requirement.confirmationRequired ? (
              <Badge variant="outline">{flagLabel(locale, "需确认", "Confirm")}</Badge>
            ) : null}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <div className="truncate">{action.key}</div>
          {description ? <div className="mt-1 line-clamp-2">{description}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid gap-2 text-xs">
          <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{flagLabel(locale, "来源", "Source")}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
              <span>{action.source.sourceModule}</span>
              <span>{action.source.sourcePage}</span>
              <span>{action.source.sourceComponent}</span>
              <span>{action.source.sourceEvent}</span>
            </div>
          </div>
          <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
            <div className="font-medium text-foreground/80">{flagLabel(locale, "目标", "Target")}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
              {action.target.targetModule ? <span>{action.target.targetModule}</span> : null}
              {action.target.targetRoute ? <span>{action.target.targetRoute}</span> : null}
              <span>{action.target.targetAction}</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {preview.canExecute
            ? flagLabel(locale, "当前可执行（不做真实权限检查）", "Executable now (no real permission enforcement)")
            : flagLabel(locale, "当前不可执行（占位/禁用/即将上线）", "Not executable now (placeholder/disabled/coming soon)")}
        </div>
        <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground/80">{flagLabel(locale, "访问合同预览", "Access Contract Preview")}</div>
          <div>{accessPreview.canAccess ? flagLabel(locale, "访问预览为可访问", "Access preview is allowed") : flagLabel(locale, "访问预览为不可访问", "Access preview is not allowed")}</div>
          {accessPreview.requiredPermission ? <div>{flagLabel(locale, "权限", "Permission")}: {accessPreview.requiredPermission}</div> : null}
          {accessPreview.requiredRole ? <div>{flagLabel(locale, "角色", "Role")}: {accessPreview.requiredRole}</div> : null}
          {accessPreview.requiredPlan ? <div>{flagLabel(locale, "方案", "Plan")}: {accessPreview.requiredPlan}</div> : null}
          <div>{flagLabel(locale, "仅元数据展示，不做真实鉴权。", "Metadata display only; no real authorization enforcement.")}</div>
        </div>
      </CardContent>
    </Card>
  )
}
