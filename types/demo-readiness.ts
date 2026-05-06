import type { MeNavigationLocale } from "@/types/navigation";

export type MeDemoReadinessTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeDemoReadinessStatus = "pass" | "review" | "placeholder" | "blocked" | "future";

export type MeDemoReadinessCategory =
  | "route-completeness"
  | "navigation-reachability"
  | "presentation-consistency"
  | "screenshot-readiness"
  | "scope-guardrail"
  | "docs-consistency"
  | "demo-walkthrough"
  | "stakeholder-summary"
  | "future-readiness";

export interface MeDemoReadinessLocalizedText {
  zh: string;
  en: string;
}

export interface MeDemoReadinessChecklistItem {
  key: string;
  title: MeDemoReadinessLocalizedText;
  description: MeDemoReadinessLocalizedText;
  category: MeDemoReadinessCategory;
  status: MeDemoReadinessStatus;
  tone: MeDemoReadinessTone;
  route?: string;
  relatedRoutes: string[];
  evidence: MeDemoReadinessLocalizedText[];
  notes?: MeDemoReadinessLocalizedText;
  isPlaceholder: boolean;
}

export interface MeDemoReadinessSection {
  key: string;
  title: MeDemoReadinessLocalizedText;
  description?: MeDemoReadinessLocalizedText;
  category: MeDemoReadinessCategory;
  items: MeDemoReadinessChecklistItem[];
  tone: MeDemoReadinessTone;
}

export interface MeDemoReadinessMetric {
  key: string;
  label: MeDemoReadinessLocalizedText;
  value: string;
  tone: MeDemoReadinessTone;
  description?: MeDemoReadinessLocalizedText;
}

export interface MeDemoReadinessPageData {
  title: MeDemoReadinessLocalizedText;
  subtitle: MeDemoReadinessLocalizedText;
  sections: MeDemoReadinessSection[];
  items: MeDemoReadinessChecklistItem[];
  summaryMetrics: MeDemoReadinessMetric[];
  routeChecklist: MeDemoReadinessChecklistItem[];
  guardrailChecklist: MeDemoReadinessChecklistItem[];
  generatedAt: string;
  notice: MeDemoReadinessLocalizedText;
}

export type MeDemoReadinessLocale = MeNavigationLocale;
