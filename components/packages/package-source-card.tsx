import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportedLocale } from "@/types/module";
import type { PackageContract } from "@/types/package";

export function PackageSourceCard({ pkg, locale }: { pkg: PackageContract; locale: SupportedLocale }) {
  const grouped = pkg.features.reduce<Record<string, string[]>>((acc, feature) => {
    acc[feature.featureType] = [...(acc[feature.featureType] ?? []), feature.key];
    return acc;
  }, {});

  return (
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1">
        <CardTitle className="text-sm">{locale === "zh" ? "方案来源映射" : "Package Source Mapping"}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs text-muted-foreground">
        <div>{locale === "zh" ? "模块" : "Modules"}: {pkg.modules.join(", ") || "-"}</div>
        <div className="rounded-xl bg-muted/40 p-3">
          {Object.entries(grouped).map(([featureType, keys]) => (
            <div key={featureType} className="mb-1">
              <div className="font-medium text-foreground/80">{featureType}</div>
              {keys.map((key) => <div key={key}>{key}</div>)}
            </div>
          ))}
        </div>
        {pkg.linkedRoute ? <div>{locale === "zh" ? "关联路由" : "Linked Route"}: {pkg.linkedRoute}</div> : null}
        <div>{locale === "zh" ? "未来计费引用" : "Future Billing Ref"}: {pkg.futureBillingKey ?? "-"}</div>
        <div>{locale === "zh" ? "未来订阅引用" : "Future Subscription Ref"}: {pkg.futureSubscriptionKey ?? "-"}</div>
        <div>{locale === "zh" ? "未来开通引用" : "Future Provisioning Ref"}: {pkg.futureProvisioningKey ?? "-"}</div>
      </CardContent>
    </Card>
  );
}
