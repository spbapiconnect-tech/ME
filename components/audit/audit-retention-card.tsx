import * as React from "react"

import { AuditChip } from "@/components/audit/audit-chip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuditRetentionProfile } from "@/types/audit"
import type { SupportedLocale } from "@/types/module"

function label(locale: SupportedLocale, zh: string, en: string) {
  return locale === "zh" ? zh : en
}

export function AuditRetentionCard({ profile, locale }: { profile: AuditRetentionProfile; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? profile.name.zh : profile.name.en}</CardTitle>
          <AuditChip kind="retention" retention={profile} locale={locale} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? profile.description.zh : profile.description.en}</div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{label(locale, "保留天数", "Retention Days")}: {profile.retentionDays}</Badge>
          <Badge variant={profile.exportable ? "secondary" : "outline"}>
            {profile.exportable ? label(locale, "可导出", "Exportable") : label(locale, "不可导出", "Not Exportable")}
          </Badge>
          <Badge variant="outline">pii: {profile.piiRisk}</Badge>
          <Badge variant="outline">{profile.status}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
