export type MeDemoModeTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeDemoModeBadgeVariant =
  | "product-demo"
  | "screenshot-ready"
  | "stakeholder-review"
  | "walkthrough"
  | "proposal"
  | "placeholder";

export type MeDemoModeSurface =
  | "homepage"
  | "navigation"
  | "roles"
  | "branches"
  | "psi"
  | "reports"
  | "demo-story"
  | "system-foundation";

export interface MeDemoModeLocalizedText {
  zh: string;
  en: string;
}

export interface MeDemoModeBadge {
  key: string;
  label: MeDemoModeLocalizedText;
  description?: MeDemoModeLocalizedText;
  variant: MeDemoModeBadgeVariant;
  tone: MeDemoModeTone;
  isPlaceholder: boolean;
}

export interface MeDemoScreenshotSection {
  key: string;
  title: MeDemoModeLocalizedText;
  description: MeDemoModeLocalizedText;
  route: string;
  surface: MeDemoModeSurface;
  recommendedShot: MeDemoModeLocalizedText;
  framingTips: MeDemoModeLocalizedText[];
  highlightKeys: string[];
  tone: MeDemoModeTone;
  isPlaceholder: boolean;
}

export interface MeDemoWalkthroughItem {
  key: string;
  order: number;
  title: MeDemoModeLocalizedText;
  description: MeDemoModeLocalizedText;
  route: string;
  surface: MeDemoModeSurface;
  checkedByDefault: boolean;
  isPlaceholder: boolean;
}

export interface MeDemoModePageData {
  title: MeDemoModeLocalizedText;
  subtitle: MeDemoModeLocalizedText;
  badges: MeDemoModeBadge[];
  screenshotSections: MeDemoScreenshotSection[];
  walkthroughItems: MeDemoWalkthroughItem[];
  recommendedRouteSequence: string[];
  generatedAt: string;
  notice: MeDemoModeLocalizedText;
}
