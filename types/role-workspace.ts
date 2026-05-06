import type { MeNavigationItem, MeNavigationLocale } from "@/types/navigation";

export type MeRoleKey = "owner" | "store-manager" | "purchasing" | "warehouse" | "staff" | "system-admin";

export type MeRoleWorkspaceTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeRoleWorkspaceStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "hidden";

export type MeRoleFoundationAccessLevel = "hidden-preview" | "limited-preview" | "full-preview";

export interface MeRoleLocalizedText {
  zh: string;
  en: string;
}

export interface MeRoleProfile {
  key: MeRoleKey;
  name: MeRoleLocalizedText;
  description: MeRoleLocalizedText;
  primaryGoal: MeRoleLocalizedText;
  tone: MeRoleWorkspaceTone;
  status: MeRoleWorkspaceStatus;
  defaultRoute: string;
  suggestedModules: string[];
  visibleNavigationItemKeys: string[];
  foundationAccessLevel: MeRoleFoundationAccessLevel;
  notes?: string;
}

export interface MeRoleWorkspaceMetric {
  key: string;
  label: MeRoleLocalizedText;
  value: string;
  tone: MeRoleWorkspaceTone;
  description?: MeRoleLocalizedText;
  route?: string;
}

export interface MeRoleWorkspaceModule {
  key: string;
  title: MeRoleLocalizedText;
  description: MeRoleLocalizedText;
  route: string;
  tone: MeRoleWorkspaceTone;
  status: MeRoleWorkspaceStatus;
  reason?: MeRoleLocalizedText;
}

export interface MeRoleWorkspaceAction {
  key: string;
  label: MeRoleLocalizedText;
  description?: MeRoleLocalizedText;
  route: string;
  tone: MeRoleWorkspaceTone;
  isPlaceholder: boolean;
}

export interface MeRoleNavigationPreview {
  roleKey: MeRoleKey;
  visibleItemKeys: string[];
  visibleItems: MeNavigationItem[];
  hiddenFoundationCount: number;
  notice: MeRoleLocalizedText;
}

export interface MeRoleFoundationPreview {
  accessLevel: MeRoleFoundationAccessLevel;
  visibleItemKeys: string[];
  visibleItems: MeNavigationItem[];
  description: MeRoleLocalizedText;
}

export interface MeRoleWorkspaceData {
  role: MeRoleProfile;
  title: MeRoleLocalizedText;
  subtitle: MeRoleLocalizedText;
  metrics: MeRoleWorkspaceMetric[];
  modules: MeRoleWorkspaceModule[];
  actions: MeRoleWorkspaceAction[];
  navigationPreview: MeRoleNavigationPreview;
  foundationPreview: MeRoleFoundationPreview;
  notice: MeRoleLocalizedText;
  generatedAt: string;
}

export type MeRoleResolver = (role: MeRoleProfile, locale?: MeNavigationLocale) => string;
