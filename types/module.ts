import type { PermissionKey } from "@/types/permission";

export type SupportedLocale = "zh" | "en";
export type ThemeMode = "bright" | "dark" | "moon";
export type ModuleCategory = "core" | "control" | "admin" | "future";
export type ModuleStatus = "enabled" | "disabled" | "coming-soon";
export type ModuleIconName =
  | "ShoppingCart"
  | "Truck"
  | "Boxes"
  | "ChartColumn"
  | "GraduationCap"
  | "ListTodo";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface ModuleRoutes {
  home: string;
  listing: string;
  detail: string;
  issue: string;
  form: string;
}

export interface ModuleDefinition {
  code: string;
  name: LocalizedText;
  shortName: LocalizedText;
  category: ModuleCategory;
  icon: ModuleIconName;
  status: ModuleStatus;
  routes: ModuleRoutes;
  permissions: PermissionKey[];
  themeSupport: ThemeMode[];
}
