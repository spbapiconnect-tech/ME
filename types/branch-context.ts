import type { MeNavigationItem, MeNavigationLocale } from "@/types/navigation";
import type { MeRoleKey } from "@/types/role-workspace";

export type MeBranchKey = "all-stores" | "kch" | "btu" | "future-branch";

export type MeBranchContextTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeBranchContextStatus = "active" | "watch" | "risk" | "placeholder" | "coming-soon";

export interface MeBranchLocalizedText {
  zh: string;
  en: string;
}

export interface MeBranchProfile {
  key: MeBranchKey;
  name: MeBranchLocalizedText;
  shortName: string;
  description: MeBranchLocalizedText;
  region?: MeBranchLocalizedText;
  status: MeBranchContextStatus;
  tone: MeBranchContextTone;
  defaultRoute: string;
  linkedRoles: MeRoleKey[];
  linkedModules: string[];
  visibleNavigationItemKeys: string[];
  isAggregate: boolean;
  notes?: string;
}

export interface MeBranchMetric {
  key: string;
  label: MeBranchLocalizedText;
  value: string;
  unit?: MeBranchLocalizedText;
  tone: MeBranchContextTone;
  description?: MeBranchLocalizedText;
  route?: string;
}

export interface MeBranchAlert {
  key: string;
  title: MeBranchLocalizedText;
  description: MeBranchLocalizedText;
  tone: MeBranchContextTone;
  sourceModule: string;
  route?: string;
  timestampLabel?: MeBranchLocalizedText;
}

export interface MeBranchAction {
  key: string;
  label: MeBranchLocalizedText;
  description?: MeBranchLocalizedText;
  route: string;
  tone: MeBranchContextTone;
  isPlaceholder: boolean;
}

export interface MeBranchWorkspaceLink {
  key: string;
  label: MeBranchLocalizedText;
  description?: MeBranchLocalizedText;
  route: string;
  tone: MeBranchContextTone;
}

export interface MeBranchNavigationPreview {
  branchKey: MeBranchKey;
  visibleItemKeys: string[];
  visibleItems: MeNavigationItem[];
  notice: MeBranchLocalizedText;
}

export interface MeBranchWorkspaceData {
  branch: MeBranchProfile;
  title: MeBranchLocalizedText;
  subtitle: MeBranchLocalizedText;
  metrics: MeBranchMetric[];
  alerts: MeBranchAlert[];
  actions: MeBranchAction[];
  roleLinks: MeBranchWorkspaceLink[];
  psiLinks: MeBranchWorkspaceLink[];
  reportLinks: MeBranchWorkspaceLink[];
  navigationPreview: MeBranchNavigationPreview;
  notice: MeBranchLocalizedText;
  generatedAt: string;
}

export type MeBranchResolver = (branch: MeBranchProfile, locale?: MeNavigationLocale) => string;
