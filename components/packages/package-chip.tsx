import { Badge } from "@/components/ui/badge";
import type { SupportedLocale } from "@/types/module";
import type { PackageCategory, PackageStatus, PackageTier } from "@/types/package";

const statusLabel: Record<PackageStatus, { zh: string; en: string }> = {
  active: { zh: "启用", en: "Active" },
  "preview-only": { zh: "仅预览", en: "Preview-Only" },
  placeholder: { zh: "占位", en: "Placeholder" },
  "coming-soon": { zh: "即将上线", en: "Coming Soon" },
  blocked: { zh: "阻止", en: "Blocked" },
  disabled: { zh: "禁用", en: "Disabled" },
};

const tierLabel: Record<PackageTier, { zh: string; en: string }> = {
  starter: { zh: "入门", en: "Starter" },
  ops: { zh: "运营", en: "Ops" },
  pro: { zh: "专业", en: "Pro" },
  enterprise: { zh: "企业", en: "Enterprise" },
  custom: { zh: "自定义", en: "Custom" },
};

const categoryLabel: Record<PackageCategory, { zh: string; en: string }> = {
  "base-plan": { zh: "基础方案", en: "Base Plan" },
  "module-pack": { zh: "模块包", en: "Module Pack" },
  "role-pack": { zh: "角色包", en: "Role Pack" },
  "industry-pack": { zh: "行业包", en: "Industry Pack" },
  "add-on": { zh: "附加包", en: "Add-on" },
  enterprise: { zh: "企业包", en: "Enterprise" },
  system: { zh: "系统", en: "System" },
};

function statusTone(status: PackageStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700";
    case "preview-only":
      return "border-sky-500/40 bg-sky-500/10 text-sky-700";
    case "placeholder":
      return "border-amber-500/40 bg-amber-500/10 text-amber-700";
    case "coming-soon":
      return "border-violet-500/40 bg-violet-500/10 text-violet-700";
    case "blocked":
      return "border-rose-500/40 bg-rose-500/10 text-rose-700";
    case "disabled":
    default:
      return "border-muted-foreground/40 bg-muted/50 text-muted-foreground";
  }
}

export function PackageChip({
  kind,
  locale,
  status,
  tier,
  category,
}: {
  kind: "status" | "tier" | "category";
  locale: SupportedLocale;
  status?: PackageStatus;
  tier?: PackageTier;
  category?: PackageCategory;
}) {
  if (kind === "status" && status) {
    const label = statusLabel[status];
    return (
      <Badge variant="outline" className={`text-[11px] ${statusTone(status)}`}>
        {locale === "zh" ? label.zh : label.en}
      </Badge>
    );
  }

  if (kind === "tier" && tier) {
    const label = tierLabel[tier];
    return <Badge variant="secondary">{locale === "zh" ? label.zh : label.en}</Badge>;
  }

  if (kind === "category" && category) {
    const label = categoryLabel[category];
    return <Badge variant="outline">{locale === "zh" ? label.zh : label.en}</Badge>;
  }

  return null;
}
