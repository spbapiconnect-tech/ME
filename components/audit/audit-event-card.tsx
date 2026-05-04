import * as React from "react"

import { AuditChip } from "@/components/audit/audit-chip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resolveAuditDescription, resolveAuditLabel } from "@/lib/audit"
import type { AuditEventContract } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

export interface AuditEventCardProps {
  event: AuditEventContract
  locale: SupportedLocale
}

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function AuditEventCard({ event, locale }: AuditEventCardProps) {
  const title = resolveAuditLabel(event, locale)
  const description = resolveAuditDescription(event, locale)

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <AuditChip kind="eventType" eventType={event.eventType} locale={locale} />
            <AuditChip kind="status" status={event.status} locale={locale} />
            <AuditChip kind="severity" severity={event.severity} locale={locale} />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <div>{event.key}</div>
          {description ? <div className="mt-1 line-clamp-2">{description}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "参与者 / 来源 / 目标", "Actor / Source / Target")}</div>
          <div>{label(locale, "参与者", "Actor")}: {event.actor.actorName ?? event.actor.role ?? event.actor.actorType}</div>
          <div>
            {label(locale, "来源", "Source")}: {event.source.sourceModule} / {event.source.sourcePage} / {event.source.sourceComponent}
          </div>
          <div>
            {label(locale, "目标", "Target")}: {event.target.targetModule ?? "-"} / {event.target.targetAction}
          </div>
        </div>
        <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "审计要求", "Audit Requirements")}</div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={event.requirement.auditRequired ? "default" : "outline"}>
              {event.requirement.auditRequired ? label(locale, "需审计", "Audit Required") : label(locale, "非必需", "Not Required")}
            </Badge>
            {event.requirement.permissionRequired ? <Badge variant="outline">{event.requirement.permissionRequired}</Badge> : null}
            {event.requirement.accessRuleKey ? <Badge variant="outline">{event.requirement.accessRuleKey}</Badge> : null}
            {event.requirement.actionKey ? <Badge variant="outline">{event.requirement.actionKey}</Badge> : null}
            {event.requirement.confirmationRequired ? <Badge variant="secondary">{label(locale, "需确认", "Confirm")}</Badge> : null}
          </div>
        </div>
        {event.isPlaceholder ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
            {label(locale, "占位事件：当前仅提供合同预览，不执行真实审计写入。", "Placeholder event: contract preview only, no real audit writes are executed.")}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
