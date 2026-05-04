import type { LocalizedText } from "@/types/module";

export type ModulePageType =
  | "dashboard"
  | "listing"
  | "detail"
  | "issue"
  | "form"
  | "report"
  | "settings";

export type ResponsiveLayoutPattern =
  | "mobile-card-list"
  | "mobile-single-column"
  | "tablet-split-view"
  | "tablet-workspace"
  | "desktop-data-grid"
  | "desktop-detail-drawer"
  | "desktop-board"
  | "desktop-settings-panel";

export type PageSchemaLayout =
  | "dashboard-layout"
  | "listing-layout"
  | "detail-layout"
  | "issue-layout"
  | "form-layout"
  | "report-layout"
  | "settings-layout";

export type PageSchemaWidgetTone = "default" | "success" | "warning" | "danger" | "info";
export type PageSchemaFilterType = "search" | "select" | "date-range" | "status" | "owner" | "tag";
export type PageSchemaColumnAlign = "left" | "center" | "right";
export type PageSchemaSectionLayout = "stack" | "grid" | "timeline" | "panel";
export type PageSchemaFieldType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "date-range"
  | "status"
  | "select"
  | "textarea"
  | "toggle"
  | "user"
  | "tag";
export type PageSchemaActionTone = "primary" | "secondary" | "ghost" | "danger";
export type PageSchemaActionPlacement = "toolbar" | "footer" | "panel" | "row";

export interface PageSchemaWidget {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  tone?: PageSchemaWidgetTone;
}

export interface PageSchemaFilter {
  key: string;
  label: LocalizedText;
  type: PageSchemaFilterType;
  options?: Array<{
    label: LocalizedText;
    value: string;
  }>;
}

export interface PageSchemaColumn {
  key: string;
  label: LocalizedText;
  align?: PageSchemaColumnAlign;
  emphasis?: boolean;
}

export interface PageSchemaSection {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  layout: PageSchemaSectionLayout;
  fieldKeys?: string[];
}

export interface PageSchemaField {
  key: string;
  label: LocalizedText;
  type: PageSchemaFieldType;
  placeholder?: LocalizedText;
  helpText?: LocalizedText;
  required?: boolean;
}

export interface PageSchemaAction {
  key: string;
  label: LocalizedText;
  tone: PageSchemaActionTone;
  placement: PageSchemaActionPlacement;
  permission?: string;
}

export interface PageSchemaTab {
  key: string;
  label: LocalizedText;
}

export interface PageSchemaStatusItem {
  label: LocalizedText;
  tone: PageSchemaWidgetTone;
}

export interface PageSchemaApiMapping {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH";
  note: string;
}

export interface PageSchemaSourceMapping {
  sourceModule: string;
  pageType: ModulePageType;
  sourceKey: string;
  note: string;
}

export interface PageSchemaResponsiveBehavior {
  mobile: ResponsiveLayoutPattern[];
  tablet: ResponsiveLayoutPattern[];
  desktop: ResponsiveLayoutPattern[];
}

export interface PageSchemaDefinition {
  moduleCode: string;
  pageType: ModulePageType;
  title: LocalizedText;
  description: LocalizedText;
  layout: PageSchemaLayout;
  widgets: PageSchemaWidget[];
  filters: PageSchemaFilter[];
  columns: PageSchemaColumn[];
  sections: PageSchemaSection[];
  fields: PageSchemaField[];
  actions: PageSchemaAction[];
  tabs: PageSchemaTab[];
  statusMap: Record<string, PageSchemaStatusItem>;
  apiMapping: PageSchemaApiMapping;
  sourceMapping: PageSchemaSourceMapping;
  responsiveBehavior: PageSchemaResponsiveBehavior;
}

export type ModulePageSchemaMap = Record<ModulePageType, PageSchemaDefinition>;

export interface PageTemplateDemoMetric {
  label: LocalizedText;
  value: string;
  trend: string;
}

export interface PageTemplatePreviewCard {
  title: LocalizedText;
  description: LocalizedText;
  value: string;
}

export interface PageTemplateTimelineItem {
  title: LocalizedText;
  timestamp: string;
  status: string;
}

export interface PageTemplateIssueItem {
  id: string;
  title: string;
  severity: string;
  status: string;
  owner: string;
  dueDate: string;
}

export interface PageTemplateChartPoint {
  label: string;
  value: number;
}

export interface PageTemplateDemoData {
  metrics: PageTemplateDemoMetric[];
  previewCards: PageTemplatePreviewCard[];
  records: Array<Record<string, string>>;
  detail: Record<string, string>;
  timeline: PageTemplateTimelineItem[];
  issues: PageTemplateIssueItem[];
  chartSeries: PageTemplateChartPoint[];
  settingsValues: Record<string, string>;
  formValues: Record<string, string>;
}
