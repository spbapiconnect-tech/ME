import type { ModulePageType, PageSchemaDefinition } from "@/types/page-schema";

import { createPageTemplateDemoData } from "@/config/page-schemas/_shared";
import { educationPageSchemas } from "@/config/page-schemas/education";
import { inventoryPageSchemas } from "@/config/page-schemas/inventory";
import { posreportPageSchemas } from "@/config/page-schemas/pos-report";
import { procurementPageSchemas } from "@/config/page-schemas/procurement";
import { supplierPageSchemas } from "@/config/page-schemas/supplier";
import { taskPageSchemas } from "@/config/page-schemas/task";

export const pageTypeOrder: ModulePageType[] = [
  "dashboard",
  "listing",
  "detail",
  "issue",
  "form",
  "report",
  "settings",
];

export const coreModulePageSchemas = {
  procurement: procurementPageSchemas,
  supplier: supplierPageSchemas,
  inventory: inventoryPageSchemas,
  "pos-report": posreportPageSchemas,
  education: educationPageSchemas,
  task: taskPageSchemas,
};

export const templateModuleCodes = Object.keys(coreModulePageSchemas);

export function getModulePageSchemas(moduleCode: string) {
  return coreModulePageSchemas[moduleCode as keyof typeof coreModulePageSchemas];
}

export function getPageSchema(moduleCode: string, pageType: ModulePageType): PageSchemaDefinition {
  return coreModulePageSchemas[moduleCode as keyof typeof coreModulePageSchemas][pageType];
}

export { createPageTemplateDemoData };
