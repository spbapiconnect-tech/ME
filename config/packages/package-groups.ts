import type { PackageGroupContract } from "@/types/package";

const t = (zh: string, en: string) => ({ zh, en });

export const packageGroups: PackageGroupContract[] = [
  {
    key: "packages.base-plans",
    name: t("基础方案", "Base Plans"),
    description: t("ME Starter/Ops/Pro/Enterprise 方案目录。", "Catalog for ME Starter/Ops/Pro/Enterprise plans."),
    category: "base-plans",
    packages: ["package.plan.starter", "package.plan.ops", "package.plan.pro", "package.plan.enterprise"],
    status: "active",
  },
  {
    key: "packages.module-packs",
    name: t("模块扩展包", "Module Packs"),
    description: t("围绕采购、库存、供应商、任务、培训、POS 的扩展包目录。", "Catalog of procurement, inventory, supplier, task, education, and POS packs."),
    category: "module-packs",
    packages: [
      "package.pack.procurement",
      "package.pack.inventory",
      "package.pack.supplier",
      "package.pack.task-control",
      "package.pack.education",
      "package.pack.pos-report",
      "package.pack.manager-workspace",
    ],
    status: "active",
  },
  {
    key: "packages.operations",
    name: t("运营组合", "Operations Bundles"),
    description: t("面向运营团队的角色和布局组合包。", "Role and layout-oriented bundles for operations teams."),
    category: "operations",
    packages: ["package.plan.ops", "package.pack.manager-workspace", "package.addon.layout-engine"],
    status: "active",
  },
  {
    key: "packages.compliance",
    name: t("合规组合", "Compliance Bundles"),
    description: t("审计、通知与流程合规相关包目录。", "Catalog for audit, notification, and workflow compliance bundles."),
    category: "compliance",
    packages: ["package.addon.audit-compliance", "package.addon.rules-preview"],
    status: "active",
  },
  {
    key: "packages.reporting",
    name: t("报表组合", "Reporting Bundles"),
    description: t("报表构建和布局能力相关包目录。", "Catalog for report-builder and layout capabilities."),
    category: "reporting",
    packages: ["package.plan.pro", "package.addon.report-builder", "package.addon.layout-engine"],
    status: "preview-only",
  },
  {
    key: "packages.system-preview",
    name: t("系统预览", "System Preview"),
    description: t("系统级占位包目录，仅用于预览。", "System-level placeholder bundle catalog for preview only."),
    category: "system-preview",
    packages: ["package.system.previewOnly"],
    status: "placeholder",
  },
];

export const packageGroupsByKey: Record<string, PackageGroupContract> = Object.fromEntries(packageGroups.map((item) => [item.key, item]));
