import {
  toPsiHealthScoreWidget,
  toPsiInventoryReportWidgets,
  toPsiIssueReportWidget,
  toPsiLifecycleReportWidget,
  toPsiProcurementReportWidgets,
  toPsiReportDashboardData,
  toPsiSupplierReportWidgets,
} from "@/lib/display-adapters/psi";
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi/inventory-page-data";
import { getPsiIssuesPageData } from "@/lib/page-data/psi/issues-page-data";
import { getPsiProcurementWorkspacePageData } from "@/lib/page-data/psi/procurement-page-data";
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi/supplier-page-data";
import type { PsiReportDashboardData, PsiReportWidgetData } from "@/types/psi";

export type PsiReportModuleCode = "procurement" | "supplier" | "inventory" | "issues" | "health" | "all";

interface PsiReportDashboardPageData {
  widgets: PsiReportWidgetData[];
  dashboardData: PsiReportDashboardData;
  meta: {
    source: string;
    generatedAt: string;
  };
  isMock: boolean;
  error?: string;
}

interface PsiModuleReportPageData {
  moduleCode: PsiReportModuleCode;
  widgets: PsiReportWidgetData[];
  meta: {
    source: string;
    generatedAt: string;
  };
  isMock: boolean;
  error?: string;
}

function mergeMetaSource(...sources: Array<string | undefined>): string {
  const unique = Array.from(new Set(sources.filter(Boolean)));
  return unique.length > 0 ? unique.join("+") : "mock";
}

export async function getPsiReportDashboardPageData(): Promise<PsiReportDashboardPageData> {
  const [procurement, supplier, inventory, issues] = await Promise.all([
    getPsiProcurementWorkspacePageData(),
    getPsiSupplierWorkspacePageData(),
    getPsiInventoryWorkspacePageData(),
    getPsiIssuesPageData(),
  ]);

  const widgets = [
    ...toPsiProcurementReportWidgets(procurement),
    ...toPsiSupplierReportWidgets(supplier),
    ...toPsiInventoryReportWidgets(inventory),
    toPsiIssueReportWidget(issues),
    toPsiLifecycleReportWidget(issues),
    toPsiHealthScoreWidget({ linkedRoute: "/reports" }),
  ];

  const source = mergeMetaSource(procurement.meta.source, supplier.meta.source, inventory.meta.source, issues.meta.source);
  const generatedAt = new Date().toISOString();
  const dashboardData = toPsiReportDashboardData({
    procurementPageData: procurement,
    supplierPageData: supplier,
    inventoryPageData: inventory,
    issuePageData: issues,
    generatedAt,
    metaSource: source,
  });

  const errors = [procurement.error, supplier.error, inventory.error, issues.error].filter(Boolean);

  return {
    widgets,
    dashboardData,
    meta: {
      source,
      generatedAt,
    },
    isMock: widgets.every((widget) => widget.isMock),
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}

export async function getPsiReportWidgetPreviewData(widgetKey: string): Promise<PsiReportWidgetData | null> {
  const pageData = await getPsiReportDashboardPageData();
  return pageData.widgets.find((item) => item.widgetKey === widgetKey) ?? null;
}

export async function getPsiModuleReportPageData(moduleCode: PsiReportModuleCode): Promise<PsiModuleReportPageData> {
  if (moduleCode === "all") {
    const dashboard = await getPsiReportDashboardPageData();
    return {
      moduleCode,
      widgets: dashboard.widgets,
      meta: dashboard.meta,
      isMock: dashboard.isMock,
      error: dashboard.error,
    };
  }

  if (moduleCode === "procurement") {
    const procurement = await getPsiProcurementWorkspacePageData();
    return {
      moduleCode,
      widgets: toPsiProcurementReportWidgets(procurement),
      meta: { source: procurement.meta.source, generatedAt: procurement.meta.generatedAt },
      isMock: procurement.isMock,
      error: procurement.error,
    };
  }

  if (moduleCode === "supplier") {
    const supplier = await getPsiSupplierWorkspacePageData();
    return {
      moduleCode,
      widgets: toPsiSupplierReportWidgets(supplier),
      meta: { source: supplier.meta.source, generatedAt: supplier.meta.generatedAt },
      isMock: supplier.isMock,
      error: supplier.error,
    };
  }

  if (moduleCode === "inventory") {
    const inventory = await getPsiInventoryWorkspacePageData();
    return {
      moduleCode,
      widgets: toPsiInventoryReportWidgets(inventory),
      meta: { source: inventory.meta.source, generatedAt: inventory.meta.generatedAt },
      isMock: inventory.isMock,
      error: inventory.error,
    };
  }

  if (moduleCode === "issues") {
    const issues = await getPsiIssuesPageData();
    return {
      moduleCode,
      widgets: [toPsiIssueReportWidget(issues), toPsiLifecycleReportWidget(issues)],
      meta: { source: issues.meta.source, generatedAt: issues.meta.generatedAt },
      isMock: issues.isMock,
      error: issues.error,
    };
  }

  const now = new Date().toISOString();
  return {
    moduleCode,
    widgets: [toPsiHealthScoreWidget({ linkedRoute: "/reports" })],
    meta: { source: "mock", generatedAt: now },
    isMock: true,
  };
}
