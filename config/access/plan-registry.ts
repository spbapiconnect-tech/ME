import type { PlanRegistryItem } from "@/types/access-control"

export const planRegistry: PlanRegistryItem[] = [
  {
    code: "starter",
    name: { zh: "基础版", en: "Starter" },
    description: { zh: "覆盖基础任务与门店执行流程。", en: "Covers baseline task and store execution workflows." },
    targetCustomer: { zh: "单店或轻量连锁", en: "Single store or light multi-store teams" },
    recommendedModules: ["task"],
    status: "active",
  },
  {
    code: "ops",
    name: { zh: "运营版", en: "Ops" },
    description: { zh: "覆盖采购、供应、库存与任务协同。", en: "Covers procurement, supplier, inventory, and task collaboration." },
    targetCustomer: { zh: "快速增长门店团队", en: "Growing store operations teams" },
    recommendedModules: ["procurement", "supplier", "inventory", "task"],
    status: "active",
  },
  {
    code: "pro",
    name: { zh: "专业版", en: "Pro" },
    description: { zh: "覆盖报表分析、培训与跨门店管理。", en: "Adds reporting, training, and cross-branch coordination capabilities." },
    targetCustomer: { zh: "多门店与区域运营团队", en: "Multi-branch and regional operations teams" },
    recommendedModules: ["procurement", "supplier", "inventory", "task", "pos-report", "education"],
    status: "active",
  },
  {
    code: "enterprise",
    name: { zh: "企业版", en: "Enterprise" },
    description: { zh: "面向集团化治理与平台级扩展能力。", en: "Designed for enterprise governance and platform-level expansion." },
    targetCustomer: { zh: "集团化连锁与平台团队", en: "Large franchise groups and platform teams" },
    recommendedModules: ["procurement", "supplier", "inventory", "task", "pos-report", "education", "api-center"],
    status: "coming-soon",
  },
]

export const planRegistryByCode: Record<string, PlanRegistryItem> = Object.fromEntries(planRegistry.map((plan) => [plan.code, plan]))
