import { packageContracts, packageContractsByKey, packageGroups, packageGroupsByKey } from "@/config/packages";
import type {
  PackageCategory,
  PackageContract,
  PackageFeatureType,
  PackageGroupCategory,
  PackageGroupContract,
  PackagePreview,
  PackageStatus,
  PackageTier,
} from "@/types/package";
import type { SupportedLocale } from "@/types/module";

function text(zh: string, en: string) {
  return { zh, en };
}

function shouldUseInMetadata(pkg: PackageContract) {
  if (["placeholder", "coming-soon", "blocked", "disabled"].includes(pkg.status)) {
    return false;
  }
  if (pkg.status === "preview-only") {
    return pkg.samplePreviewEnabled === true;
  }
  return pkg.status === "active";
}

export function getPackageByKey(packageKey: string): PackageContract | undefined {
  return packageContractsByKey[packageKey];
}

export function getPackagesByCategory(category: PackageCategory): PackageContract[] {
  return packageContracts.filter((item) => item.category === category);
}

export function getPackagesByTier(tier: PackageTier): PackageContract[] {
  return packageContracts.filter((item) => item.tier === tier);
}

export function getPackagesByStatus(status: PackageStatus): PackageContract[] {
  return packageContracts.filter((item) => item.status === status);
}

export function getPackagesByModule(moduleCode: string): PackageContract[] {
  return packageContracts.filter((item) => item.modules.includes(moduleCode));
}

export function getPackagesByFeatureType(featureType: PackageFeatureType): PackageContract[] {
  return packageContracts.filter((item) => item.features.some((feature) => feature.featureType === featureType));
}

export function getPackagesByFeatureKey(featureKey: string): PackageContract[] {
  return packageContracts.filter((item) => item.features.some((feature) => feature.key === featureKey));
}

export function getActivePackages(): PackageContract[] {
  return packageContracts.filter((item) => item.status === "active");
}

export function getPlaceholderPackages(): PackageContract[] {
  return packageContracts.filter((item) => item.requirement.isPlaceholder || ["placeholder", "coming-soon", "blocked", "disabled"].includes(item.status));
}

export function getEnterprisePackages(): PackageContract[] {
  return packageContracts.filter((item) => item.tier === "enterprise" || item.category === "enterprise");
}

export function getPackageGroupByKey(groupKey: string): PackageGroupContract | undefined {
  return packageGroupsByKey[groupKey];
}

export function getPackageGroupsByCategory(category: PackageGroupCategory): PackageGroupContract[] {
  return packageGroups.filter((item) => item.category === category);
}

export function getPackageGroupPackages(groupOrKey: string | PackageGroupContract): PackageContract[] {
  const group = typeof groupOrKey === "string" ? getPackageGroupByKey(groupOrKey) : groupOrKey;
  if (!group) return [];
  return group.packages.map((packageKey) => getPackageByKey(packageKey)).filter((item): item is PackageContract => Boolean(item));
}

export function getPackagePreview(packageOrKey: string | PackageContract): PackagePreview {
  const pkg = typeof packageOrKey === "string" ? getPackageByKey(packageOrKey) : packageOrKey;
  if (!pkg) {
    return {
      packageKey: typeof packageOrKey === "string" ? packageOrKey : "unknown",
      canUse: false,
      status: "blocked",
      tier: "custom",
      category: "system",
      name: text("未找到方案定义", "Package definition not found"),
      reason: text("当前方案不存在，仅返回元数据占位。", "Package does not exist and returns metadata placeholder only."),
      moduleCount: 0,
      featureCount: 0,
      limitCount: 0,
      billingMode: "none",
      placeholderNotice: text("仅为方案元数据预览，不执行真实计费或订阅。", "Package metadata preview only; no real billing or subscription is executed."),
    };
  }

  const canUse = shouldUseInMetadata(pkg);

  return {
    packageKey: pkg.key,
    canUse,
    status: pkg.status,
    tier: pkg.tier,
    category: pkg.category,
    name: pkg.name,
    reason: canUse
      ? text("当前方案可用于元数据预览。", "Package is available for metadata preview.")
      : text("当前方案状态仅支持占位/预览，不可使用。", "Package status supports placeholder/preview only and is not usable."),
    moduleCount: pkg.modules.length,
    featureCount: pkg.features.length,
    limitCount: pkg.limits.length,
    billingMode: pkg.billingMode,
    placeholderNotice: !canUse
      ? text(
          "仅展示方案元数据，不执行真实计费、支付、订阅门禁、模块开通、租户开通或后端逻辑。",
          "Displays package metadata only; no real billing, payment, subscription guard, module provisioning, tenant provisioning, or backend logic.",
        )
      : text("可使用仅代表元数据预览能力，不代表真实订阅开通。", "Usable status indicates metadata preview capability only, not real subscription provisioning."),
  };
}

export function resolvePackageName(pkg: PackageContract, locale: SupportedLocale): string {
  return locale === "zh" ? pkg.name.zh : pkg.name.en;
}

export function resolvePackageDescription(pkg: PackageContract, locale: SupportedLocale): string | undefined {
  if (!pkg.description) return undefined;
  return locale === "zh" ? pkg.description.zh : pkg.description.en;
}

export { packageContracts, packageGroups };
