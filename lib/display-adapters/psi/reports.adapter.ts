import type {
  PsiIssuesPageData,
  PsiInventoryWorkspacePageData,
  PsiProcurementWorkspacePageData,
  PsiSupplierWorkspacePageData,
} from "@/lib/page-data/psi";
import type { PsiReportDashboardData, PsiReportListItem, PsiReportMetric, PsiReportMetricTone, PsiReportWidgetData } from "@/types/psi";

interface PsiReportDashboardAdapterParams {
  procurementPageData?: PsiProcurementWorkspacePageData | null;
  supplierPageData?: PsiSupplierWorkspacePageData | null;
  inventoryPageData?: PsiInventoryWorkspacePageData | null;
  issuePageData?: PsiIssuesPageData | null;
  generatedAt?: string;
  metaSource?: string;
}

interface PsiHealthScoreWidgetParams {
  score?: number;
  sourceModule?: string;
  linkedRoute?: string;
  notice?: PsiReportWidgetData["notice"];
}

const BASE_NOTICE = {
  zh: "ME PSI 报表预览仅使用页面层 mock DTO，不执行 BI 引擎、图表引擎、SQL、数据库查询、API 或导出调度。",
  en: "ME PSI report preview uses page-level mock DTOs only; no BI engine, chart engine, SQL, database query, API, export, or scheduling.",
};

function toFixedText(value: number, fraction = 0) {
  return Number.isFinite(value) ? value.toFixed(fraction) : "0";
}

function toneByIssueCount(value: number): PsiReportMetricTone {
  if (value >= 8) return "danger";
  if (value >= 4) return "warning";
  if (value > 0) return "info";
  return "success";
}

function safeMetrics(metrics: PsiReportMetric[] | undefined): PsiReportMetric[] {
  return metrics ?? [];
}

function safeItems(items: PsiReportListItem[] | undefined): PsiReportListItem[] {
  return items ?? [];
}

export function toPsiProcurementReportWidgets(pageData: PsiProcurementWorkspacePageData | null | undefined): PsiReportWidgetData[] {
  const stats = pageData?.pageData?.stats;
  const requests = pageData?.pageData?.purchaseRequests ?? [];
  const orders = pageData?.pageData?.purchaseOrders ?? [];
  const receivingRecords = pageData?.pageData?.receivingRecords ?? [];
  const isMock = pageData?.isMock ?? true;

  const pendingRequestsWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.procurementPendingRequests",
    title: { zh: "采购待处理请求", en: "Procurement Pending Requests" },
    description: { zh: "采购请求待处理数量与等待情况预览。", en: "Preview of pending procurement requests and waiting conditions." },
    kind: "kpi",
    sourceModule: "procurement",
    metrics: safeMetrics([
      {
        key: "pendingRequests",
        label: { zh: "待处理请求", en: "Pending Requests" },
        value: String(stats?.pendingRequests ?? 0),
        tone: toneByIssueCount(stats?.pendingRequests ?? 0),
        sourceModule: "procurement",
        sourceRoute: "/psi/procurement",
      },
      {
        key: "avgAgingHours",
        label: { zh: "平均等待小时", en: "Average Aging (Hours)" },
        value: toFixedText(
          requests.length > 0
            ? requests.reduce((acc, item) => {
                const created = Date.parse(item.requestDate);
                if (Number.isNaN(created)) return acc;
                const ageHours = Math.max((Date.now() - created) / (1000 * 60 * 60), 0);
                return acc + ageHours;
              }, 0) / requests.length
            : 0,
          1,
        ),
        unit: { zh: "小时", en: "hrs" },
        tone: "warning",
        sourceModule: "procurement",
        sourceRoute: "/psi/procurement",
      },
    ]),
    items: safeItems(
      requests.slice(0, 3).map((item) => ({
        key: item.requestId,
        title: { zh: item.requestNo, en: item.requestNo },
        subtitle: { zh: `${item.storeId} · ${item.status}`, en: `${item.storeId} · ${item.status}` },
        value: { zh: `${item.totalAmount.currency} ${item.totalAmount.amount.toFixed(2)}`, en: `${item.totalAmount.currency} ${item.totalAmount.amount.toFixed(2)}` },
        tone: item.status === "pending" ? "warning" : "info",
        route: item.sourceRef.route,
        sourceModule: "procurement",
        sourceRecordId: item.requestId,
      })),
    ),
    summary: {
      zh: "来自采购工作台页面数据的只读摘要。",
      en: "Read-only summary from procurement workspace page data.",
    },
    linkedRoute: "/psi/procurement",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  const receivingTodayWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.receivingToday",
    title: { zh: "采购订单/收货状态", en: "Purchase Order / Receiving Status" },
    description: { zh: "采购订单状态与当日收货数量预览。", en: "Preview of purchase-order status and daily receiving quantities." },
    kind: "status",
    sourceModule: "procurement",
    metrics: safeMetrics([
      {
        key: "purchaseOrders",
        label: { zh: "采购订单总数", en: "Purchase Orders" },
        value: String(stats?.totalOrders ?? orders.length),
        tone: "info",
        sourceModule: "procurement",
      },
      {
        key: "receivingToday",
        label: { zh: "今日收货", en: "Receiving Today" },
        value: String(stats?.receivingToday ?? receivingRecords.length),
        tone: "success",
        sourceModule: "procurement",
      },
    ]),
    items: safeItems(
      orders.slice(0, 3).map((order) => ({
        key: order.orderId,
        title: { zh: order.orderNo, en: order.orderNo },
        subtitle: { zh: `${order.supplierId} · ${order.status}`, en: `${order.supplierId} · ${order.status}` },
        value: { zh: `${order.totalAmount.currency} ${order.totalAmount.amount.toFixed(2)}`, en: `${order.totalAmount.currency} ${order.totalAmount.amount.toFixed(2)}` },
        tone: order.status === "pending" ? "warning" : "info",
        route: "/psi/procurement",
        sourceModule: "procurement",
        sourceRecordId: order.orderId,
      })),
    ),
    summary: { zh: "收货与订单状态为页面级 mock 预览。", en: "Receiving and order status are page-level mock previews." },
    linkedRoute: "/psi/procurement",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  return [pendingRequestsWidget, receivingTodayWidget];
}

export function toPsiSupplierReportWidgets(pageData: PsiSupplierWorkspacePageData | null | undefined): PsiReportWidgetData[] {
  const stats = pageData?.pageData?.stats;
  const issues = pageData?.pageData?.issues ?? [];
  const ratings = pageData?.pageData?.ratings ?? [];
  const isMock = pageData?.isMock ?? true;

  const issueSummaryWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.supplierIssueSummary",
    title: { zh: "供应商问题汇总", en: "Supplier Issue Summary" },
    description: { zh: "供应商问题、优先级与状态预览。", en: "Preview of supplier issues, priorities, and statuses." },
    kind: "issue-summary",
    sourceModule: "supplier",
    metrics: safeMetrics([
      {
        key: "openIssues",
        label: { zh: "未关闭问题", en: "Open Issues" },
        value: String(stats?.issueOpenCount ?? issues.length),
        tone: toneByIssueCount(stats?.issueOpenCount ?? issues.length),
        sourceModule: "supplier",
        sourceRoute: "/psi/supplier",
      },
      {
        key: "reviewSuppliers",
        label: { zh: "待复核供应商", en: "Suppliers In Review" },
        value: String(stats?.reviewSuppliers ?? 0),
        tone: "warning",
        sourceModule: "supplier",
        sourceRoute: "/psi/supplier",
      },
    ]),
    items: safeItems(
      issues.slice(0, 4).map((issue) => ({
        key: issue.issueId,
        title: issue.title,
        subtitle: { zh: `${issue.supplierId} · ${issue.priority}`, en: `${issue.supplierId} · ${issue.priority}` },
        value: { zh: issue.status, en: issue.status },
        tone: issue.priority === "critical" || issue.priority === "high" ? "danger" : "warning",
        route: issue.sourceRef.route,
        sourceModule: "supplier",
        sourceRecordId: issue.issueId,
      })),
    ),
    summary: { zh: "问题摘要来自供应商工作台和 issue placeholder 数据。", en: "Issue summary comes from supplier workspace and issue placeholder data." },
    linkedRoute: "/psi/supplier",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  const ratingPreviewWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.supplierRatingPreview",
    title: { zh: "供应商评分预览", en: "Supplier Rating Preview" },
    description: { zh: "供应商评分均值与等级分布预览。", en: "Preview of supplier rating average and grade distribution." },
    kind: "list",
    sourceModule: "supplier",
    metrics: safeMetrics([
      {
        key: "averageScore",
        label: { zh: "平均评分", en: "Average Score" },
        value: toFixedText(stats?.averageScore ?? 0, 1),
        unit: { zh: "分", en: "pts" },
        tone: (stats?.averageScore ?? 0) >= 80 ? "success" : "warning",
        sourceModule: "supplier",
      },
      {
        key: "activeSuppliers",
        label: { zh: "活跃供应商", en: "Active Suppliers" },
        value: String(stats?.activeSuppliers ?? 0),
        tone: "info",
        sourceModule: "supplier",
      },
    ]),
    items: safeItems(
      ratings.slice(0, 4).map((rating) => ({
        key: rating.ratingId,
        title: { zh: `${rating.supplierId} · 等级 ${rating.grade}`, en: `${rating.supplierId} · Grade ${rating.grade}` },
        subtitle: { zh: `周期 ${rating.period}`, en: `Period ${rating.period}` },
        value: { zh: `${rating.score}`, en: `${rating.score}` },
        tone: rating.grade === "A" ? "success" : rating.grade === "B" ? "info" : "warning",
        route: "/psi/supplier",
        sourceModule: "supplier",
        sourceRecordId: rating.supplierId,
      })),
    ),
    summary: { zh: "评分数据当前为 mock 预览，不触发真实评级引擎。", en: "Rating data is mock preview only and does not trigger a real scoring engine." },
    linkedRoute: "/psi/supplier",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  return [issueSummaryWidget, ratingPreviewWidget];
}

export function toPsiInventoryReportWidgets(pageData: PsiInventoryWorkspacePageData | null | undefined): PsiReportWidgetData[] {
  const stats = pageData?.pageData?.stats;
  const skus = pageData?.pageData?.skus ?? [];
  const suggestions = pageData?.pageData?.replenishmentSuggestions ?? [];
  const stocks = pageData?.pageData?.storeStocks ?? [];
  const isMock = pageData?.isMock ?? true;

  const lowStockRiskWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.inventoryLowStockRisk",
    title: { zh: "库存低库存风险", en: "Inventory Low-Stock Risk" },
    description: { zh: "低库存 SKU 风险摘要预览。", en: "Preview of low-stock SKU risk summary." },
    kind: "risk",
    sourceModule: "inventory",
    metrics: safeMetrics([
      {
        key: "lowStockSkus",
        label: { zh: "低库存 SKU", en: "Low-Stock SKUs" },
        value: String(stats?.lowStockSkus ?? 0),
        tone: toneByIssueCount(stats?.lowStockSkus ?? 0),
        sourceModule: "inventory",
        sourceRoute: "/psi/inventory",
      },
      {
        key: "inventoryIssues",
        label: { zh: "库存问题", en: "Inventory Issues" },
        value: String(stats?.issueOpenCount ?? 0),
        tone: toneByIssueCount(stats?.issueOpenCount ?? 0),
        sourceModule: "inventory",
      },
    ]),
    items: safeItems(
      skus.slice(0, 4).map((sku) => ({
        key: sku.skuId,
        title: { zh: sku.productName, en: sku.productName },
        subtitle: { zh: `${sku.skuCode} · 安全库存 ${sku.safetyStock}`, en: `${sku.skuCode} · Safety ${sku.safetyStock}` },
        tone: sku.status === "active" ? "info" : "muted",
        route: sku.sourceRef.route,
        sourceModule: "inventory",
        sourceRecordId: sku.skuId,
      })),
    ),
    summary: { zh: "风险指标来自库存工作台页面 DTO 聚合。", en: "Risk metrics are aggregated from inventory workspace DTOs." },
    linkedRoute: "/psi/inventory",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  const stockValueWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.inventoryStockValue",
    title: { zh: "库存价值预览", en: "Inventory Stock Value Preview" },
    description: { zh: "基于库存数量和安全库存占位估算的价值预览。", en: "Value preview estimated from stock quantities and safety-stock placeholders." },
    kind: "kpi",
    sourceModule: "inventory",
    metrics: safeMetrics([
      {
        key: "estimatedStockUnits",
        label: { zh: "可用库存单位", en: "Available Stock Units" },
        value: String(stocks.reduce((acc, item) => acc + item.availableQty.value, 0)),
        tone: "info",
        sourceModule: "inventory",
      },
      {
        key: "estimatedStockValue",
        label: { zh: "库存价值占位", en: "Estimated Stock Value" },
        value: toFixedText(
          stocks.reduce((acc, item) => {
            const safety = skus.find((sku) => sku.skuId === item.skuId)?.safetyStock ?? 1;
            return acc + item.availableQty.value * safety * 10;
          }, 0),
          0,
        ),
        unit: { zh: "CNY", en: "CNY" },
        tone: "success",
        description: {
          zh: "仅用于运营预览的估算值，不代表财务口径。",
          en: "Estimated for operations preview only; not a financial accounting value.",
        },
        sourceModule: "inventory",
      },
    ]),
    items: safeItems(
      stocks.slice(0, 3).map((stock) => ({
        key: stock.stockId,
        title: { zh: `${stock.skuId} · ${stock.warehouseId}`, en: `${stock.skuId} · ${stock.warehouseId}` },
        subtitle: { zh: `可用 ${stock.availableQty.value} ${stock.availableQty.unit}`, en: `Available ${stock.availableQty.value} ${stock.availableQty.unit}` },
        value: { zh: `在途 ${stock.inboundQty.value}`, en: `Inbound ${stock.inboundQty.value}` },
        tone: stock.availableQty.value <= 0 ? "danger" : "info",
        route: "/psi/inventory",
        sourceModule: "inventory",
        sourceRecordId: stock.stockId,
      })),
    ),
    summary: { zh: "库存价值为 mock 估算预览，不连接真实财务或库存成本计算。", en: "Stock value is a mock estimate preview without real finance or costing calculations." },
    linkedRoute: "/psi/inventory",
    isMock,
    isPlaceholder: true,
    notice: BASE_NOTICE,
  };

  const replenishmentWidget: PsiReportWidgetData = {
    widgetKey: "widget.psi.replenishmentSuggestions",
    title: { zh: "补货建议汇总", en: "Replenishment Suggestion Summary" },
    description: { zh: "库存补货建议数量和原因预览。", en: "Preview of replenishment suggestion counts and reasons." },
    kind: "table",
    sourceModule: "inventory",
    metrics: safeMetrics([
      {
        key: "replenishmentPending",
        label: { zh: "待处理建议", en: "Pending Suggestions" },
        value: String(stats?.replenishmentPending ?? suggestions.length),
        tone: toneByIssueCount(stats?.replenishmentPending ?? suggestions.length),
        sourceModule: "inventory",
      },
      {
        key: "inboundPending",
        label: { zh: "在途补货", en: "Inbound Pending" },
        value: String(stats?.inboundPending ?? 0),
        tone: "info",
        sourceModule: "inventory",
      },
    ]),
    items: safeItems(
      suggestions.slice(0, 4).map((item) => ({
        key: item.suggestionId,
        title: { zh: `${item.skuId} 建议补货`, en: `${item.skuId} Replenishment` },
        subtitle: { zh: item.reason, en: item.reason },
        value: { zh: `${item.suggestedQty.value} ${item.suggestedQty.unit}`, en: `${item.suggestedQty.value} ${item.suggestedQty.unit}` },
        tone: item.status === "pending" ? "warning" : "info",
        route: item.sourceRef.route,
        sourceModule: "inventory",
        sourceRecordId: item.suggestionId,
      })),
    ),
    summary: { zh: "补货建议仅为页面预览，不创建真实采购任务。", en: "Replenishment suggestions are preview-only and do not create real procurement tasks." },
    linkedRoute: "/psi/inventory",
    isMock,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };

  return [lowStockRiskWidget, stockValueWidget, replenishmentWidget];
}

export function toPsiIssueReportWidget(issuePageData: PsiIssuesPageData | null | undefined): PsiReportWidgetData {
  const rows = issuePageData?.rows ?? [];
  const procurementCount = rows.filter((item) => item.moduleCode === "procurement").length;
  const supplierCount = rows.filter((item) => item.moduleCode === "supplier").length;
  const inventoryCount = rows.filter((item) => item.moduleCode === "inventory").length;

  return {
    widgetKey: "widget.psi.issueSummary",
    title: { zh: "PSI 问题汇总", en: "PSI Issue Summary" },
    description: { zh: "采购、供应商、库存跨模块问题预览。", en: "Cross-module issue preview for procurement, supplier, and inventory." },
    kind: "issue-summary",
    sourceModule: "psi",
    metrics: [
      {
        key: "totalIssues",
        label: { zh: "问题总数", en: "Total Issues" },
        value: String(rows.length),
        tone: toneByIssueCount(rows.length),
        sourceModule: "psi",
        sourceRoute: "/psi/issues",
      },
      {
        key: "moduleSpread",
        label: { zh: "模块覆盖", en: "Module Spread" },
        value: `${procurementCount}/${supplierCount}/${inventoryCount}`,
        description: { zh: "采购/供应商/库存", en: "Procurement/Supplier/Inventory" },
        tone: "info",
        sourceModule: "psi",
      },
    ],
    items: rows.slice(0, 6).map((row) => ({
      key: row.issueId,
      title: { zh: row.title, en: row.title },
      subtitle: { zh: `${row.moduleCode} · ${row.priority}`, en: `${row.moduleCode} · ${row.priority}` },
      value: { zh: row.status, en: row.status },
      tone: row.priority === "critical" || row.priority === "high" ? "danger" : "warning",
      route: row.detailHref,
      sourceModule: row.moduleCode,
      sourceRecordId: row.issueId,
    })),
    summary: { zh: "跨模块 issue 数据来自 PSI issues page-data helper。", en: "Cross-module issue data comes from PSI issues page-data helper." },
    linkedRoute: "/psi/issues",
    isMock: issuePageData?.isMock ?? true,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };
}

export function toPsiLifecycleReportWidget(issuePageData: PsiIssuesPageData | null | undefined): PsiReportWidgetData {
  const rows = issuePageData?.rows ?? [];
  const stageCounts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.lifecycleStage] = (acc[row.lifecycleStage] ?? 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(stageCounts);

  return {
    widgetKey: "widget.psi.lifecycleSummary",
    title: { zh: "PSI 生命周期摘要", en: "PSI Lifecycle Summary" },
    description: { zh: "问题生命周期阶段分布预览。", en: "Preview of issue lifecycle stage distribution." },
    kind: "timeline-summary",
    sourceModule: "psi",
    metrics: [
      {
        key: "lifecycleStageCount",
        label: { zh: "阶段数量", en: "Lifecycle Stages" },
        value: String(entries.length),
        tone: "info",
        sourceModule: "psi",
      },
      {
        key: "issuesTracked",
        label: { zh: "追踪问题数", en: "Issues Tracked" },
        value: String(rows.length),
        tone: toneByIssueCount(rows.length),
        sourceModule: "psi",
      },
    ],
    items: entries.slice(0, 6).map(([stage, count]) => ({
      key: stage,
      title: { zh: stage, en: stage },
      value: { zh: `${count} 条`, en: `${count} records` },
      tone: count >= 4 ? "warning" : "info",
      route: "/psi/issues",
      sourceModule: "psi",
    })),
    summary: { zh: "生命周期阶段来自 issue page-data 的只读聚合。", en: "Lifecycle stages are read-only aggregates from issue page-data." },
    linkedRoute: "/psi/issues",
    isMock: issuePageData?.isMock ?? true,
    isPlaceholder: false,
    notice: BASE_NOTICE,
  };
}

export function toPsiHealthScoreWidget(params?: PsiHealthScoreWidgetParams): PsiReportWidgetData {
  const score = params?.score ?? 78;
  const tone: PsiReportMetricTone = score >= 85 ? "success" : score >= 70 ? "info" : "warning";

  return {
    widgetKey: "widget.psi.healthScore",
    title: { zh: "PSI 健康评分占位", en: "PSI Health Score Placeholder" },
    description: { zh: "用于未来 BI 评分模型的占位指标。", en: "Placeholder metric for a future BI scoring model." },
    kind: "health-score",
    sourceModule: params?.sourceModule ?? "psi",
    metrics: [
      {
        key: "healthScore",
        label: { zh: "健康评分", en: "Health Score" },
        value: toFixedText(score, 0),
        unit: { zh: "分", en: "pts" },
        tone,
        description: {
          zh: "当前为 mock 占位评分，不执行真实模型计算。",
          en: "Current score is a mock placeholder and does not execute a real model.",
        },
        sourceModule: params?.sourceModule ?? "psi",
      },
    ],
    items: [
      {
        key: "health-placeholder",
        title: { zh: "评分输入", en: "Score Inputs" },
        subtitle: { zh: "采购/供应商/库存/问题聚合占位", en: "Procurement/Supplier/Inventory/Issue aggregate placeholder" },
        value: { zh: "只读预览", en: "Read-only preview" },
        tone: "muted",
        sourceModule: params?.sourceModule ?? "psi",
      },
    ],
    summary: { zh: "健康评分尚未接入 BI 或规则引擎。", en: "Health score is not connected to BI or rule engines yet." },
    linkedRoute: params?.linkedRoute ?? "/reports",
    isMock: true,
    isPlaceholder: true,
    notice: params?.notice ?? BASE_NOTICE,
  };
}

export function toPsiReportDashboardData(params: PsiReportDashboardAdapterParams): PsiReportDashboardData {
  const procurementWidgets = toPsiProcurementReportWidgets(params.procurementPageData);
  const supplierWidgets = toPsiSupplierReportWidgets(params.supplierPageData);
  const inventoryWidgets = toPsiInventoryReportWidgets(params.inventoryPageData);
  const issueWidget = toPsiIssueReportWidget(params.issuePageData);
  const lifecycleWidget = toPsiLifecycleReportWidget(params.issuePageData);
  const healthWidget = toPsiHealthScoreWidget({ linkedRoute: "/reports" });

  return {
    title: { zh: "ME PSI 运营报表预览", en: "ME PSI Operations Report Preview" },
    subtitle: {
      zh: "采购 / 供应商 / 库存业务 mock 数据看板预览（只读）",
      en: "Read-only dashboard preview for Procurement / Supplier / Inventory mock business data",
    },
    widgets: [
      ...procurementWidgets,
      ...supplierWidgets,
      ...inventoryWidgets,
      issueWidget,
      lifecycleWidget,
      healthWidget,
    ],
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    metaSource: params.metaSource ?? "mock",
    notice: BASE_NOTICE,
  };
}
