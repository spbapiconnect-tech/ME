export type MeDemoStoryKey =
  | "business-overview"
  | "navigation-ia"
  | "role-workspaces"
  | "branch-context"
  | "psi-operations"
  | "report-preview"
  | "system-foundation"
  | "next-steps";

export type MeDemoStoryTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type MeDemoStepStatus = "active" | "preview-only" | "placeholder" | "coming-soon";

export interface MeDemoLocalizedText {
  zh: string;
  en: string;
}

export interface MeDemoStoryStep {
  key: MeDemoStoryKey;
  order: number;
  title: MeDemoLocalizedText;
  subtitle?: MeDemoLocalizedText;
  description: MeDemoLocalizedText;
  tone: MeDemoStoryTone;
  status: MeDemoStepStatus;
  route: string;
  relatedRoutes: string[];
  primaryCta: MeDemoLocalizedText;
  secondaryCta?: MeDemoLocalizedText;
  sourceModules: string[];
  highlights: MeDemoLocalizedText[];
  proofPoints: MeDemoLocalizedText[];
  placeholderNotice: MeDemoLocalizedText;
}

export interface MeDemoStorySection {
  key: string;
  title: MeDemoLocalizedText;
  description?: MeDemoLocalizedText;
  steps: MeDemoStoryStep[];
  tone: MeDemoStoryTone;
}

export interface MeDemoStoryPageData {
  title: MeDemoLocalizedText;
  subtitle: MeDemoLocalizedText;
  sections: MeDemoStorySection[];
  steps: MeDemoStoryStep[];
  currentStep?: MeDemoStoryStep;
  generatedAt: string;
  notice: MeDemoLocalizedText;
}
