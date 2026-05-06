import type { MeBranchProfile } from "@/types/branch-context";

const branchPreviewNote =
  "Branch preview metadata only. No real tenant model, branch database, branch switching persistence, auth, session, or permission enforcement is connected.";

export const meBranchProfiles: MeBranchProfile[] = [
  {
    key: "all-stores",
    name: { zh: "全部门店", en: "All Stores" },
    shortName: "ALL",
    description: {
      zh: "跨门店聚合视角，用于预览业务工作台、角色、PSI 与报表在总部/经营层上下文中的表现。",
      en: "Aggregate cross-store view for previewing how the business workspace, roles, PSI, and reports behave in a portfolio context.",
    },
    region: { zh: "总部 / 全局", en: "HQ / Portfolio" },
    status: "active",
    tone: "success",
    defaultRoute: "/branches/all-stores",
    linkedRoles: ["owner", "store-manager", "purchasing", "warehouse", "system-admin"],
    linkedModules: ["psi", "reports", "tasks", "education-placeholder"],
    visibleNavigationItemKeys: ["dashboard", "reports", "psi-workspace", "roles", "navigation-ia"],
    isAggregate: true,
    notes: `${branchPreviewNote} This aggregate preview does not create a real tenant or global branch scope.`,
  },
  {
    key: "kch",
    name: { zh: "KCH 门店", en: "KCH" },
    shortName: "KCH",
    description: {
      zh: "本地运营门店上下文，突出采购、供应商、库存与任务协同的只读预览。",
      en: "Local operations branch context focused on read-only procurement, supplier, inventory, and task coordination previews.",
    },
    region: { zh: "城市核心店", en: "Urban Core Branch" },
    status: "active",
    tone: "info",
    defaultRoute: "/branches/kch",
    linkedRoles: ["store-manager", "purchasing", "warehouse", "staff"],
    linkedModules: ["procurement", "supplier", "inventory", "tasks"],
    visibleNavigationItemKeys: ["dashboard", "psi-workspace", "procurement", "supplier", "inventory", "reports", "tasks", "roles"],
    isAggregate: false,
    notes: `${branchPreviewNote} KCH is a local branch preview only and does not enable runtime branch filtering.`,
  },
  {
    key: "btu",
    name: { zh: "BTU 门店", en: "BTU" },
    shortName: "BTU",
    description: {
      zh: "本地运营门店上下文，突出库存可见性、报表与培训占位的演示体验。",
      en: "Local branch context centered on inventory visibility, reporting, and education placeholders for demo review.",
    },
    region: { zh: "区域样板店", en: "Regional Pilot Branch" },
    status: "watch",
    tone: "warning",
    defaultRoute: "/branches/btu",
    linkedRoles: ["store-manager", "warehouse", "staff"],
    linkedModules: ["inventory", "reports", "tasks", "education-placeholder"],
    visibleNavigationItemKeys: ["dashboard", "psi-workspace", "inventory", "reports", "tasks", "education", "roles"],
    isAggregate: false,
    notes: `${branchPreviewNote} BTU remains a descriptive branch workspace preview with no database-backed switching or access mapping.`,
  },
  {
    key: "future-branch",
    name: { zh: "未来门店", en: "Future Branch" },
    shortName: "NEXT",
    description: {
      zh: "用于展示未来门店扩展、租户/门店基础能力与分支接入规划的占位上下文。",
      en: "Placeholder context for future branch rollout, tenant/store foundations, and branch onboarding planning.",
    },
    region: { zh: "待规划", en: "Planned" },
    status: "coming-soon",
    tone: "muted",
    defaultRoute: "/branches/future-branch",
    linkedRoles: ["owner", "system-admin"],
    linkedModules: ["branch-placeholder", "navigation", "system-foundation-preview"],
    visibleNavigationItemKeys: ["dashboard", "branches", "navigation-ia", "system-foundation"],
    isAggregate: false,
    notes: `${branchPreviewNote} Future Branch is a coming-soon placeholder for later tenant and branch scope work.`,
  },
];
