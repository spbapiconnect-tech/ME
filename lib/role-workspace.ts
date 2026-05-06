import { meRoleProfiles } from "@/config/roles";
import { getBusinessWorkspacePageData } from "@/lib/page-data/business-workspace-page-data";
import { getFoundationNavigationItems, getNavigationItemByKey } from "@/lib/navigation";
import type {
  MeRoleFoundationPreview,
  MeRoleKey,
  MeRoleNavigationPreview,
  MeRoleProfile,
  MeRoleWorkspaceAction,
  MeRoleWorkspaceData,
  MeRoleWorkspaceMetric,
  MeRoleWorkspaceModule,
} from "@/types/role-workspace";

function getRoleMetricValue(metrics: Awaited<ReturnType<typeof getBusinessWorkspacePageData>>["metrics"], key: string, fallback: string) {
  return metrics.find((metric) => metric.key === key)?.value ?? fallback;
}

function createMetric(metric: MeRoleWorkspaceMetric): MeRoleWorkspaceMetric {
  return metric;
}

function createModule(module: MeRoleWorkspaceModule): MeRoleWorkspaceModule {
  return module;
}

function createAction(action: MeRoleWorkspaceAction): MeRoleWorkspaceAction {
  return action;
}

function getFoundationPreviewDescription(accessLevel: MeRoleProfile["foundationAccessLevel"]): MeRoleFoundationPreview["description"] {
  if (accessLevel === "full-preview") {
    return {
      zh: "显示完整系统基础层预览，但仅用于角色体验演示。",
      en: "Shows the full system foundation preview for role experience review only.",
    };
  }

  if (accessLevel === "limited-preview") {
    return {
      zh: "仅显示有限的系统基础层入口预览，不代表真实权限。",
      en: "Shows a limited foundation preview only and does not imply real permissions.",
    };
  }

  return {
    zh: "系统基础层默认不属于该角色的核心工作区，仅保留隐藏预览说明。",
    en: "System foundation is not part of this role's core workspace preview and remains descriptive only.",
  };
}

function getFoundationPreviewKeys(accessLevel: MeRoleProfile["foundationAccessLevel"]) {
  if (accessLevel === "full-preview") {
    return getFoundationNavigationItems().map((item) => item.key);
  }

  if (accessLevel === "limited-preview") {
    return ["system-foundation", "reports-foundation", "packages"];
  }

  return [];
}

async function getBaseWorkspaceContext() {
  const businessWorkspace = await getBusinessWorkspacePageData();
  return {
    generatedAt: businessWorkspace.generatedAt,
    metrics: businessWorkspace.metrics,
    metricValues: {
      operations: getRoleMetricValue(businessWorkspace.metrics, "today-operations-overview", "24"),
      procurement: getRoleMetricValue(businessWorkspace.metrics, "procurement-pending", "8"),
      inventory: getRoleMetricValue(businessWorkspace.metrics, "inventory-risk", "6"),
      supplier: getRoleMetricValue(businessWorkspace.metrics, "supplier-issues", "3"),
      health: getRoleMetricValue(businessWorkspace.metrics, "psi-health-score", "78"),
    },
  };
}

export function getRoleProfiles(): MeRoleProfile[] {
  return meRoleProfiles;
}

export function getRoleProfileByKey(roleKey: string): MeRoleProfile | undefined {
  return meRoleProfiles.find((role) => role.key === roleKey);
}

export async function getRoleFoundationPreview(roleKey: string): Promise<MeRoleFoundationPreview | null> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return null;
  }

  const visibleItemKeys = getFoundationPreviewKeys(role.foundationAccessLevel);
  const visibleItems = visibleItemKeys
    .map((key) => getNavigationItemByKey(key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    accessLevel: role.foundationAccessLevel,
    visibleItemKeys,
    visibleItems,
    description: getFoundationPreviewDescription(role.foundationAccessLevel),
  };
}

export async function getRoleNavigationPreview(roleKey: string): Promise<MeRoleNavigationPreview | null> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return null;
  }

  const visibleItems = role.visibleNavigationItemKeys
    .map((key) => getNavigationItemByKey(key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const foundationPreview = await getRoleFoundationPreview(roleKey);

  return {
    roleKey: role.key,
    visibleItemKeys: role.visibleNavigationItemKeys,
    visibleItems,
    hiddenFoundationCount: Math.max(getFoundationNavigationItems().length - (foundationPreview?.visibleItems.length ?? 0), 0),
    notice: {
      zh: "该导航仅表示角色体验预览，不会对全局路由进行真实隐藏。",
      en: "This navigation is a role experience preview only and does not hide routes globally.",
    },
  };
}

export async function getRoleWorkspaceMetrics(roleKey: string): Promise<MeRoleWorkspaceMetric[]> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return [];
  }

  const context = await getBaseWorkspaceContext();

  const metricMap: Record<MeRoleKey, MeRoleWorkspaceMetric[]> = {
    owner: [
      createMetric({
        key: "owner-health",
        label: { zh: "经营健康", en: "Business Health" },
        value: context.metricValues.health,
        tone: "success",
        description: { zh: "复用 PSI 健康评分 mock 数据。", en: "Reuses the PSI health score mock preview." },
        route: "/reports",
      }),
      createMetric({
        key: "owner-revenue-placeholder",
        label: { zh: "收入占位", en: "Revenue Placeholder" },
        value: "128k",
        tone: "info",
        description: { zh: "仅用于经营者收入快照占位。", en: "Placeholder revenue snapshot for owner review only." },
        route: "/reports",
      }),
      createMetric({
        key: "owner-risk",
        label: { zh: "风险关注", en: "Risk Watch" },
        value: String(Number(context.metricValues.inventory) + Number(context.metricValues.supplier)),
        tone: "warning",
        description: { zh: "来自库存风险与供应商问题的聚合。", en: "Aggregated from inventory risk and supplier issue previews." },
        route: "/psi",
      }),
      createMetric({
        key: "owner-decisions",
        label: { zh: "待决策事项", en: "Decisions Pending" },
        value: context.metricValues.procurement,
        tone: "neutral",
        description: { zh: "待处理采购请求作为经营决策占位。", en: "Uses pending procurement requests as decision backlog placeholder." },
        route: "/psi/procurement",
      }),
    ],
    "store-manager": [
      createMetric({
        key: "manager-operations",
        label: { zh: "今日运营项", en: "Today Operations" },
        value: context.metricValues.operations,
        tone: "info",
        route: "/",
      }),
      createMetric({
        key: "manager-task-completion",
        label: { zh: "任务完成率占位", en: "Task Completion" },
        value: "84%",
        tone: "success",
        description: { zh: "仅用于门店执行完成率预览。", en: "Placeholder execution completion rate for store operations." },
        route: "/tasks",
      }),
      createMetric({
        key: "manager-issues",
        label: { zh: "待跟进问题", en: "Open Issues" },
        value: context.metricValues.supplier,
        tone: "warning",
        route: "/psi/issues",
      }),
      createMetric({
        key: "manager-daily-risk",
        label: { zh: "门店风险", en: "Store Risk" },
        value: context.metricValues.inventory,
        tone: "warning",
        route: "/reports",
      }),
    ],
    purchasing: [
      createMetric({
        key: "purchasing-pending-requests",
        label: { zh: "采购请求", en: "Purchase Requests" },
        value: context.metricValues.procurement,
        tone: "warning",
        route: "/psi/procurement",
      }),
      createMetric({
        key: "purchasing-suppliers",
        label: { zh: "供应商关注", en: "Suppliers At Risk" },
        value: context.metricValues.supplier,
        tone: "warning",
        route: "/psi/supplier",
      }),
      createMetric({
        key: "purchasing-receiving-placeholder",
        label: { zh: "收货占位", en: "Receiving Placeholder" },
        value: "12",
        tone: "info",
        description: { zh: "仅显示收货协同占位数。", en: "Shows a receiving coordination placeholder count only." },
        route: "/psi/actions",
      }),
      createMetric({
        key: "purchasing-report-coverage",
        label: { zh: "报表覆盖", en: "Report Coverage" },
        value: "PSI",
        tone: "success",
        description: { zh: "当前报表预览覆盖采购相关指标。", en: "Current report preview covers procurement-related indicators." },
        route: "/reports",
      }),
    ],
    warehouse: [
      createMetric({
        key: "warehouse-low-stock",
        label: { zh: "低库存 SKU", en: "Low-Stock SKUs" },
        value: context.metricValues.inventory,
        tone: "warning",
        route: "/psi/inventory",
      }),
      createMetric({
        key: "warehouse-receiving-placeholder",
        label: { zh: "到货占位", en: "Inbound Receiving" },
        value: "9",
        tone: "info",
        description: { zh: "仅用于仓储收货占位预览。", en: "Receiving placeholder for warehouse preview only." },
        route: "/psi/actions",
      }),
      createMetric({
        key: "warehouse-replenishment",
        label: { zh: "补货波次占位", en: "Replenishment Waves" },
        value: "4",
        tone: "neutral",
        route: "/psi/inventory",
      }),
      createMetric({
        key: "warehouse-movement-placeholder",
        label: { zh: "库存移动占位", en: "Movement Placeholder" },
        value: "Read-only",
        tone: "muted",
        route: "/psi/issues",
      }),
    ],
    staff: [
      createMetric({
        key: "staff-assigned-work",
        label: { zh: "分配工作", en: "Assigned Work" },
        value: "7",
        tone: "info",
        description: { zh: "仅用于任务量占位预览。", en: "Assigned task volume placeholder only." },
        route: "/tasks",
      }),
      createMetric({
        key: "staff-training",
        label: { zh: "培训进度占位", en: "Training Progress" },
        value: "3/8",
        tone: "neutral",
        route: "/demo/education",
      }),
      createMetric({
        key: "staff-issues",
        label: { zh: "问题上报入口", en: "Issue Reporting" },
        value: "Limited",
        tone: "warning",
        description: { zh: "仅保留有限问题入口预览。", en: "Limited issue entry preview only." },
        route: "/psi/issues",
      }),
      createMetric({
        key: "staff-dashboard-preview",
        label: { zh: "工作台预览", en: "Workspace Preview" },
        value: "Basic",
        tone: "muted",
        route: "/",
      }),
    ],
    "system-admin": [
      createMetric({
        key: "admin-foundation-routes",
        label: { zh: "基础路由", en: "Foundation Routes" },
        value: String(getFoundationNavigationItems().length),
        tone: "muted",
        route: "/system-foundation",
      }),
      createMetric({
        key: "admin-access-preview",
        label: { zh: "访问控制预览", en: "Access Preview" },
        value: "6",
        tone: "info",
        description: { zh: "访问控制页面与角色预览互相关联。", en: "Access control and role preview pages stay linked for governance review." },
        route: "/access-control",
      }),
      createMetric({
        key: "admin-audit-preview",
        label: { zh: "审计预览", en: "Audit Preview" },
        value: "Ready",
        tone: "success",
        route: "/audit-trail",
      }),
      createMetric({
        key: "admin-navigation-groups",
        label: { zh: "导航分组", en: "Navigation Groups" },
        value: "4",
        tone: "neutral",
        route: "/navigation",
      }),
    ],
  };

  return metricMap[role.key];
}

export async function getRoleWorkspaceModules(roleKey: string): Promise<MeRoleWorkspaceModule[]> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return [];
  }

  const moduleMap: Record<MeRoleKey, MeRoleWorkspaceModule[]> = {
    owner: [
      createModule({
        key: "owner-dashboard",
        title: { zh: "经营总览", en: "Executive Dashboard" },
        description: { zh: "查看经营健康、风险与收入占位摘要。", en: "Review health, risk, and revenue placeholders across the business." },
        route: "/",
        tone: "success",
        status: "active",
      }),
      createModule({
        key: "owner-reports",
        title: { zh: "经营报表", en: "Executive Reports" },
        description: { zh: "只读报表汇总，支持经营决策预览。", en: "Read-only reporting preview for owner-level decisions." },
        route: "/reports",
        tone: "info",
        status: "active",
      }),
      createModule({
        key: "owner-psi",
        title: { zh: "PSI 运营", en: "PSI Operations" },
        description: { zh: "采购、供应商、库存联动情况预览。", en: "Preview cross-functional PSI activity and risk signals." },
        route: "/psi",
        tone: "warning",
        status: "active",
      }),
      createModule({
        key: "owner-packages",
        title: { zh: "套餐策略", en: "Packages Strategy" },
        description: { zh: "套餐与模块包配置的只读预览。", en: "Read-only package and plan strategy preview." },
        route: "/packages",
        tone: "muted",
        status: "preview-only",
      }),
    ],
    "store-manager": [
      createModule({
        key: "manager-daily-workspace",
        title: { zh: "门店工作台", en: "Store Workspace" },
        description: { zh: "门店经理的日常执行与异常总览。", en: "Daily execution and exception summary for store operations." },
        route: "/",
        tone: "info",
        status: "active",
      }),
      createModule({
        key: "manager-tasks",
        title: { zh: "任务执行", en: "Task Execution" },
        description: { zh: "任务列表与进度占位，当前仅为只读。", en: "Task list and progress placeholder in read-only mode." },
        route: "/tasks",
        tone: "success",
        status: "preview-only",
      }),
      createModule({
        key: "manager-issues",
        title: { zh: "问题闭环", en: "Issue Follow-up" },
        description: { zh: "门店问题与 PSI 风险跟进预览。", en: "Issue and PSI exception follow-up preview for store managers." },
        route: "/psi/issues",
        tone: "warning",
        status: "preview-only",
      }),
      createModule({
        key: "manager-reports",
        title: { zh: "班次报表", en: "Shift Reports" },
        description: { zh: "门店视角报表入口与趋势占位。", en: "Store-facing reporting entry with trend placeholders." },
        route: "/reports",
        tone: "neutral",
        status: "active",
      }),
    ],
    purchasing: [
      createModule({
        key: "purchasing-workbench",
        title: { zh: "采购工作台", en: "Procurement Workbench" },
        description: { zh: "采购请求队列与进度摘要预览。", en: "Purchase request queue and status preview." },
        route: "/psi/procurement",
        tone: "warning",
        status: "active",
      }),
      createModule({
        key: "purchasing-supplier",
        title: { zh: "供应商协同", en: "Supplier Coordination" },
        description: { zh: "供应商评分、问题与状态只读预览。", en: "Read-only supplier score, issue, and coordination preview." },
        route: "/psi/supplier",
        tone: "neutral",
        status: "active",
      }),
      createModule({
        key: "purchasing-receiving",
        title: { zh: "收货占位", en: "Receiving Placeholder" },
        description: { zh: "当前使用 PSI 动作页展示收货操作占位。", en: "Uses PSI actions as the receiving placeholder preview." },
        route: "/psi/actions",
        tone: "info",
        status: "placeholder",
        reason: {
          zh: "没有真实收货工作流或过账逻辑。",
          en: "No real receiving workflow or posting logic exists yet.",
        },
      }),
      createModule({
        key: "purchasing-reports",
        title: { zh: "采购报表", en: "Procurement Reports" },
        description: { zh: "采购相关 KPI 与趋势的只读报表。", en: "Read-only procurement KPIs and trend reporting preview." },
        route: "/reports",
        tone: "success",
        status: "active",
      }),
    ],
    warehouse: [
      createModule({
        key: "warehouse-inventory",
        title: { zh: "库存可视化", en: "Inventory Visibility" },
        description: { zh: "库存状态、风险与补货提示预览。", en: "Inventory status, risk, and replenishment preview." },
        route: "/psi/inventory",
        tone: "warning",
        status: "active",
      }),
      createModule({
        key: "warehouse-replenishment",
        title: { zh: "补货占位", en: "Replenishment Placeholder" },
        description: { zh: "当前通过库存页展示补货相关占位视图。", en: "Currently represented by inventory page placeholders for replenishment work." },
        route: "/psi/inventory",
        tone: "info",
        status: "placeholder",
      }),
      createModule({
        key: "warehouse-receiving",
        title: { zh: "到货协同", en: "Receiving Coordination" },
        description: { zh: "使用 PSI 动作页作为收货与移动操作入口占位。", en: "Uses PSI actions as a placeholder entry for receiving and movement tasks." },
        route: "/psi/actions",
        tone: "neutral",
        status: "placeholder",
      }),
      createModule({
        key: "warehouse-reports",
        title: { zh: "库存报表", en: "Inventory Reports" },
        description: { zh: "库存风险与履约关注项报表预览。", en: "Reporting preview for stock risk and fulfillment signals." },
        route: "/reports",
        tone: "success",
        status: "active",
      }),
    ],
    staff: [
      createModule({
        key: "staff-dashboard-preview",
        title: { zh: "工作台缩略预览", en: "Workspace Snapshot" },
        description: { zh: "仅展示基础工作台入口与状态摘要。", en: "Basic workspace entry and status summary preview only." },
        route: "/",
        tone: "neutral",
        status: "preview-only",
      }),
      createModule({
        key: "staff-tasks",
        title: { zh: "我的任务", en: "My Tasks" },
        description: { zh: "查看被分配工作与执行入口占位。", en: "Preview assigned work and execution entry points." },
        route: "/tasks",
        tone: "info",
        status: "preview-only",
      }),
      createModule({
        key: "staff-education",
        title: { zh: "培训占位", en: "Education Placeholder" },
        description: { zh: "培训内容与学习进度当前仅为占位。", en: "Training content and progress remain placeholder-only." },
        route: "/demo/education",
        tone: "muted",
        status: "placeholder",
      }),
      createModule({
        key: "staff-issues",
        title: { zh: "问题上报", en: "Issue Reporting" },
        description: { zh: "仅保留有限 PSI 问题预览入口。", en: "Keeps a limited PSI issue preview entry for staff." },
        route: "/psi/issues",
        tone: "warning",
        status: "preview-only",
      }),
    ],
    "system-admin": [
      createModule({
        key: "admin-foundation",
        title: { zh: "系统基础层", en: "System Foundation" },
        description: { zh: "平台契约、元数据与治理能力总览。", en: "Overview of platform contracts, metadata, and governance capabilities." },
        route: "/system-foundation",
        tone: "muted",
        status: "active",
      }),
      createModule({
        key: "admin-navigation",
        title: { zh: "导航 IA", en: "Navigation IA" },
        description: { zh: "导航结构与角色预览映射关系。", en: "Navigation structure and role-preview mapping." },
        route: "/navigation",
        tone: "info",
        status: "preview-only",
      }),
      createModule({
        key: "admin-access",
        title: { zh: "访问控制预览", en: "Access Control Preview" },
        description: { zh: "权限、角色与未来路由治理的契约预览。", en: "Permission, role, and future route governance contract preview." },
        route: "/access-control",
        tone: "neutral",
        status: "active",
      }),
      createModule({
        key: "admin-audit",
        title: { zh: "审计轨迹", en: "Audit Trail" },
        description: { zh: "审计事件与平台可追踪性预览。", en: "Audit events and platform traceability preview." },
        route: "/audit-trail",
        tone: "success",
        status: "active",
      }),
      createModule({
        key: "admin-workflow",
        title: { zh: "工作流占位", en: "Workflow Placeholder" },
        description: { zh: "工作流与配置页当前仍为契约预览。", en: "Workflow and configuration pages remain contract previews only." },
        route: "/workflow",
        tone: "warning",
        status: "preview-only",
      }),
    ],
  };

  return moduleMap[role.key];
}

export async function getRoleWorkspaceActions(roleKey: string): Promise<MeRoleWorkspaceAction[]> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return [];
  }

  const actionMap: Record<MeRoleKey, MeRoleWorkspaceAction[]> = {
    owner: [
      createAction({
        key: "owner-open-dashboard",
        label: { zh: "打开经营工作台", en: "Open Executive Workspace" },
        description: { zh: "查看经营摘要与关键指标。", en: "Open the business workspace summary and core KPIs." },
        route: "/",
        tone: "success",
        isPlaceholder: true,
      }),
      createAction({
        key: "owner-open-reports",
        label: { zh: "查看经营报表", en: "Review Reports" },
        description: { zh: "进入报表预览页面。", en: "Open the read-only reporting preview." },
        route: "/reports",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "owner-open-foundation",
        label: { zh: "查看系统基础层", en: "Review Foundation" },
        route: "/system-foundation",
        tone: "muted",
        isPlaceholder: true,
      }),
    ],
    "store-manager": [
      createAction({
        key: "manager-open-tasks",
        label: { zh: "查看任务占位", en: "Open Tasks" },
        description: { zh: "查看门店执行任务入口。", en: "Open the store execution task placeholder." },
        route: "/tasks",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "manager-open-issues",
        label: { zh: "查看问题跟进", en: "Review Issues" },
        route: "/psi/issues",
        tone: "warning",
        isPlaceholder: true,
      }),
      createAction({
        key: "manager-open-navigation",
        label: { zh: "查看导航 IA", en: "Open Navigation IA" },
        route: "/navigation",
        tone: "neutral",
        isPlaceholder: true,
      }),
    ],
    purchasing: [
      createAction({
        key: "purchasing-open-procurement",
        label: { zh: "查看采购队列", en: "Open Procurement Queue" },
        route: "/psi/procurement",
        tone: "warning",
        isPlaceholder: true,
      }),
      createAction({
        key: "purchasing-open-supplier",
        label: { zh: "查看供应商预览", en: "Review Suppliers" },
        route: "/psi/supplier",
        tone: "neutral",
        isPlaceholder: true,
      }),
      createAction({
        key: "purchasing-open-receiving-placeholder",
        label: { zh: "打开收货占位", en: "Open Receiving Placeholder" },
        route: "/psi/actions",
        tone: "info",
        isPlaceholder: true,
      }),
    ],
    warehouse: [
      createAction({
        key: "warehouse-open-inventory",
        label: { zh: "查看库存预览", en: "Open Inventory Preview" },
        route: "/psi/inventory",
        tone: "warning",
        isPlaceholder: true,
      }),
      createAction({
        key: "warehouse-open-reports",
        label: { zh: "查看库存报表", en: "Review Reports" },
        route: "/reports",
        tone: "success",
        isPlaceholder: true,
      }),
      createAction({
        key: "warehouse-open-actions",
        label: { zh: "查看动作占位", en: "Open Actions Placeholder" },
        route: "/psi/actions",
        tone: "neutral",
        isPlaceholder: true,
      }),
    ],
    staff: [
      createAction({
        key: "staff-open-tasks",
        label: { zh: "查看我的任务", en: "Open My Tasks" },
        route: "/tasks",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "staff-open-training",
        label: { zh: "查看培训占位", en: "Open Training Placeholder" },
        route: "/demo/education",
        tone: "muted",
        isPlaceholder: true,
      }),
      createAction({
        key: "staff-open-issues",
        label: { zh: "查看问题入口", en: "Open Issue Entry" },
        route: "/psi/issues",
        tone: "warning",
        isPlaceholder: true,
      }),
    ],
    "system-admin": [
      createAction({
        key: "admin-open-foundation",
        label: { zh: "打开系统基础层", en: "Open System Foundation" },
        route: "/system-foundation",
        tone: "muted",
        isPlaceholder: true,
      }),
      createAction({
        key: "admin-open-access",
        label: { zh: "查看访问控制", en: "Review Access Control" },
        route: "/access-control",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "admin-open-audit",
        label: { zh: "查看审计预览", en: "Review Audit Trail" },
        route: "/audit-trail",
        tone: "success",
        isPlaceholder: true,
      }),
    ],
  };

  return actionMap[role.key];
}

export async function getRoleWorkspaceData(roleKey: string): Promise<MeRoleWorkspaceData | null> {
  const role = getRoleProfileByKey(roleKey);
  if (!role) {
    return null;
  }

  const context = await getBaseWorkspaceContext();
  const [metrics, modules, actions, navigationPreview, foundationPreview] = await Promise.all([
    getRoleWorkspaceMetrics(roleKey),
    getRoleWorkspaceModules(roleKey),
    getRoleWorkspaceActions(roleKey),
    getRoleNavigationPreview(roleKey),
    getRoleFoundationPreview(roleKey),
  ]);

  if (!navigationPreview || !foundationPreview) {
    return null;
  }

  return {
    role,
    title: {
      zh: `${role.name.zh}工作区预览`,
      en: `${role.name.en} Workspace Preview`,
    },
    subtitle: {
      zh: `${role.primaryGoal.zh}，仅用于角色体验展示。`,
      en: `${role.primaryGoal.en}. Role preview only.`,
    },
    metrics,
    modules,
    actions,
    navigationPreview,
    foundationPreview,
    notice: {
      zh: "角色预览仅用于 UI/占位展示，不包含真实认证、会话、权限、路由守卫、数据库或 API。",
      en: "Role preview is UI-only and placeholder-only. No real auth, session, permissions, route guards, database, or API are connected.",
    },
    generatedAt: context.generatedAt,
  };
}

export function resolveRoleName(role: MeRoleProfile, locale: "zh" | "en" = "en"): string {
  return role.name[locale];
}

export function resolveRoleDescription(role: MeRoleProfile, locale: "zh" | "en" = "en"): string {
  return role.description[locale];
}
