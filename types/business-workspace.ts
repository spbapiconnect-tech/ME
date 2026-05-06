export type BusinessWorkspaceTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type BusinessWorkspaceStatus = "healthy" | "watch" | "risk" | "action-needed" | "placeholder";

export interface BusinessWorkspaceMetric {
  key: string;
  label: { zh: string; en: string };
  value: string;
  unit?: { zh: string; en: string };
  tone: BusinessWorkspaceTone;
  description?: { zh: string; en: string };
  route?: string;
}

export interface BusinessWorkspaceModuleCard {
  key: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  status: BusinessWorkspaceStatus;
  tone: BusinessWorkspaceTone;
  route: string;
  primaryMetric?: { zh: string; en: string };
  secondaryMetric?: { zh: string; en: string };
  actionLabel?: { zh: string; en: string };
}

export interface BusinessWorkspaceAlert {
  key: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  tone: BusinessWorkspaceTone;
  sourceModule: string;
  route?: string;
  timestampLabel?: { zh: string; en: string };
}

export interface BusinessWorkspaceAction {
  key: string;
  label: { zh: string; en: string };
  description?: { zh: string; en: string };
  route: string;
  tone: BusinessWorkspaceTone;
  sourceModule?: string;
  isPlaceholder: boolean;
}

export interface BusinessWorkspaceFoundationLink {
  key: string;
  label: { zh: string; en: string };
  route: string;
}

export interface BusinessWorkspacePageData {
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  generatedAt: string;
  metrics: BusinessWorkspaceMetric[];
  modules: BusinessWorkspaceModuleCard[];
  alerts: BusinessWorkspaceAlert[];
  actions: BusinessWorkspaceAction[];
  systemFoundationLinks: BusinessWorkspaceFoundationLink[];
  notice: { zh: string; en: string };
}
