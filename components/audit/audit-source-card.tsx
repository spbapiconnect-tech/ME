import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditEventContract } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function AuditSourceCard({ event, locale }: { event: AuditEventContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{label(locale, "来源与目标映射", "Source And Target Mapping")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-xs text-muted-foreground">
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "来源", "Source")}</div>
          <div>{event.source.sourceModule}</div>
          <div>{event.source.sourcePage}</div>
          <div>{event.source.sourceComponent}</div>
          <div>{event.source.sourceEvent}</div>
          {event.source.sourceRoute ? <div>{event.source.sourceRoute}</div> : null}
          {event.source.sourceRecordId ? <div>record: {event.source.sourceRecordId}</div> : null}
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "目标", "Target")}</div>
          <div>{event.target.targetModule ?? "-"}</div>
          <div>{event.target.targetAction}</div>
          {event.target.targetPage ? <div>{event.target.targetPage}</div> : null}
          {event.target.targetRoute ? <div>{event.target.targetRoute}</div> : null}
          {event.target.targetComponent ? <div>{event.target.targetComponent}</div> : null}
          {event.target.targetRecordId ? <div>record: {event.target.targetRecordId}</div> : null}
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "参与者", "Actor")}</div>
          <div>{event.actor.actorType}</div>
          {event.actor.actorName ? <div>{event.actor.actorName}</div> : null}
          {event.actor.actorId ? <div>id: {event.actor.actorId}</div> : null}
          {event.actor.role ? <div>role: {event.actor.role}</div> : null}
          {event.actor.store ? <div>store: {event.actor.store}</div> : null}
        </div>
      </CardContent>
    </Card>
  )
}
