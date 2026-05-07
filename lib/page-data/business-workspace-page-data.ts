import { getPsiReportDashboardPageData } from "@/lib/page-data/psi";
import type {
  BusinessWorkspaceAction,
  BusinessWorkspaceAlert,
  BusinessWorkspaceModuleCard,
  BusinessWorkspacePageData,
  BusinessWorkspaceTone,
} from "@/types/business-workspace";
import type { PsiReportWidgetData } from "@/types/psi";

function findWidget(widgets: PsiReportWidgetData[], widgetKey: string) {
  return widgets.find((widget) => widget.widgetKey === widgetKey);
}

function findMetricValue(widget: PsiReportWidgetData | undefined, metricKey: string, fallback: string) {
  const metric = widget?.metrics.find((item) => item.key === metricKey);
  return metric?.value ?? fallback;
}

function parseIntSafe(input: string, fallback = 0) {
  const value = Number.parseInt(input, 10);
  return Number.isNaN(value) ? fallback : value;
}

function riskToneByCount(value: number): BusinessWorkspaceTone {
  if (value >= 12) return "danger";
  if (value >= 6) return "warning";
  if (value >= 1) return "info";
  return "success";
}

function moduleCards(params: {
  pendingProcurement: number;
  inventoryRisk: number;
  supplierIssues: number;
  healthScore: string;
}): BusinessWorkspaceModuleCard[] {
  return [
    {
      key: "psi-workspace",
      title: { zh: "PSI 工作区", en: "PSI Workspace" },
      description: { zh: "采购、供应商、库存一体化运营视图。", en: "Integrated procurement, supplier, and inventory operations view." },
      status: "healthy",
      tone: "info",
      route: "/psi",
      primaryMetric: { zh: `健康分 ${params.healthScore}`, en: `Health ${params.healthScore}` },
      secondaryMetric: { zh: `待处理采购 ${params.pendingProcurement}`, en: `Pending procurement ${params.pendingProcurement}` },
      actionLabel: { zh: "进入 PSI", en: "Open PSI" },
    },
    {
      key: "procurement",
      title: { zh: "采购", en: "Procurement" },
      description: { zh: "采购请求与收货状态聚合视图", en: "Aggregated view for procurement requests and receiving status." },
      status: params.pendingProcurement >= 8 ? "action-needed" : "watch",
      tone: params.pendingProcurement >= 8 ? "warning" : "info",
      route: "/psi/procurement",
      primaryMetric: { zh: `待处理 ${params.pendingProcurement}`, en: `Pending ${params.pendingProcurement}` },
      actionLabel: { zh: "查看采购", en: "View procurement" },
    },
    {
      key: "supplier",
      title: { zh: "供应商", en: "Supplier" },
      description: { zh: "供应商问题与评分汇总。", en: "Supplier issue and rating summary." },
      status: params.supplierIssues >= 4 ? "risk" : "watch",
      tone: riskToneByCount(params.supplierIssues),
      route: "/psi/supplier",
      primaryMetric: { zh: `问题 ${params.supplierIssues}`, en: `Issues ${params.supplierIssues}` },
      actionLabel: { zh: "查看供应商", en: "View suppliers" },
    },
    {
      key: "inventory",
      title: { zh: "库存", en: "Inventory" },
      description: { zh: "低库存风险与补货建议视图", en: "Low-stock risk and replenishment suggestion view." },
      status: params.inventoryRisk >= 8 ? "risk" : "watch",
      tone: riskToneByCount(params.inventoryRisk),
      route: "/psi/inventory",
      primaryMetric: { zh: `低库存 SKU ${params.inventoryRisk}`, en: `Low-stock SKUs ${params.inventoryRisk}` },
      actionLabel: { zh: "查看库存", en: "View inventory" },
    },
    {
      key: "reports",
      title: { zh: "报表", en: "Reports" },
      description: { zh: "跨模块 PSI 报表入口", en: "Cross-module PSI reporting entry." },
      status: "healthy",
      tone: "success",
      route: "/reports",
      primaryMetric: { zh: "已接入 PSI 工作区", en: "PSI workspace linked" },
      actionLabel: { zh: "打开报表", en: "Open reports" },
    },
    {
      key: "branches",
      title: { zh: "门店", en: "Branches" },
      description: { zh: "门店上下文、运行状态与关联模块视图", en: "Branch context, operations status, and linked module view." },
      status: "healthy",
      tone: "success",
      route: "/branches",
      primaryMetric: { zh: "KCH / BTU / HQ", en: "KCH / BTU / HQ" },
      secondaryMetric: { zh: "门店运营视图", en: "Store operations view" },
      actionLabel: { zh: "打开门店", en: "Open branches" },
    },
    {
      key: "staff",
      title: { zh: "员工 / HR", en: "Staff / HR" },
      description: { zh: "员工名单、技能矩阵与门店分配视图", en: "Roster, skill matrix, and branch assignment view." },
      status: "watch",
      tone: "info",
      route: "/staff",
      primaryMetric: { zh: "人员工作区", en: "People workspace" },
      secondaryMetric: { zh: "培训 / 排班联动", en: "Training / roster linkage" },
      actionLabel: { zh: "打开员工", en: "Open staff" },
    },
    {
      key: "schedule",
      title: { zh: "排班", en: "Schedule" },
      description: { zh: "周排班、站位覆盖与缺口视图", en: "Weekly roster, duty-station coverage, and gap view." },
      status: "watch",
      tone: "warning",
      route: "/schedule",
      primaryMetric: { zh: "3 个覆盖缺口", en: "3 coverage gaps" },
      secondaryMetric: { zh: "无自动排班", en: "No auto roster" },
      actionLabel: { zh: "打开排班", en: "Open schedule" },
    },
    {
      key: "tasks",
      title: { zh: "任务", en: "Tasks" },
      description: { zh: "门店执行任务、来源链接与状态队列", en: "Store execution tasks, source links, and status queue." },
      status: "watch",
      tone: "neutral",
      route: "/tasks",
      primaryMetric: { zh: "闭环任务工作区", en: "Close-loop task workspace" },
      actionLabel: { zh: "查看任务", en: "Open tasks" },
    },
    {
      key: "training",
      title: { zh: "培训", en: "Training" },
      description: { zh: "课程、技能差距与记录完成度视图", en: "Courses, skill gaps, and record completion view." },
      status: "watch",
      tone: "info",
      route: "/training",
      primaryMetric: { zh: "技能差距 8", en: "Skill gaps 8" },
      actionLabel: { zh: "打开培训", en: "Open training" },
    },
    {
      key: "pos-report",
      title: { zh: "POS 报表", en: "POS Report" },
      description: { zh: "销售日报、门店波动与导出规划总览。", en: "Daily sales, branch variance, and export planning overview." },
      status: "watch",
      tone: "info",
      route: "/reports/pos",
      primaryMetric: { zh: "POS 快照", en: "POS snapshot" },
      actionLabel: { zh: "打开 POS 报表", en: "Open POS reports" },
    },
    {
      key: "inspection",
      title: { zh: "巡检", en: "Inspection" },
      description: { zh: "检查表、发现与门店分数视图", en: "Checklists, findings, and branch score view." },
      status: "watch",
      tone: "warning",
      route: "/inspection",
      primaryMetric: { zh: "3 条发现", en: "3 findings" },
      actionLabel: { zh: "打开巡检", en: "Open inspection" },
    },
    {
      key: "finance",
      title: { zh: "财务 / 成本", en: "Finance / Costing" },
      description: { zh: "产品成本、毛利与供应商成本视图", en: "Product cost, margin, and supplier cost view." },
      status: "watch",
      tone: "info",
      route: "/finance",
      primaryMetric: { zh: "毛利视图", en: "Margin view" },
      actionLabel: { zh: "打开财务", en: "Open finance" },
    },
  ];
}

function alerts(params: {
  pendingProcurement: number;
  inventoryRisk: number;
  supplierIssues: number;
  generatedAt: string;
}): BusinessWorkspaceAlert[] {
  return [
    {
      key: "alert-procurement-pending",
      title: { zh: "采购待处理请求关注", en: "Procurement Pending Requests Watch" },
      description: { zh: `当前待处理采购请求 ${params.pendingProcurement} 条。`, en: `${params.pendingProcurement} procurement requests are pending review.` },
      tone: riskToneByCount(params.pendingProcurement),
      sourceModule: "procurement",
      route: "/psi/procurement",
      timestampLabel: { zh: `更新于 ${params.generatedAt}`, en: `Updated at ${params.generatedAt}` },
    },
    {
      key: "alert-inventory-low-stock",
      title: { zh: "库存低库存风险", en: "Inventory Low-Stock Risk" },
      description: { zh: `当前低库存 SKU ${params.inventoryRisk} 个。`, en: `${params.inventoryRisk} SKUs are currently in low-stock risk.` },
      tone: riskToneByCount(params.inventoryRisk),
      sourceModule: "inventory",
      route: "/psi/inventory",
      timestampLabel: { zh: "来自库存报表聚合", en: "From inventory report aggregation" },
    },
    {
      key: "alert-supplier-issues",
      title: { zh: "供应商问题跟进", en: "Supplier Issues Follow-up" },
      description: { zh: `供应商侧未关闭问题 ${params.supplierIssues} 条。`, en: `${params.supplierIssues} supplier issues remain open.` },
      tone: riskToneByCount(params.supplierIssues),
      sourceModule: "supplier",
      route: "/psi/supplier",
      timestampLabel: { zh: "来自供应商问题摘要", en: "From supplier issue summary" },
    },
  ];
}

function actionsList(): BusinessWorkspaceAction[] {
  return [
    {
      key: "action-open-psi",
      label: { zh: "打开 PSI 工作区", en: "Open PSI Workspace" },
      description: { zh: "查看采购、供应商、库存一体化状态。", en: "View integrated procurement, supplier, and inventory status." },
      route: "/psi",
      tone: "info",
      sourceModule: "psi",
      isPlaceholder: true,
    },
    {
      key: "action-open-reports",
      label: { zh: "查看报表中心", en: "Open Report Center" },
      description: { zh: "进入 PSI 报表聚合看板。", en: "Open the PSI report aggregation workspace." },
      route: "/reports",
      tone: "success",
      sourceModule: "reports",
      isPlaceholder: true,
    },
    {
      key: "action-open-tasks",
      label: { zh: "查看任务工作区", en: "Open Task Workspace" },
      description: { zh: "查看任务队列、来源模块与状态看板。", en: "Review task queue, source modules, and status board." },
      route: "/tasks",
      tone: "muted",
      sourceModule: "task",
      isPlaceholder: true,
    },
    {
      key: "action-open-staff",
      label: { zh: "打开员工 / HR", en: "Open Staff / HR" },
      description: { zh: "查看员工名单、技能矩阵与门店分配。", en: "Review roster, skill matrix, and branch assignment." },
      route: "/staff",
      tone: "info",
      sourceModule: "staff",
      isPlaceholder: true,
    },
    {
      key: "action-open-schedule",
      label: { zh: "打开排班", en: "Open Schedule" },
      description: { zh: "查看周排班、岗位覆盖与缺口。", en: "Open weekly roster, station coverage, and gap review." },
      route: "/schedule",
      tone: "warning",
      sourceModule: "schedule",
      isPlaceholder: true,
    },
    {
      key: "action-open-foundation",
      label: { zh: "系统基础能力", en: "System Foundation" },
      description: { zh: "查看元数据合同与平台基础页面。", en: "Review metadata contracts and platform foundation pages." },
      route: "/system-foundation",
      tone: "neutral",
      sourceModule: "foundation",
      isPlaceholder: true,
    },
  ];
}

export async function getBusinessWorkspacePageData(): Promise<BusinessWorkspacePageData> {
  const psiReport = await getPsiReportDashboardPageData();
  const widgets = psiReport.dashboardData.widgets;

  const procurementWidget = findWidget(widgets, "widget.psi.procurementPendingRequests");
  const inventoryWidget = findWidget(widgets, "widget.psi.inventoryLowStockRisk");
  const supplierWidget = findWidget(widgets, "widget.psi.supplierIssueSummary");
  const healthWidget = findWidget(widgets, "widget.psi.healthScore");

  const pendingProcurement = parseIntSafe(findMetricValue(procurementWidget, "pendingRequests", "0"));
  const inventoryRisk = parseIntSafe(findMetricValue(inventoryWidget, "lowStockSkus", "0"));
  const supplierIssues = parseIntSafe(findMetricValue(supplierWidget, "openIssues", "0"));
  const healthScore = findMetricValue(healthWidget, "healthScore", "78");

  return {
    title: { zh: "ME 业务工作台", en: "ME Business Workspace" },
    subtitle: { zh: "模块化门店运营平台", en: "Modular Store Operations Platform" },
    generatedAt: psiReport.meta.generatedAt,
    metrics: [
      {
        key: "today-operations-overview",
        label: { zh: "今日运营总览", en: "Today Operations Overview" },
        value: String(pendingProcurement + inventoryRisk + supplierIssues),
        unit: { zh: "项", en: "items" },
        tone: "info",
        description: { zh: "来自采购、库存、供应商关键指标聚合。", en: "Aggregated from procurement, inventory, and supplier key indicators." },
        route: "/reports",
      },
      {
        key: "procurement-pending",
        label: { zh: "采购待处理", en: "Procurement Pending" },
        value: String(pendingProcurement),
        unit: { zh: "条", en: "req" },
        tone: riskToneByCount(pendingProcurement),
        description: { zh: "待处理采购请求数量。", en: "Current pending procurement request count." },
        route: "/psi/procurement",
      },
      {
        key: "inventory-risk",
        label: { zh: "库存风险", en: "Inventory Risk" },
        value: String(inventoryRisk),
        unit: { zh: "SKU", en: "SKU" },
        tone: riskToneByCount(inventoryRisk),
        description: { zh: "低库存 SKU 风险数。", en: "Low-stock SKU risk count." },
        route: "/psi/inventory",
      },
      {
        key: "supplier-issues",
        label: { zh: "供应商问题", en: "Supplier Issues" },
        value: String(supplierIssues),
        unit: { zh: "条", en: "issues" },
        tone: riskToneByCount(supplierIssues),
        description: { zh: "供应商问题未关闭数量。", en: "Open supplier issue count." },
        route: "/psi/supplier",
      },
      {
        key: "psi-health-score",
        label: { zh: "PSI 健康评分", en: "PSI Health Score" },
        value: healthScore,
        unit: { zh: "分", en: "pts" },
        tone: Number(healthScore) >= 85 ? "success" : Number(healthScore) >= 70 ? "info" : "warning",
        description: { zh: "当前窗口下的 PSI 健康视图。", en: "Current PSI health view for the active reporting window." },
        route: "/reports",
      },
    ],
    modules: moduleCards({ pendingProcurement, inventoryRisk, supplierIssues, healthScore }),
    alerts: alerts({ pendingProcurement, inventoryRisk, supplierIssues, generatedAt: psiReport.meta.generatedAt }),
    actions: actionsList(),
    systemFoundationLinks: [
      { key: "layout-engine", label: { zh: "Layout Engine", en: "Layout Engine" }, route: "/layout-engine" },
      { key: "action-contracts", label: { zh: "Action Contracts", en: "Action Contracts" }, route: "/action-contracts" },
      { key: "access-control", label: { zh: "Access Control", en: "Access Control" }, route: "/access-control" },
      { key: "audit-trail", label: { zh: "Audit Trail", en: "Audit Trail" }, route: "/audit-trail" },
      { key: "workflow", label: { zh: "Workflow", en: "Workflow" }, route: "/workflow" },
      { key: "notifications", label: { zh: "Notifications", en: "Notifications" }, route: "/notifications" },
      { key: "reports", label: { zh: "Reports", en: "Reports" }, route: "/reports" },
      { key: "rules", label: { zh: "Rules", en: "Rules" }, route: "/rules" },
      { key: "packages", label: { zh: "Packages", en: "Packages" }, route: "/packages" },
    ],
    notice: {
      zh: "当前页面提供面向门店与总部的业务可视化工作台；审批、过账、通知与自动化能力仍在后续阶段交付。",
      en: "This workspace provides operational visibility for branch and head-office teams. Approvals, posting, notifications, and automation remain in later release phases.",
    },
  };
}
