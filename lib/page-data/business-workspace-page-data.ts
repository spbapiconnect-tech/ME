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
      description: { zh: "采购、供应商、库存一体化运营视图（只读）", en: "Integrated procurement, supplier, and inventory operations view (read-only)." },
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
      description: { zh: "采购请求与收货状态聚合预览", en: "Aggregated preview for procurement requests and receiving status." },
      status: params.pendingProcurement >= 8 ? "action-needed" : "watch",
      tone: params.pendingProcurement >= 8 ? "warning" : "info",
      route: "/psi/procurement",
      primaryMetric: { zh: `待处理 ${params.pendingProcurement}`, en: `Pending ${params.pendingProcurement}` },
      actionLabel: { zh: "查看采购", en: "View procurement" },
    },
    {
      key: "supplier",
      title: { zh: "供应商", en: "Supplier" },
      description: { zh: "供应商问题与评分只读汇总", en: "Read-only supplier issue and rating summary." },
      status: params.supplierIssues >= 4 ? "risk" : "watch",
      tone: riskToneByCount(params.supplierIssues),
      route: "/psi/supplier",
      primaryMetric: { zh: `问题 ${params.supplierIssues}`, en: `Issues ${params.supplierIssues}` },
      actionLabel: { zh: "查看供应商", en: "View suppliers" },
    },
    {
      key: "inventory",
      title: { zh: "库存", en: "Inventory" },
      description: { zh: "低库存风险与补货建议预览", en: "Low-stock risk and replenishment suggestion preview." },
      status: params.inventoryRisk >= 8 ? "risk" : "watch",
      tone: riskToneByCount(params.inventoryRisk),
      route: "/psi/inventory",
      primaryMetric: { zh: `低库存 SKU ${params.inventoryRisk}`, en: `Low-stock SKUs ${params.inventoryRisk}` },
      actionLabel: { zh: "查看库存", en: "View inventory" },
    },
    {
      key: "reports",
      title: { zh: "报表", en: "Reports" },
      description: { zh: "跨模块 PSI 报表预览入口", en: "Cross-module PSI reporting preview entry." },
      status: "healthy",
      tone: "success",
      route: "/reports",
      primaryMetric: { zh: "已接入 PSI 预览", en: "PSI preview enabled" },
      actionLabel: { zh: "打开报表", en: "Open reports" },
    },
    {
      key: "tasks",
      title: { zh: "任务", en: "Tasks" },
      description: { zh: "门店执行任务入口（当前为占位/只读）", en: "Store execution task entry (placeholder/read-only for now)." },
      status: "placeholder",
      tone: "muted",
      route: "/tasks",
      primaryMetric: { zh: "执行联动占位", en: "Execution linkage placeholder" },
      actionLabel: { zh: "查看任务", en: "Open tasks" },
    },
    {
      key: "education",
      title: { zh: "培训", en: "Education" },
      description: { zh: "培训进度模块占位，暂未接入真实数据", en: "Training progress module placeholder with no live data connection yet." },
      status: "placeholder",
      tone: "muted",
      route: "/modules/education",
      primaryMetric: { zh: "进度占位", en: "Progress placeholder" },
      actionLabel: { zh: "查看模块", en: "View module" },
    },
    {
      key: "pos-report",
      title: { zh: "POS 报表", en: "POS Report" },
      description: { zh: "销售快照占位，后续接入真实 POS 数据", en: "Sales snapshot placeholder for future POS data integration." },
      status: "placeholder",
      tone: "muted",
      route: "/modules/pos-report",
      primaryMetric: { zh: "报表占位", en: "Snapshot placeholder" },
      actionLabel: { zh: "查看模块", en: "View module" },
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
      label: { zh: "查看报表预览", en: "Open Report Preview" },
      description: { zh: "进入 PSI 报表聚合看板（只读）。", en: "Open read-only PSI report aggregation dashboard." },
      route: "/reports",
      tone: "success",
      sourceModule: "reports",
      isPlaceholder: true,
    },
    {
      key: "action-open-tasks",
      label: { zh: "查看任务占位", en: "View Task Placeholder" },
      description: { zh: "当前仅展示任务入口与占位信息。", en: "Currently shows task entry and placeholder information only." },
      route: "/tasks",
      tone: "muted",
      sourceModule: "task",
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
        description: { zh: "仅为 mock 健康评分预览。", en: "Mock health score preview only." },
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
      zh: "当前页面仅提供业务工作台 UI 与 PSI mock 数据只读预览；不连接数据库/API，不执行写入、权限校验、审批、通知或工作流。",
      en: "This page provides a business workspace UI with read-only PSI mock previews only; no database/API, write actions, permission enforcement, approvals, notifications, or workflow execution.",
    },
  };
}
