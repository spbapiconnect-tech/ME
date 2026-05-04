import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActionContract } from "@/types/action-contract"
import type { SupportedLocale } from "@/types/module"

export interface ActionSourceCardProps {
  action: ActionContract
  locale: SupportedLocale
}

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function ActionSourceCard({ action, locale }: ActionSourceCardProps) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{label(locale, "Source Mapping", "Source Mapping")}</span>
          <Badge variant="secondary">{action.key}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-xs">
        <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "来源", "Source")}</div>
          <div className="grid gap-1 text-muted-foreground">
            <div>
              <span className="text-foreground/70">module</span>: {action.source.sourceModule}
            </div>
            <div>
              <span className="text-foreground/70">page</span>: {action.source.sourcePage}
            </div>
            <div>
              <span className="text-foreground/70">component</span>: {action.source.sourceComponent}
            </div>
            <div>
              <span className="text-foreground/70">event</span>: {action.source.sourceEvent}
            </div>
            {action.source.sourceRecordId ? (
              <div>
                <span className="text-foreground/70">recordId</span>: {action.source.sourceRecordId}
              </div>
            ) : null}
            {action.source.sourceRoute ? (
              <div>
                <span className="text-foreground/70">route</span>: {action.source.sourceRoute}
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid gap-1 rounded-xl bg-muted/40 p-3">
          <div className="font-medium text-foreground/80">{label(locale, "目标", "Target")}</div>
          <div className="grid gap-1 text-muted-foreground">
            {action.target.targetModule ? (
              <div>
                <span className="text-foreground/70">module</span>: {action.target.targetModule}
              </div>
            ) : null}
            {action.target.targetPage ? (
              <div>
                <span className="text-foreground/70">page</span>: {action.target.targetPage}
              </div>
            ) : null}
            {action.target.targetComponent ? (
              <div>
                <span className="text-foreground/70">component</span>: {action.target.targetComponent}
              </div>
            ) : null}
            {action.target.targetRoute ? (
              <div>
                <span className="text-foreground/70">route</span>: {action.target.targetRoute}
              </div>
            ) : null}
            <div>
              <span className="text-foreground/70">action</span>: {action.target.targetAction}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {action.requirement.permissionRequired ? <Badge variant="outline">permissionRequired</Badge> : null}
          {action.requirement.auditRequired ? <Badge variant="outline">auditRequired</Badge> : null}
          {action.requirement.confirmationRequired ? <Badge variant="outline">confirmationRequired</Badge> : null}
          {action.futureWorkflowKey ? <Badge variant="outline">futureWorkflowKey</Badge> : null}
          {action.analyticsKey ? <Badge variant="outline">analyticsKey</Badge> : null}
        </div>
      </CardContent>
    </Card>
  )
}
