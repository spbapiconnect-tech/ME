import type { MeNavigationItem, MeNavigationMap } from "@/types/navigation";

function createItem(item: MeNavigationItem): MeNavigationItem {
  return item;
}

const dashboard = createItem({
  key: "dashboard",
  label: { zh: "仪表盘", en: "Dashboard" },
  description: { zh: "ME 业务工作台首页。", en: "The main business workspace entry for ME." },
  href: "/",
  group: "business",
  status: "active",
  tone: "success",
  badge: { zh: "主入口", en: "Primary" },
  isPrimary: true,
  isFoundation: false,
  notes: "Business-first homepage route.",
});

const businessWorkspace = createItem({
  key: "business-workspace",
  label: { zh: "业务工作台", en: "Business Workspace" },
  description: { zh: "以业务运营为主的 B2B SaaS 首页。", en: "Business-first B2B SaaS workspace home." },
  href: "/",
  group: "business",
  status: "active",
  tone: "info",
  badge: { zh: "工作台", en: "Workspace" },
  isPrimary: true,
  isFoundation: false,
  notes: "Shares the homepage route with Dashboard for IA clarity.",
});

const psiWorkspace = createItem({
  key: "psi-workspace",
  label: { zh: "PSI 工作台", en: "PSI Workspace" },
  description: { zh: "采购、供应商与库存读写隔离的只读工作区。", en: "Read-only procurement, supplier, and inventory workspace." },
  href: "/psi",
  group: "business",
  status: "active",
  tone: "success",
  badge: { zh: "PSI", en: "PSI" },
  isPrimary: true,
  isFoundation: false,
  relatedModule: "procurement",
});

const procurement = createItem({
  key: "procurement",
  label: { zh: "采购", en: "Procurement" },
  description: { zh: "采购工作台只读预览。", en: "Read-only procurement workspace preview." },
  href: "/psi/procurement",
  group: "operations",
  status: "active",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
  relatedModule: "procurement",
});

const supplier = createItem({
  key: "supplier",
  label: { zh: "供应商", en: "Supplier" },
  description: { zh: "供应商目录与协作状态只读预览。", en: "Read-only supplier directory and collaboration preview." },
  href: "/psi/supplier",
  group: "operations",
  status: "active",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
  relatedModule: "supplier",
});

const inventory = createItem({
  key: "inventory",
  label: { zh: "库存", en: "Inventory" },
  description: { zh: "库存可见性与风险状态只读预览。", en: "Read-only inventory visibility and risk preview." },
  href: "/psi/inventory",
  group: "operations",
  status: "active",
  tone: "warning",
  isPrimary: false,
  isFoundation: false,
  relatedModule: "inventory",
});

const psiActions = createItem({
  key: "psi-actions",
  label: { zh: "PSI 动作", en: "PSI Actions" },
  description: { zh: "PSI 动作草稿与表单占位预览。", en: "PSI action draft and form placeholder preview." },
  href: "/psi/actions",
  group: "operations",
  status: "preview-only",
  tone: "info",
  badge: { zh: "预览", en: "Preview" },
  isPrimary: false,
  isFoundation: false,
  relatedModule: "procurement",
});

const psiIssues = createItem({
  key: "psi-issues",
  label: { zh: "PSI 问题", en: "PSI Issues" },
  description: { zh: "PSI 问题占位页与闭环预览。", en: "PSI issue placeholder and close-loop preview." },
  href: "/psi/issues",
  group: "operations",
  status: "preview-only",
  tone: "warning",
  badge: { zh: "预览", en: "Preview" },
  isPrimary: false,
  isFoundation: false,
  relatedModule: "inventory",
});

const reports = createItem({
  key: "reports",
  label: { zh: "报表", en: "Reports" },
  description: { zh: "ME 报表与 PSI 报表预览入口。", en: "ME reports and PSI preview entry point." },
  href: "/reports",
  group: "reports",
  status: "active",
  tone: "info",
  badge: { zh: "分析", en: "Analytics" },
  isPrimary: true,
  isFoundation: false,
  relatedModule: "pos-report",
});

const tasks = createItem({
  key: "tasks",
  label: { zh: "任务", en: "Tasks" },
  description: { zh: "任务引擎只读列表与详情预览。", en: "Read-only task engine list and detail preview." },
  href: "/tasks",
  group: "reports",
  status: "preview-only",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
  relatedModule: "task",
});

const education = createItem({
  key: "education",
  label: { zh: "培训", en: "Education" },
  description: { zh: "培训模块 Demo 路由占位。", en: "Education module demo route placeholder." },
  href: "/demo/education",
  group: "reports",
  status: "preview-only",
  tone: "muted",
  badge: { zh: "占位", en: "Placeholder" },
  isPrimary: false,
  isFoundation: false,
  relatedModule: "education",
});

const posReports = createItem({
  key: "pos-reports",
  label: { zh: "POS 报表", en: "POS Reports" },
  description: { zh: "POS 报表 Demo 路由占位。", en: "POS report demo route placeholder." },
  href: "/demo/pos-report",
  group: "reports",
  status: "preview-only",
  tone: "muted",
  badge: { zh: "占位", en: "Placeholder" },
  isPrimary: false,
  isFoundation: false,
  relatedModule: "pos-report",
});

const systemFoundation = createItem({
  key: "system-foundation",
  label: { zh: "系统基础层", en: "System Foundation" },
  description: { zh: "平台契约、元数据与基础能力总览。", en: "Platform contracts, metadata, and foundation overview." },
  href: "/system-foundation",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  badge: { zh: "次级", en: "Secondary" },
  isPrimary: true,
  isFoundation: true,
});

const layoutEngine = createItem({
  key: "layout-engine",
  label: { zh: "布局引擎", en: "Layout Engine" },
  description: { zh: "布局与皮肤基础预览。", en: "Layout and skin foundation preview." },
  href: "/layout-engine",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const actionContracts = createItem({
  key: "action-contracts",
  label: { zh: "动作契约", en: "Action Contracts" },
  description: { zh: "动作元数据与来源映射。", en: "Action metadata and source mapping." },
  href: "/action-contracts",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const accessControl = createItem({
  key: "access-control",
  label: { zh: "访问控制", en: "Access Control" },
  description: { zh: "权限与角色契约预览。", en: "Permission and role contract preview." },
  href: "/access-control",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const auditTrail = createItem({
  key: "audit-trail",
  label: { zh: "审计轨迹", en: "Audit Trail" },
  description: { zh: "审计契约与事件来源预览。", en: "Audit contract and event source preview." },
  href: "/audit-trail",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const workflow = createItem({
  key: "workflow",
  label: { zh: "工作流", en: "Workflow" },
  description: { zh: "工作流触发与自动化契约占位。", en: "Workflow trigger and automation contract placeholder." },
  href: "/workflow",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const notifications = createItem({
  key: "notifications",
  label: { zh: "通知", en: "Notifications" },
  description: { zh: "通知契约与模板占位预览。", en: "Notification contract and template placeholder preview." },
  href: "/notifications",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const reportsFoundation = createItem({
  key: "reports-foundation",
  label: { zh: "报表基础", en: "Reports" },
  description: { zh: "报表契约与小部件基础仍保持可访问。", en: "Report contract and widget foundations remain accessible." },
  href: "/reports",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
  notes: "Secondary foundation link to the same /reports route.",
});

const rules = createItem({
  key: "rules",
  label: { zh: "规则", en: "Rules" },
  description: { zh: "规则与公式基础契约。", en: "Rule and formula foundation contracts." },
  href: "/rules",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const packages = createItem({
  key: "packages",
  label: { zh: "套餐", en: "Packages" },
  description: { zh: "SaaS 套餐与模块包契约预览。", en: "SaaS plan and module package contract preview." },
  href: "/packages",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const components = createItem({
  key: "components",
  label: { zh: "组件", en: "Components" },
  description: { zh: "核心 UI 组件与表单组件展示。", en: "Core UI and form component showcase." },
  href: "/components",
  group: "system-foundation",
  status: "active",
  tone: "muted",
  isPrimary: false,
  isFoundation: true,
});

const navigationIa = createItem({
  key: "navigation-ia",
  label: { zh: "导航 IA", en: "Navigation IA" },
  description: { zh: "ME 业务导航与系统基础层映射预览。", en: "ME business navigation and system foundation map preview." },
  href: "/navigation",
  group: "footer",
  status: "preview-only",
  tone: "info",
  badge: { zh: "IA", en: "IA" },
  isPrimary: true,
  isFoundation: false,
});

const modules = createItem({
  key: "modules",
  label: { zh: "模块中心", en: "Modules" },
  description: { zh: "模块注册表与中心入口。", en: "Module registry and module center entry." },
  href: "/modules",
  group: "footer",
  status: "preview-only",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
});

const demo = createItem({
  key: "demo",
  label: { zh: "演示", en: "Demo" },
  description: { zh: "跨模块 Demo 工作区。", en: "Cross-module demo workspace." },
  href: "/demo",
  group: "footer",
  status: "preview-only",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
});

const templates = createItem({
  key: "templates",
  label: { zh: "模板", en: "Templates" },
  description: { zh: "页面模板与布局参考。", en: "Page templates and layout reference." },
  href: "/templates",
  group: "footer",
  status: "preview-only",
  tone: "neutral",
  isPrimary: false,
  isFoundation: false,
});

export const navigationMap: MeNavigationMap = {
  primaryItems: [dashboard, psiWorkspace, reports, systemFoundation, navigationIa],
  groups: [
    {
      key: "business",
      title: { zh: "业务", en: "Business" },
      description: { zh: "面向业务运营的主导航。", en: "Primary navigation for business operations." },
      groupType: "business",
      items: [dashboard, businessWorkspace, psiWorkspace],
      collapsedByDefault: false,
      isFoundationGroup: false,
    },
    {
      key: "operations",
      title: { zh: "运营", en: "Operations" },
      description: { zh: "围绕 PSI 的日常运营导航。", en: "Daily operational navigation around PSI." },
      groupType: "operations",
      items: [procurement, supplier, inventory, psiActions, psiIssues],
      collapsedByDefault: false,
      isFoundationGroup: false,
    },
    {
      key: "reports",
      title: { zh: "报表", en: "Reports" },
      description: { zh: "报表、任务与演示分析入口。", en: "Reporting, task, and demo analytics entry points." },
      groupType: "reports",
      items: [reports, tasks, education, posReports],
      collapsedByDefault: false,
      isFoundationGroup: false,
    },
    {
      key: "system-foundation",
      title: { zh: "系统基础层", en: "System Foundation" },
      description: { zh: "平台契约与系统基础能力，保持可访问但降级展示。", en: "Platform contracts and system foundations remain accessible but secondary." },
      groupType: "system",
      items: [
        systemFoundation,
        layoutEngine,
        actionContracts,
        accessControl,
        auditTrail,
        workflow,
        notifications,
        reportsFoundation,
        rules,
        packages,
        components,
      ],
      collapsedByDefault: true,
      isFoundationGroup: true,
    },
  ],
  footerItems: [modules, demo, templates],
  generatedAt: "2026-05-06T00:00:00.000Z",
  notice: {
    zh: "当前导航 IA 仅用于 UI/导航演示，不包含认证、权限、数据库、API 或真实写操作。",
    en: "This navigation IA is UI-only and navigation-only. No auth, permission enforcement, database, API, or real writes are connected.",
  },
};
