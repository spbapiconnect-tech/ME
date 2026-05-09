import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolvePackageDescription, resolvePackageName } from "@/lib/packages";
import type { SupportedLocale } from "@/types/module";
import type { PackageContract } from "@/types/package";

import { PackageChip } from "./package-chip";

export function PackageCard({ pkg, locale }: { pkg: PackageContract; locale: SupportedLocale }) {
  const name = resolvePackageName(pkg, locale);
  const description = resolvePackageDescription(pkg, locale);

  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{name}</CardTitle>
        <CardDescription className="text-xs">{pkg.key}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        {description ? <div>{description}</div> : null}
        <div className="flex flex-wrap gap-1.5">
          <PackageChip kind="tier" locale={locale} tier={pkg.tier} />
          <PackageChip kind="category" locale={locale} category={pkg.category} />
          <PackageChip kind="status" locale={locale} status={pkg.status} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>{locale === "zh" ? "模块" : "Modules"}: {pkg.modules.length}</div>
          <div>{locale === "zh" ? "功能" : "Features"}: {pkg.features.length}</div>
          <div>{locale === "zh" ? "限制" : "Limits"}: {pkg.limits.length}</div>
        </div>
        <div>{locale === "zh" ? "计费占位" : "Billing Placeholder"}: {pkg.billingMode}</div>
        <div>{locale === "zh" ? "推荐角色" : "Recommended Roles"}: {pkg.recommendedRoles.join(", ") || "-"}</div>
        <div>{locale === "zh" ? "推荐皮肤" : "Recommended Skins"}: {pkg.recommendedSkins.join(", ") || "-"}</div>
        <div>{locale === "zh" ? "推荐看板" : "Recommended Dashboards"}: {pkg.recommendedDashboards.join(", ") || "-"}</div>
        {pkg.requirement.isPlaceholder ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
            {locale === "zh"
              ? "该方案仅用于元数据预览，不代表真实订阅或模块开通行为。"
              : "This package is metadata-only and does not represent real subscription or module provisioning behavior."}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
