import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RoleRegistryItem } from "@/types/access-control"
import type { SupportedLocale } from "@/types/module"

export function RoleCard({ role, locale }: { role: RoleRegistryItem; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? role.name.zh : role.name.en}</CardTitle>
        <CardDescription className="text-xs">{role.code}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? role.description.zh : role.description.en}</div>
        <div>{locale === "zh" ? "类别" : "Category"}: {role.category}</div>
        {role.defaultLanding ? <div>{locale === "zh" ? "默认入口" : "Default Landing"}: {role.defaultLanding}</div> : null}
      </CardContent>
    </Card>
  )
}
