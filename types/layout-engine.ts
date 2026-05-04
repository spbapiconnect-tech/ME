import type { LocalizedText, ThemeMode } from "@/types/module";

export type LayoutPageType =
  | "dashboard"
  | "listing"
  | "detail"
  | "issue"
  | "form"
  | "report"
  | "settings";

export type LayoutVariant =
  | "classic"
  | "premium"
  | "compact"
  | "manager"
  | "mobile-execution"
  | "desktop-admin"
  | "board";

export type LayoutCapability =
  | "table"
  | "cards"
  | "board"
  | "split-view"
  | "drawer"
  | "timeline"
  | "form"
  | "report"
  | "settings-panel";

export type LayoutResponsiveMode = "adaptive" | "mobile-first" | "desktop-first" | "split-optimized";
export type LayoutDensity = "comfortable" | "compact" | "dense";
export type LayoutComponentVariant = "default" | "elevated" | "soft" | "minimal";

export interface LayoutRendererConfig {
  pageType: LayoutPageType;
  variant: LayoutVariant;
  capabilities: LayoutCapability[];
  responsiveMode: LayoutResponsiveMode;
  density: LayoutDensity;
  componentVariant: LayoutComponentVariant;
  notes: LocalizedText;
}

export interface LayoutPreviewOption {
  pageType: LayoutPageType;
  variant: LayoutVariant;
  label: LocalizedText;
  themeSupport: ThemeMode[];
}
