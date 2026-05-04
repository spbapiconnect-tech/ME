import * as React from "react"

import { AccessChip } from "@/components/access/access-chip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlanRegistryItem } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

export function PlanCard({ plan, locale }: { plan: PlanRegistryItem; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{locale === "zh" ? plan.name.zh : plan.name.en}</CardTitle>
          <AccessChip kind="permission" locale={locale} permission={plan.status} />
        </div>
        <CardDescription className="text-xs">{plan.code}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? plan.description.zh : plan.description.en}</div>
        <div>{locale === "zh" ? "目标客户" : "Target"}: {locale === "zh" ? plan.targetCustomer.zh : plan.targetCustomer.en}</div>
        <div>{locale === "zh" ? "推荐模块" : "Recommended"}: {plan.recommendedModules.join(", ")}</div>
      </CardContent>
    </Card>
  )
}
