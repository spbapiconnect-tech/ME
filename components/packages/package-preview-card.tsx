import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPackagePreview } from "@/lib/packages";
import type { SupportedLocale } from "@/types/module";
import type { PackageContract } from "@/types/package";

import { PackageChip } from "./package-chip";

export function PackagePreviewCard({ pkg, locale }: { pkg: PackageContract; locale: SupportedLocale }) {
  const preview = getPackagePreview(pkg);

  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "方案预览" : "Package Preview"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={preview.canUse ? "default" : "outline"}>
            {preview.canUse ? (locale === "zh" ? "可用于预览" : "Preview Usable") : (locale === "zh" ? "不可使用" : "Not Usable")}
          </Badge>
          <PackageChip kind="status" locale={locale} status={preview.status} />
          <PackageChip kind="tier" locale={locale} tier={preview.tier} />
          <PackageChip kind="category" locale={locale} category={preview.category} />
        </div>
        <div>{locale === "zh" ? preview.reason.zh : preview.reason.en}</div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div>{locale === "zh" ? "模块数量" : "Module Count"}: {preview.moduleCount}</div>
          <div>{locale === "zh" ? "功能数量" : "Feature Count"}: {preview.featureCount}</div>
          <div>{locale === "zh" ? "限制数量" : "Limit Count"}: {preview.limitCount}</div>
          <div>{locale === "zh" ? "计费占位" : "Billing Placeholder"}: {preview.billingMode}</div>
        </div>
        <div>{locale === "zh" ? "未来计费引用" : "Future Billing Ref"}: {pkg.futureBillingKey ?? "-"}</div>
        <div>{locale === "zh" ? "未来订阅引用" : "Future Subscription Ref"}: {pkg.futureSubscriptionKey ?? "-"}</div>
        <div>{locale === "zh" ? "未来开通引用" : "Future Provisioning Ref"}: {pkg.futureProvisioningKey ?? "-"}</div>
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3">
          {locale === "zh"
            ? "说明：方案预览仅用于元数据，不执行真实计费、支付、订阅门禁、租户开通、模块启用、API 或后端逻辑。"
            : "Notice: package preview is metadata-only and does not execute real billing, payment, subscription enforcement, tenant provisioning, module runtime enablement, API, or backend logic."}
        </div>
        {preview.placeholderNotice ? <div>{locale === "zh" ? preview.placeholderNotice.zh : preview.placeholderNotice.en}</div> : null}
      </CardContent>
    </Card>
  );
}
