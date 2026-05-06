import { meBranchProfiles } from "@/config/branches";
import { getNavigationItemByKey } from "@/lib/navigation";
import { getBusinessWorkspacePageData } from "@/lib/page-data/business-workspace-page-data";
import { getRoleProfileByKey } from "@/lib/role-workspace";
import type {
  MeBranchAction,
  MeBranchAlert,
  MeBranchKey,
  MeBranchMetric,
  MeBranchNavigationPreview,
  MeBranchProfile,
  MeBranchWorkspaceData,
  MeBranchWorkspaceLink,
} from "@/types/branch-context";
import type { MeNavigationLocale } from "@/types/navigation";

function createMetric(metric: MeBranchMetric): MeBranchMetric {
  return metric;
}

function createAlert(alert: MeBranchAlert): MeBranchAlert {
  return alert;
}

function createAction(action: MeBranchAction): MeBranchAction {
  return action;
}

function createLink(link: MeBranchWorkspaceLink): MeBranchWorkspaceLink {
  return link;
}

export function getBranchProfiles(): MeBranchProfile[] {
  return meBranchProfiles;
}

export function getBranchProfileByKey(branchKey: string): MeBranchProfile | undefined {
  return meBranchProfiles.find((branch) => branch.key === branchKey);
}

export function getBranchNavigationPreview(branchKey: string): MeBranchNavigationPreview | null {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return null;
  }

  const visibleItems = branch.visibleNavigationItemKeys
    .map((key) => getNavigationItemByKey(key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    branchKey: branch.key,
    visibleItemKeys: visibleItems.map((item) => item.key),
    visibleItems,
    notice: {
      zh: "该导航仅用于门店上下文预览，不会对全局路由进行真实隐藏或授权控制。",
      en: "This navigation is a branch context preview only and does not hide routes or enforce access globally.",
    },
  };
}

export function getBranchMetrics(branchKey: string): MeBranchMetric[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  const metricMap: Record<MeBranchKey, MeBranchMetric[]> = {
    "all-stores": [
      createMetric({
        key: "all-stores-active-contexts",
        label: { zh: "预览上下文", en: "Preview Contexts" },
        value: "4",
        unit: { zh: "个", en: "contexts" },
        tone: "success",
        description: { zh: "当前展示全部门店、KCH、BTU 与未来门店四种上下文。", en: "Covers All Stores, KCH, BTU, and Future Branch placeholder contexts." },
        route: "/branches",
      }),
      createMetric({
        key: "all-stores-operations",
        label: { zh: "聚合运营项", en: "Aggregated Operations" },
        value: "17",
        unit: { zh: "项", en: "items" },
        tone: "info",
        description: { zh: "对齐当前业务工作台中的 mock 聚合运营信号。", en: "Aligned with the current mock business workspace operations overview." },
        route: "/",
      }),
      createMetric({
        key: "all-stores-health",
        label: { zh: "PSI 健康评分", en: "PSI Health Score" },
        value: "78",
        unit: { zh: "分", en: "pts" },
        tone: "success",
        description: { zh: "只读聚合健康评分，用于跨门店经营预览。", en: "Read-only aggregate health score for portfolio-level preview." },
        route: "/reports",
      }),
      createMetric({
        key: "all-stores-role-coverage",
        label: { zh: "关联角色", en: "Linked Roles" },
        value: String(branch.linkedRoles.length),
        unit: { zh: "个", en: "roles" },
        tone: "neutral",
        description: { zh: "当前聚合上下文可快速跳转到多个角色工作区预览。", en: "This aggregate context links into multiple role workspace previews." },
        route: "/roles",
      }),
    ],
    kch: [
      createMetric({
        key: "kch-procurement-watch",
        label: { zh: "采购待跟进", en: "Procurement Watch" },
        value: "8",
        unit: { zh: "条", en: "requests" },
        tone: "warning",
        description: { zh: "门店侧采购与收货协同占位。", en: "Branch-side procurement and receiving coordination placeholder." },
        route: "/psi/procurement",
      }),
      createMetric({
        key: "kch-supplier-watch",
        label: { zh: "供应商关注", en: "Supplier Watch" },
        value: "3",
        unit: { zh: "条", en: "issues" },
        tone: "info",
        description: { zh: "供应商协同与异常跟进的本地预览。", en: "Local preview for supplier coordination and issue follow-up." },
        route: "/psi/supplier",
      }),
      createMetric({
        key: "kch-inventory-risk",
        label: { zh: "库存风险", en: "Inventory Risk" },
        value: "6",
        unit: { zh: "SKU", en: "SKU" },
        tone: "warning",
        description: { zh: "门店库存风险与补货建议的只读快照。", en: "Read-only inventory risk and replenishment snapshot." },
        route: "/psi/inventory",
      }),
      createMetric({
        key: "kch-task-flow",
        label: { zh: "执行任务占位", en: "Task Flow" },
        value: "12",
        unit: { zh: "项", en: "tasks" },
        tone: "success",
        description: { zh: "门店执行与跟进任务的演示入口。", en: "Execution and follow-up task demo entry for the branch." },
        route: "/tasks",
      }),
    ],
    btu: [
      createMetric({
        key: "btu-inventory-focus",
        label: { zh: "库存关注", en: "Inventory Focus" },
        value: "5",
        unit: { zh: "SKU", en: "SKU" },
        tone: "warning",
        description: { zh: "BTU 以库存可见性和补货节奏预览为主。", en: "BTU focuses on inventory visibility and replenishment rhythm preview." },
        route: "/psi/inventory",
      }),
      createMetric({
        key: "btu-report-coverage",
        label: { zh: "报表覆盖", en: "Report Coverage" },
        value: "PSI",
        tone: "info",
        description: { zh: "当前使用共享报表页展示门店视角指标。", en: "Currently reuses the shared reports page for branch-view metrics." },
        route: "/reports",
      }),
      createMetric({
        key: "btu-task-load",
        label: { zh: "任务占位", en: "Task Placeholder" },
        value: "7",
        unit: { zh: "项", en: "tasks" },
        tone: "neutral",
        description: { zh: "门店执行任务与交接占位。", en: "Placeholder for branch execution tasks and shift handoff." },
        route: "/tasks",
      }),
      createMetric({
        key: "btu-training-placeholder",
        label: { zh: "培训占位", en: "Education Placeholder" },
        value: "3/6",
        tone: "muted",
        description: { zh: "未来培训模块将承接门店培训进度。", en: "Future education module placeholder for branch training progress." },
        route: "/demo/education",
      }),
    ],
    "future-branch": [
      createMetric({
        key: "future-branch-status",
        label: { zh: "上下文状态", en: "Context Status" },
        value: "Coming Soon",
        tone: "muted",
        description: { zh: "未来门店仍为规划中的只读占位上下文。", en: "Future Branch remains a planned read-only placeholder context." },
        route: "/branches/future-branch",
      }),
      createMetric({
        key: "future-branch-navigation",
        label: { zh: "导航预览项", en: "Preview Navigation" },
        value: String(branch.visibleNavigationItemKeys.length),
        unit: { zh: "项", en: "items" },
        tone: "info",
        description: { zh: "展示未来分支基础导航与系统基础层连接点。", en: "Shows preview links for future branch navigation and system foundations." },
        route: "/navigation",
      }),
      createMetric({
        key: "future-branch-role-foundation",
        label: { zh: "基础角色", en: "Foundation Roles" },
        value: String(branch.linkedRoles.length),
        unit: { zh: "个", en: "roles" },
        tone: "neutral",
        description: { zh: "未来门店先连接经营者与系统管理员视角。", en: "Future branch initially connects owner and system admin previews." },
        route: "/roles",
      }),
      createMetric({
        key: "future-branch-data-mode",
        label: { zh: "数据模式", en: "Data Mode" },
        value: "Mock Only",
        tone: "muted",
        description: { zh: "没有真实租户/门店数据库、切换持久化或权限映射。", en: "No real tenant/store database, persistence, or access mapping is connected." },
        route: "/system-foundation",
      }),
    ],
  };

  return metricMap[branch.key];
}

export function getBranchAlerts(branchKey: string): MeBranchAlert[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  const alertMap: Record<MeBranchKey, MeBranchAlert[]> = {
    "all-stores": [
      createAlert({
        key: "all-stores-alert-aggregate",
        title: { zh: "跨门店经营聚合预览", en: "Cross-Store Executive Preview" },
        description: { zh: "全部门店上下文将业务工作台、角色、PSI 与报表串联为总部视角演示。", en: "All Stores stitches business workspace, roles, PSI, and reports into an HQ-style preview." },
        tone: "success",
        sourceModule: "dashboard",
        route: "/",
        timestampLabel: { zh: "聚合上下文 / 占位", en: "Aggregate context / Placeholder" },
      }),
      createAlert({
        key: "all-stores-alert-permissions",
        title: { zh: "无真实权限切换", en: "No Runtime Branch Permissions" },
        description: { zh: "当前分支上下文不会改变页面可访问性或角色权限。", en: "The current branch context does not change route accessibility or role permissions." },
        tone: "warning",
        sourceModule: "roles",
        route: "/roles",
        timestampLabel: { zh: "预览说明", en: "Preview notice" },
      }),
    ],
    kch: [
      createAlert({
        key: "kch-alert-procurement",
        title: { zh: "KCH 采购跟进占位", en: "KCH Procurement Follow-up" },
        description: { zh: "采购请求、供应商协同与到货动作当前为只读预览。", en: "Purchase requests, supplier coordination, and receiving actions remain read-only previews." },
        tone: "warning",
        sourceModule: "procurement",
        route: "/psi/procurement",
        timestampLabel: { zh: "门店运营上下文", en: "Local operations context" },
      }),
      createAlert({
        key: "kch-alert-reports",
        title: { zh: "共享报表页复用", en: "Shared Reports Reused" },
        description: { zh: "KCH 当前通过共享 `/reports` 展示门店报表视角。", en: "KCH currently reuses the shared `/reports` page for branch reporting context." },
        tone: "info",
        sourceModule: "reports",
        route: "/reports",
        timestampLabel: { zh: "分支上下文预览", en: "Branch preview context" },
      }),
    ],
    btu: [
      createAlert({
        key: "btu-alert-inventory",
        title: { zh: "BTU 库存优先预览", en: "BTU Inventory Priority" },
        description: { zh: "BTU 上下文强调库存风险、补货与报表可见性。", en: "BTU emphasizes inventory risk, replenishment, and reporting visibility." },
        tone: "warning",
        sourceModule: "inventory",
        route: "/psi/inventory",
        timestampLabel: { zh: "门店本地视角", en: "Local branch view" },
      }),
      createAlert({
        key: "btu-alert-education",
        title: { zh: "培训仍为占位", en: "Education Remains Placeholder" },
        description: { zh: "培训模块仅作为门店上下文入口占位，并未接入真实内容。", en: "Education remains a placeholder entry for branch context and is not connected to live content." },
        tone: "muted",
        sourceModule: "education",
        route: "/demo/education",
        timestampLabel: { zh: "模块占位", en: "Module placeholder" },
      }),
    ],
    "future-branch": [
      createAlert({
        key: "future-branch-alert-foundation",
        title: { zh: "未来门店基础预览", en: "Future Branch Foundation Preview" },
        description: { zh: "该分支展示未来租户/门店基础能力的导航与系统基础层连接点。", en: "This branch highlights future tenant/store foundations through navigation and system foundation previews." },
        tone: "info",
        sourceModule: "system-foundation",
        route: "/system-foundation",
        timestampLabel: { zh: "规划阶段", en: "Planning stage" },
      }),
      createAlert({
        key: "future-branch-alert-data",
        title: { zh: "尚无真实门店数据", en: "No Live Branch Data Yet" },
        description: { zh: "未来门店上下文不连接真实数据库、API、权限或切换持久化。", en: "Future Branch does not connect to a real database, API, permission model, or selector persistence." },
        tone: "muted",
        sourceModule: "branch-context",
        route: "/branches",
        timestampLabel: { zh: "只读占位", en: "Read-only placeholder" },
      }),
    ],
  };

  return alertMap[branch.key];
}

export function getBranchActions(branchKey: string): MeBranchAction[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  const actionMap: Record<MeBranchKey, MeBranchAction[]> = {
    "all-stores": [
      createAction({
        key: "all-stores-open-roles",
        label: { zh: "查看角色工作区", en: "Open Role Workspaces" },
        description: { zh: "按聚合上下文切换查看角色预览入口。", en: "Review role previews from the aggregate branch context." },
        route: "/roles",
        tone: "success",
        isPlaceholder: true,
      }),
      createAction({
        key: "all-stores-open-navigation",
        label: { zh: "查看导航 IA", en: "Open Navigation IA" },
        description: { zh: "确认跨门店预览的可见导航项。", en: "Review which shared navigation items appear in the portfolio preview." },
        route: "/navigation",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "all-stores-open-reports",
        label: { zh: "查看报表预览", en: "Open Reports Preview" },
        route: "/reports",
        tone: "neutral",
        isPlaceholder: true,
      }),
    ],
    kch: [
      createAction({
        key: "kch-open-procurement",
        label: { zh: "打开采购预览", en: "Open Procurement Preview" },
        route: "/psi/procurement",
        tone: "warning",
        isPlaceholder: true,
      }),
      createAction({
        key: "kch-open-supplier",
        label: { zh: "查看供应商协同", en: "Review Supplier Coordination" },
        route: "/psi/supplier",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "kch-open-roles",
        label: { zh: "查看角色上下文", en: "Open Role Context" },
        route: "/roles/store-manager",
        tone: "neutral",
        isPlaceholder: true,
      }),
    ],
    btu: [
      createAction({
        key: "btu-open-inventory",
        label: { zh: "打开库存预览", en: "Open Inventory Preview" },
        route: "/psi/inventory",
        tone: "warning",
        isPlaceholder: true,
      }),
      createAction({
        key: "btu-open-reports",
        label: { zh: "查看门店报表", en: "Review Branch Reports" },
        route: "/reports",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "btu-open-training",
        label: { zh: "查看培训占位", en: "Open Education Placeholder" },
        route: "/demo/education",
        tone: "muted",
        isPlaceholder: true,
      }),
    ],
    "future-branch": [
      createAction({
        key: "future-branch-open-navigation",
        label: { zh: "查看未来导航上下文", en: "Open Future Navigation Context" },
        route: "/navigation",
        tone: "info",
        isPlaceholder: true,
      }),
      createAction({
        key: "future-branch-open-foundation",
        label: { zh: "查看系统基础层", en: "Open System Foundation" },
        route: "/system-foundation",
        tone: "neutral",
        isPlaceholder: true,
      }),
      createAction({
        key: "future-branch-open-branches",
        label: { zh: "返回分支总览", en: "Return To Branch Overview" },
        route: "/branches",
        tone: "muted",
        isPlaceholder: true,
      }),
    ],
  };

  return actionMap[branch.key];
}

export function getBranchRoleLinks(branchKey: string): MeBranchWorkspaceLink[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  return branch.linkedRoles
    .map((roleKey) => {
      const role = getRoleProfileByKey(roleKey);
      if (!role) {
        return null;
      }

      return createLink({
        key: `${branch.key}-${role.key}`,
        label: {
          zh: `${role.name.zh}预览`,
          en: `${role.name.en} Preview`,
        },
        description: {
          zh: `${resolveBranchName(branch, "zh")} 上下文下的角色工作区预览。`,
          en: `${resolveBranchName(branch)} context entry into the ${role.name.en.toLowerCase()} workspace preview.`,
        },
        route: `/roles/${role.key}`,
        tone: role.tone,
      });
    })
    .filter((link): link is MeBranchWorkspaceLink => Boolean(link));
}

export function getBranchPsiLinks(branchKey: string): MeBranchWorkspaceLink[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  const linkMap: Record<MeBranchKey, MeBranchWorkspaceLink[]> = {
    "all-stores": [
      createLink({
        key: "all-stores-psi-workspace",
        label: { zh: "PSI 工作区", en: "PSI Workspace" },
        description: { zh: "跨门店查看 PSI 总体预览。", en: "Portfolio-level PSI workspace preview." },
        route: "/psi",
        tone: "success",
      }),
      createLink({
        key: "all-stores-psi-actions",
        label: { zh: "PSI 动作", en: "PSI Actions" },
        description: { zh: "查看共享动作占位与表单草稿。", en: "Review shared action placeholders and draft forms." },
        route: "/psi/actions",
        tone: "info",
      }),
      createLink({
        key: "all-stores-psi-issues",
        label: { zh: "PSI 问题", en: "PSI Issues" },
        description: { zh: "查看跨门店问题闭环占位。", en: "Open the cross-store issue loop placeholder." },
        route: "/psi/issues",
        tone: "warning",
      }),
    ],
    kch: [
      createLink({
        key: "kch-psi-workspace",
        label: { zh: "KCH PSI 工作区", en: "KCH PSI Workspace" },
        description: { zh: "本地门店 PSI 总览入口。", en: "Local branch entry into the PSI workspace preview." },
        route: "/psi",
        tone: "success",
      }),
      createLink({
        key: "kch-procurement",
        label: { zh: "采购", en: "Procurement" },
        description: { zh: "采购与到货占位。", en: "Procurement and receiving placeholders." },
        route: "/psi/procurement",
        tone: "warning",
      }),
      createLink({
        key: "kch-supplier",
        label: { zh: "供应商", en: "Supplier" },
        description: { zh: "供应商协同和问题跟进。", en: "Supplier coordination and issue follow-up." },
        route: "/psi/supplier",
        tone: "info",
      }),
      createLink({
        key: "kch-inventory",
        label: { zh: "库存", en: "Inventory" },
        description: { zh: "库存风险和补货预览。", en: "Inventory risk and replenishment preview." },
        route: "/psi/inventory",
        tone: "warning",
      }),
    ],
    btu: [
      createLink({
        key: "btu-psi-workspace",
        label: { zh: "BTU PSI 工作区", en: "BTU PSI Workspace" },
        description: { zh: "门店 PSI 共享总览。", en: "Shared PSI overview for the BTU branch context." },
        route: "/psi",
        tone: "success",
      }),
      createLink({
        key: "btu-inventory",
        label: { zh: "库存重点", en: "Inventory Focus" },
        description: { zh: "BTU 以库存和低库存风险为主。", en: "BTU focuses on inventory and low-stock risk." },
        route: "/psi/inventory",
        tone: "warning",
      }),
      createLink({
        key: "btu-issues",
        label: { zh: "问题闭环", en: "Issue Follow-up" },
        description: { zh: "用于查看分支问题占位。", en: "Placeholder issue follow-up for the branch." },
        route: "/psi/issues",
        tone: "info",
      }),
    ],
    "future-branch": [
      createLink({
        key: "future-branch-psi-workspace",
        label: { zh: "PSI 预览入口", en: "PSI Preview Entry" },
        description: { zh: "未来门店仍复用共享 PSI 路由进行预览。", en: "Future Branch continues to reuse the shared PSI routes for preview only." },
        route: "/psi",
        tone: "muted",
      }),
      createLink({
        key: "future-branch-psi-issues",
        label: { zh: "问题占位预览", en: "Issue Placeholder Preview" },
        description: { zh: "问题闭环仅作为未来门店的只读挂接点。", en: "Issue preview acts as a future branch read-only attachment point." },
        route: "/psi/issues",
        tone: "info",
      }),
    ],
  };

  return linkMap[branch.key];
}

export function getBranchReportLinks(branchKey: string): MeBranchWorkspaceLink[] {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return [];
  }

  const linkMap: Record<MeBranchKey, MeBranchWorkspaceLink[]> = {
    "all-stores": [
      createLink({
        key: "all-stores-reports",
        label: { zh: "经营报表", en: "Executive Reports" },
        description: { zh: "查看全部门店共享报表入口。", en: "Open the shared reporting preview from the aggregate context." },
        route: "/reports",
        tone: "success",
      }),
      createLink({
        key: "all-stores-navigation",
        label: { zh: "导航 IA 对照", en: "Navigation IA Cross-Check" },
        description: { zh: "将聚合报表入口与导航 IA 对照查看。", en: "Cross-check aggregate reporting entry points against the navigation IA." },
        route: "/navigation",
        tone: "info",
      }),
    ],
    kch: [
      createLink({
        key: "kch-reports",
        label: { zh: "KCH 报表预览", en: "KCH Reports Preview" },
        description: { zh: "使用共享报表页展示 KCH 视角。", en: "Reuses the shared reports page for the KCH branch view." },
        route: "/reports",
        tone: "success",
      }),
      createLink({
        key: "kch-navigation",
        label: { zh: "导航预览对照", en: "Navigation Preview" },
        description: { zh: "查看 KCH 上下文中的可见导航项。", en: "Review the visible navigation items for KCH." },
        route: "/navigation",
        tone: "info",
      }),
    ],
    btu: [
      createLink({
        key: "btu-reports",
        label: { zh: "BTU 报表预览", en: "BTU Reports Preview" },
        description: { zh: "分店视角的共享报表占位。", en: "Shared reports placeholder from the BTU branch perspective." },
        route: "/reports",
        tone: "success",
      }),
      createLink({
        key: "btu-education",
        label: { zh: "培训占位入口", en: "Education Placeholder Entry" },
        description: { zh: "用于查看 BTU 未来培训上下文。", en: "Entry point for future BTU training context." },
        route: "/demo/education",
        tone: "muted",
      }),
    ],
    "future-branch": [
      createLink({
        key: "future-branch-reports",
        label: { zh: "共享报表占位", en: "Shared Reports Placeholder" },
        description: { zh: "未来门店暂时复用共享 `/reports` 作为报表挂接点。", en: "Future Branch temporarily reuses the shared `/reports` route as its reporting attachment point." },
        route: "/reports",
        tone: "muted",
      }),
      createLink({
        key: "future-branch-foundation",
        label: { zh: "系统基础层预览", en: "System Foundation Preview" },
        description: { zh: "为未来租户/门店基础能力准备的二级入口。", en: "Secondary preview entry for future tenant/store foundations." },
        route: "/system-foundation",
        tone: "info",
      }),
    ],
  };

  return linkMap[branch.key];
}

export async function getBranchWorkspaceData(branchKey: string): Promise<MeBranchWorkspaceData | null> {
  const branch = getBranchProfileByKey(branchKey);
  if (!branch) {
    return null;
  }

  const businessWorkspace = await getBusinessWorkspacePageData();
  const navigationPreview = getBranchNavigationPreview(branchKey);
  if (!navigationPreview) {
    return null;
  }

  return {
    branch,
    title: {
      zh: `${branch.name.zh}上下文预览`,
      en: `${branch.name.en} Context Preview`,
    },
    subtitle: {
      zh: `${branch.description.zh} 当前仅用于 UI/占位说明。`,
      en: `${branch.description.en} UI and placeholder preview only.`,
    },
    metrics: getBranchMetrics(branchKey),
    alerts: getBranchAlerts(branchKey),
    actions: getBranchActions(branchKey),
    roleLinks: getBranchRoleLinks(branchKey),
    psiLinks: getBranchPsiLinks(branchKey),
    reportLinks: getBranchReportLinks(branchKey),
    navigationPreview,
    notice: {
      zh: "门店上下文预览仅用于展示业务工作台、角色、导航、PSI 与报表在分支场景下的样子；不包含真实租户切换、分店数据库、权限控制、会话、API 或写操作。",
      en: "Branch context preview shows how business workspace, roles, navigation, PSI, and reports could look under a branch scenario. No real tenant switching, branch database, permissions, session, API, or writes are connected.",
    },
    generatedAt: businessWorkspace.generatedAt,
  };
}

export function resolveBranchName(branch: MeBranchProfile, locale: MeNavigationLocale = "en"): string {
  return branch.name[locale];
}

export function resolveBranchDescription(branch: MeBranchProfile, locale: MeNavigationLocale = "en"): string {
  return branch.description[locale];
}
