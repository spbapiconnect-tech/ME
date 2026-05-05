import type { LocalizedText } from "@/types/module";

export type ReportWidgetType =
  | "kpi"
  | "chart"
  | "table"
  | "list"
  | "status-summary"
  | "trend"
  | "distribution"
  | "alert"
  | "task-summary"
  | "workflow-summary"
  | "notification-summary"
  | "audit-summary"
  | "placeholder";

export type ReportWidgetStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "blocked" | "disabled";

export type ReportWidgetSeverity = "neutral" | "low" | "medium" | "high" | "critical";

export type ReportWidgetSize = "sm" | "md" | "lg" | "xl" | "full";

export type ReportMetricFormat = "number" | "currency" | "percentage" | "duration" | "date" | "text" | "count";

export type ReportDataSourceType =
  | "service-placeholder"
  | "repository-placeholder"
  | "mock"
  | "api-placeholder"
  | "database-placeholder"
  | "external-placeholder";

export interface ReportWidgetSource {
  sourceModule: string;
  sourcePage?: string;
  sourceRoute?: string;
  sourceComponent?: string;
  sourceService?: string;
  sourceRepository?: string;
  sourceDataset?: string;
  dataSourceType?: ReportDataSourceType;
  actionKey?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  workflowKey?: string;
  notificationKey?: string;
}

export type ReportMetricTrendDirection = "up" | "down" | "flat" | "unknown";

export interface ReportMetric {
  key: string;
  label: LocalizedText;
  format: ReportMetricFormat;
  description?: LocalizedText;
  sampleValue?: string | number;
  trendDirection?: ReportMetricTrendDirection;
  severity?: ReportWidgetSeverity;
}

export type ReportDimensionType = "module" | "store" | "role" | "supplier" | "sku" | "date" | "status" | "category" | "custom";

export interface ReportDimension {
  key: string;
  label: LocalizedText;
  type: ReportDimensionType;
  sampleValue?: string;
}

export type ReportFilterType = "search" | "select" | "multi-select" | "date-range" | "status" | "module" | "role" | "store";

export interface ReportFilter {
  key: string;
  label: LocalizedText;
  type: ReportFilterType;
  required: boolean;
  defaultValue?: string | string[];
}

export interface ReportWidgetRequirement {
  permissionRequired?: string;
  roleRequired?: string;
  planRequired?: string;
  auditRequired: boolean;
  exportable: boolean;
  refreshable: boolean;
  drillDownEnabled: boolean;
  isPlaceholder: boolean;
}

export interface ReportWidgetContract {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  widgetType: ReportWidgetType;
  status: ReportWidgetStatus;
  severity: ReportWidgetSeverity;
  size: ReportWidgetSize;
  source: ReportWidgetSource;
  metrics: ReportMetric[];
  dimensions: ReportDimension[];
  filters: ReportFilter[];
  requirement: ReportWidgetRequirement;
  sampleData?: unknown;
  samplePreviewEnabled?: boolean;
  linkedRoute?: string;
  futureQueryKey?: string;
  futureDashboardKey?: string;
  futureReportBuilderKey?: string;
  notes?: LocalizedText;
}

export interface ReportWidgetPreview {
  widgetKey: string;
  canRender: boolean;
  status: ReportWidgetStatus;
  severity: ReportWidgetSeverity;
  title: LocalizedText;
  reason: LocalizedText;
  sourceModule: string;
  metricCount: number;
  filterCount: number;
  exportable: boolean;
  refreshable: boolean;
  drillDownEnabled: boolean;
  placeholderNotice?: LocalizedText;
}

export type DashboardLayoutMode = "grid" | "list" | "board" | "executive" | "operational";

export interface DashboardLayoutContract {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  targetRole?: string;
  targetPlan?: string;
  widgets: string[];
  status: ReportWidgetStatus;
  layoutMode: DashboardLayoutMode;
  notes?: LocalizedText;
}
