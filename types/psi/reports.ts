import type { LocalizedText } from "@/types/module";

export type PsiReportMetricTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type PsiReportWidgetPreviewKind =
  | "kpi"
  | "status"
  | "risk"
  | "list"
  | "table"
  | "timeline-summary"
  | "issue-summary"
  | "health-score"
  | "placeholder";

export interface PsiReportMetric {
  key: string;
  label: LocalizedText;
  value: string;
  unit?: LocalizedText;
  tone: PsiReportMetricTone;
  description?: LocalizedText;
  sourceModule: string;
  sourceRoute?: string;
}

export interface PsiReportListItem {
  key: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  value?: LocalizedText;
  tone: PsiReportMetricTone;
  route?: string;
  sourceModule: string;
  sourceRecordId?: string;
}

export interface PsiReportWidgetData {
  widgetKey: string;
  title: LocalizedText;
  description?: LocalizedText;
  kind: PsiReportWidgetPreviewKind;
  sourceModule: string;
  metrics: PsiReportMetric[];
  items: PsiReportListItem[];
  summary?: LocalizedText;
  linkedRoute?: string;
  isMock: boolean;
  isPlaceholder: boolean;
  notice?: LocalizedText;
}

export interface PsiReportDashboardData {
  title: LocalizedText;
  subtitle: LocalizedText;
  widgets: PsiReportWidgetData[];
  generatedAt: string;
  metaSource: string;
  notice: LocalizedText;
}
