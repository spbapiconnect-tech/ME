import { dashboardLayoutCatalog, dashboardLayoutCatalogByKey, reportWidgetRegistry, reportWidgetRegistryByKey } from "@/config/reports";
import type {
  DashboardLayoutContract,
  ReportWidgetContract,
  ReportWidgetPreview,
  ReportWidgetSeverity,
  ReportWidgetStatus,
  ReportWidgetType,
} from "@/types/report-widget";
import type { SupportedLocale } from "@/types/module";

function buildText(zh: string, en: string) {
  return { zh, en };
}

function isHardBlockedStatus(status: ReportWidgetStatus) {
  return status === "placeholder" || status === "coming-soon" || status === "blocked" || status === "disabled";
}

export function getReportWidgetByKey(widgetKey: string): ReportWidgetContract | undefined {
  return reportWidgetRegistryByKey[widgetKey];
}

export function getWidgetsByType(widgetType: ReportWidgetType): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.widgetType === widgetType);
}

export function getWidgetsBySourceModule(sourceModule: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.sourceModule === sourceModule);
}

export function getWidgetsByStatus(status: ReportWidgetStatus): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.status === status);
}

export function getWidgetsBySeverity(severity: ReportWidgetSeverity): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.severity === severity);
}

export function getWidgetsByActionKey(actionKey: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.actionKey === actionKey);
}

export function getWidgetsByAccessRuleKey(accessRuleKey: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.accessRuleKey === accessRuleKey);
}

export function getWidgetsByAuditEventKey(auditEventKey: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.auditEventKey === auditEventKey);
}

export function getWidgetsByWorkflowKey(workflowKey: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.workflowKey === workflowKey);
}

export function getWidgetsByNotificationKey(notificationKey: string): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.source.notificationKey === notificationKey);
}

export function getExportableWidgets(): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.requirement.exportable);
}

export function getRefreshableWidgets(): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.requirement.refreshable);
}

export function getDrillDownWidgets(): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.requirement.drillDownEnabled);
}

export function getPlaceholderWidgets(): ReportWidgetContract[] {
  return reportWidgetRegistry.filter((item) => item.requirement.isPlaceholder || isHardBlockedStatus(item.status));
}

export function getDashboardLayoutByKey(layoutKey: string): DashboardLayoutContract | undefined {
  return dashboardLayoutCatalogByKey[layoutKey];
}

export function getDashboardLayoutsByRole(role: string): DashboardLayoutContract[] {
  return dashboardLayoutCatalog.filter((item) => item.targetRole === role || !item.targetRole);
}

export function getDashboardWidgets(layoutOrKey: string | DashboardLayoutContract): ReportWidgetContract[] {
  const layout = typeof layoutOrKey === "string" ? getDashboardLayoutByKey(layoutOrKey) : layoutOrKey;
  if (!layout) return [];
  return layout.widgets.map((widgetKey) => getReportWidgetByKey(widgetKey)).filter((item): item is ReportWidgetContract => Boolean(item));
}

export function getReportWidgetPreview(widgetOrKey: string | ReportWidgetContract): ReportWidgetPreview {
  const widget = typeof widgetOrKey === "string" ? getReportWidgetByKey(widgetOrKey) : widgetOrKey;

  if (!widget) {
    return {
      widgetKey: typeof widgetOrKey === "string" ? widgetOrKey : "unknown",
      canRender: false,
      status: "blocked",
      severity: "medium",
      title: buildText("未找到报表组件", "Report widget not found"),
      reason: buildText("找不到对应组件合同，无法预览。", "Widget contract cannot be found for preview."),
      sourceModule: "unknown",
      metricCount: 0,
      filterCount: 0,
      exportable: false,
      refreshable: false,
      drillDownEnabled: false,
      placeholderNotice: buildText(
        "当前仅支持报表组件元数据预览，不执行真实报表查询。",
        "Only report widget metadata preview is supported; no real report query is executed.",
      ),
    };
  }

  const hardBlocked = isHardBlockedStatus(widget.status);
  const previewOnlyBlocked = widget.status === "preview-only" && !widget.samplePreviewEnabled;
  const canRender = widget.status === "active" || (widget.status === "preview-only" && widget.samplePreviewEnabled === true);

  let reason = buildText("当前可进行元数据预览。", "Metadata preview is available.");
  if (hardBlocked) {
    reason = buildText("当前组件状态不可渲染，仅保留合同元数据。", "Widget status is not renderable and remains contract metadata only.");
  } else if (previewOnlyBlocked) {
    reason = buildText("当前组件保留为已配置状态，尚未开放可视化渲染。", "Widget remains in a configured state and is not yet open for visual rendering.");
  } else if (widget.status === "preview-only") {
    reason = buildText("当前组件以目录渲染方式展示，不连接真实查询。", "Widget renders in catalog mode and is not connected to real queries.");
  }

  return {
    widgetKey: widget.key,
    canRender,
    status: widget.status,
    severity: widget.severity,
    title: widget.title,
    reason,
    sourceModule: widget.source.sourceModule,
    metricCount: widget.metrics.length,
    filterCount: widget.filters.length,
    exportable: widget.requirement.exportable,
    refreshable: widget.requirement.refreshable,
    drillDownEnabled: widget.requirement.drillDownEnabled,
    placeholderNotice:
      hardBlocked || previewOnlyBlocked || widget.requirement.isPlaceholder
        ? buildText(
            "仅提供 Dashboard/Report 组件元数据，不执行真实 BI 图表引擎、SQL、数据库查询、API 调用、导出或调度。",
            "Provides dashboard/report widget metadata only; no real BI engine, SQL, database query, API call, export, or scheduling is executed.",
          )
        : buildText(
            "可渲染状态仅代表元数据预览，不代表真实数据执行能力。",
            "Renderable status indicates metadata preview only, not real data execution capability.",
          ),
  };
}

export function resolveReportWidgetTitle(widget: ReportWidgetContract, locale: SupportedLocale): string {
  return locale === "zh" ? widget.title.zh : widget.title.en;
}

export function resolveReportWidgetDescription(widget: ReportWidgetContract, locale: SupportedLocale): string | undefined {
  if (!widget.description) return undefined;
  return locale === "zh" ? widget.description.zh : widget.description.en;
}

export { reportWidgetRegistry, dashboardLayoutCatalog };
