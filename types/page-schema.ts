import type { ThemeMode } from "@/types/module";

export type PageKind =
  | "Dashboard"
  | "Listing"
  | "Detail"
  | "Issue"
  | "Form"
  | "Report"
  | "Settings";

export interface PageFieldSchema {
  key: string;
  labelKey: string;
  type: "text" | "number" | "date" | "status" | "tag" | "note";
  required?: boolean;
}

export interface PageActionSchema {
  key: string;
  labelKey: string;
  permission?: string;
}

export interface PageSchemaDefinition {
  id: string;
  moduleCode: string;
  route: string;
  kind: PageKind;
  titleKey: string;
  descriptionKey: string;
  themeModes: ThemeMode[];
  widgets?: string[];
  filters?: string[];
  columns?: string[];
  sections?: string[];
  fields?: PageFieldSchema[];
  actions?: PageActionSchema[];
  enabled: boolean;
}
