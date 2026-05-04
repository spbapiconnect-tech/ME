import type { LocalizedText, ThemeMode } from "@/types/module";
import type { LayoutPageType } from "@/types/layout-engine";

export type SkinCode = "classic" | "premium" | "compact" | "manager" | "mobile-execution" | "desktop-admin";
export type SkinDensity = "comfortable" | "compact" | "dense";
export type SkinRadius = "soft" | "rounded" | "sharp";
export type SkinShadow = "subtle" | "elevated" | "layered";
export type SkinNavigation = "sidebar" | "topbar" | "tabs" | "bottom-nav" | "split-nav";
export type SkinShell = "mobile" | "tablet" | "desktop" | "responsive";
export type SkinComponentStyle = "default" | "soft" | "outlined" | "premium" | "dense" | "minimal";

export interface SkinConfig {
  code: SkinCode;
  name: LocalizedText;
  description: LocalizedText;
  density: SkinDensity;
  radius: SkinRadius;
  shadow: SkinShadow;
  navigation: SkinNavigation;
  preferredShell: SkinShell;
  componentStyle: SkinComponentStyle;
  supportedPageTypes: LayoutPageType[];
  themeSupport: ThemeMode[];
  roleTargets: string[];
}
