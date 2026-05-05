import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { PackageGroupContract } from "@/types/package";

import { PackageChip } from "./package-chip";

export function PackageGroupCard({ group, locale }: { group: PackageGroupContract; locale: SupportedLocale }) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? group.name.zh : group.name.en}</CardTitle>
        <CardDescription className="text-xs">{group.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? group.description.zh : group.description.en}</div>
        <div className="flex flex-wrap gap-1.5">
          <PackageChip kind="status" locale={locale} status={group.status} />
          <span className="rounded-md bg-muted px-2 py-1">{group.category}</span>
        </div>
        <div>{locale === "zh" ? "方案数量" : "Package Count"}: {group.packages.length}</div>
        <div className="rounded-xl bg-muted/40 p-3">
          {group.packages.map((packageKey) => <div key={packageKey}>{packageKey}</div>)}
        </div>
      </CardContent>
    </Card>
  );
}
