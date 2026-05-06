export type MeNavigationLocale = "zh" | "en";

export type MeNavigationGroupType =
  | "business"
  | "operations"
  | "reports"
  | "system"
  | "admin"
  | "placeholder";

export type MeNavigationItemStatus =
  | "active"
  | "preview-only"
  | "placeholder"
  | "coming-soon"
  | "hidden";

export type MeNavigationTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export interface MeNavigationItem {
  key: string;
  label: { zh: string; en: string };
  description?: { zh: string; en: string };
  href: string;
  group: string;
  status: MeNavigationItemStatus;
  tone: MeNavigationTone;
  badge?: { zh: string; en: string };
  isPrimary: boolean;
  isFoundation: boolean;
  relatedModule?: string;
  notes?: string;
}

export interface MeSidebarNavigationItem {
  key: string;
  label: { zh: string; en: string };
  description?: { zh: string; en: string };
  href?: string;
  status: MeNavigationItemStatus;
  tone: MeNavigationTone;
  badge?: { zh: string; en: string };
  matchPaths?: string[];
  routeKey?: string;
  children?: MeSidebarNavigationItem[];
}

export interface MeSidebarNavigationGroup {
  key: string;
  title: { zh: string; en: string };
  description?: { zh: string; en: string };
  icon?: string;
  items: MeSidebarNavigationItem[];
  collapsedByDefault: boolean;
}

export interface MeNavigationGroup {
  key: string;
  title: { zh: string; en: string };
  description?: { zh: string; en: string };
  groupType: MeNavigationGroupType;
  items: MeNavigationItem[];
  collapsedByDefault: boolean;
  isFoundationGroup: boolean;
}

export interface MeNavigationMap {
  primaryItems: MeNavigationItem[];
  groups: MeNavigationGroup[];
  sidebarGroups: MeSidebarNavigationGroup[];
  footerItems: MeNavigationItem[];
  generatedAt: string;
  notice: { zh: string; en: string };
}
