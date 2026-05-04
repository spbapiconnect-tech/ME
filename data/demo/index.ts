import { coreModulePageSchemas } from "@/config/page-schemas";
import type { LocalizedText } from "@/types/module";
import type {
  PageSchemaFieldType,
  PageTemplateChartPoint,
  PageTemplateIssueItem,
  PageTemplateTimelineItem,
} from "@/types/page-schema";

import { demoDashboardData } from "@/data/demo/dashboard";
import { educationDemoData } from "@/data/demo/education";
import { inventoryDemoData } from "@/data/demo/inventory";
import { posReportDemoData } from "@/data/demo/pos-report";
import { procurementDemoData } from "@/data/demo/procurement";
import { supplierDemoData } from "@/data/demo/supplier";
import { taskDemoData } from "@/data/demo/task";

export type DemoModuleCode = keyof typeof coreModulePageSchemas;

export interface DemoKpiItem {
  label: LocalizedText;
  value: string;
  trend?: string;
  description?: LocalizedText;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}

export interface DemoDetailSection {
  title: LocalizedText;
  rows: Array<{
    label: string;
    value: string;
  }>;
}

export interface DemoFormFieldPlaceholder {
  key: string;
  label: LocalizedText;
  type: PageSchemaFieldType | "upload";
  value: string;
  required?: boolean;
  hint?: LocalizedText;
}

export interface DemoFormSection {
  title: LocalizedText;
  description?: LocalizedText;
  fields: DemoFormFieldPlaceholder[];
}

export interface DemoStatusDistributionItem {
  label: LocalizedText;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}

export interface DemoModuleData {
  moduleCode: DemoModuleCode;
  scenario: LocalizedText;
  summary: LocalizedText;
  kpis: DemoKpiItem[];
  listingRows: Array<Record<string, string>>;
  detailRecord: Record<string, string>;
  detailSections: DemoDetailSection[];
  issues: PageTemplateIssueItem[];
  timeline: PageTemplateTimelineItem[];
  formPlaceholders: DemoFormSection[];
  statusDistribution: DemoStatusDistributionItem[];
  reportRows: Array<Record<string, string>>;
  chartSeries: PageTemplateChartPoint[];
  ctaPlaceholders: LocalizedText[];
}

export const demoModuleCodes = Object.keys(coreModulePageSchemas) as DemoModuleCode[];

export const demoModuleDataMap: Record<DemoModuleCode, DemoModuleData> = {
  procurement: procurementDemoData,
  supplier: supplierDemoData,
  inventory: inventoryDemoData,
  "pos-report": posReportDemoData,
  education: educationDemoData,
  task: taskDemoData,
};

export function getDemoModuleData(moduleCode: string) {
  return demoModuleDataMap[moduleCode as DemoModuleCode];
}

export { demoDashboardData };
