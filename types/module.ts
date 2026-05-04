export type SupportedLocale = "zh" | "en";
export type ThemeMode = "bright" | "dark" | "moon";
export type ModuleCategory = "core" | "control" | "admin" | "future";
export type ModuleStatus = "enabled" | "disabled" | "coming-soon" | "beta";
export type ModulePlan = "starter" | "ops" | "pro" | "enterprise";
export type ModuleIconName = string;

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface ModuleRoutes {
  home: string;
  dashboard: string;
  listing: string;
  detail: string;
  issue: string;
  form: string;
  report: string;
  settings: string;
}

export interface ModuleSourceMapping {
  moduleKey: string;
  routeNamespace: string;
  permissionNamespace: string;
  apiNamespace: string;
  analyticsKey: string;
}

export interface ModuleDefinition {
  code: string;
  name: LocalizedText;
  shortName: LocalizedText;
  description: LocalizedText;
  category: ModuleCategory;
  priority: number;
  icon: ModuleIconName;
  status: ModuleStatus;
  plan: ModulePlan;
  routes: ModuleRoutes;
  permissions: string[];
  apiScope: string[];
  themeSupport: ThemeMode[];
  languageSupport: SupportedLocale[];
  featureFlags: string[];
  ownerRole: string;
  sourceMapping: ModuleSourceMapping;
}
