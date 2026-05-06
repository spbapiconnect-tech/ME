import type { MeNavigationLocale } from "@/types/navigation";

export type MeStakeholderSummaryTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeStakeholderAudience = "owner" | "investor" | "partner" | "operator" | "internal-team" | "placeholder";

export type MeStakeholderSectionKind =
  | "hero"
  | "problem"
  | "opportunity"
  | "product-layer"
  | "business-workspace"
  | "role-context"
  | "branch-context"
  | "psi-operations"
  | "reports"
  | "system-foundation"
  | "roadmap"
  | "demo-route-map"
  | "next-step";

export interface MeStakeholderLocalizedText {
  zh: string;
  en: string;
}

export interface MeStakeholderSummaryMetric {
  key: string;
  label: MeStakeholderLocalizedText;
  value: string;
  tone: MeStakeholderSummaryTone;
  description?: MeStakeholderLocalizedText;
}

export interface MeStakeholderSummaryCard {
  key: string;
  title: MeStakeholderLocalizedText;
  description: MeStakeholderLocalizedText;
  kind: MeStakeholderSectionKind;
  tone: MeStakeholderSummaryTone;
  route?: string;
  highlights: MeStakeholderLocalizedText[];
  proofPoints: MeStakeholderLocalizedText[];
  isPlaceholder: boolean;
}

export type MeStakeholderRoadmapStatus = "completed" | "in-progress" | "planned" | "future" | "placeholder";

export interface MeStakeholderRoadmapItem {
  key: string;
  title: MeStakeholderLocalizedText;
  description: MeStakeholderLocalizedText;
  status: MeStakeholderRoadmapStatus;
  route?: string;
  tag?: string;
}

export interface MeStakeholderDemoRoute {
  key: string;
  title: MeStakeholderLocalizedText;
  description: MeStakeholderLocalizedText;
  route: string;
  tone: MeStakeholderSummaryTone;
}

export interface MeStakeholderSummaryPageData {
  title: MeStakeholderLocalizedText;
  subtitle: MeStakeholderLocalizedText;
  audience: MeStakeholderAudience[];
  metrics: MeStakeholderSummaryMetric[];
  cards: MeStakeholderSummaryCard[];
  roadmap: MeStakeholderRoadmapItem[];
  demoRoutes: MeStakeholderDemoRoute[];
  generatedAt: string;
  notice: MeStakeholderLocalizedText;
}

export type MeStakeholderLocale = MeNavigationLocale;
