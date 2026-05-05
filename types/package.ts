import type { LocalizedText, SupportedLocale } from "@/types/module";

export type PackageStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "blocked" | "disabled";

export type PackageCategory = "base-plan" | "module-pack" | "role-pack" | "industry-pack" | "add-on" | "enterprise" | "system";

export type PackageTier = "starter" | "ops" | "pro" | "enterprise" | "custom";

export type PackageBillingMode =
  | "none"
  | "monthly-placeholder"
  | "yearly-placeholder"
  | "per-store-placeholder"
  | "per-user-placeholder"
  | "custom-placeholder";

export type PackageFeatureType =
  | "module"
  | "action"
  | "access-rule"
  | "audit-event"
  | "workflow"
  | "notification"
  | "report-widget"
  | "rule"
  | "layout-skin"
  | "page-template"
  | "service"
  | "support"
  | "placeholder";

export interface PackageFeatureRef {
  featureType: PackageFeatureType;
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  required: boolean;
  status: PackageStatus;
  notes?: LocalizedText;
}

export interface PackageLimit {
  key: string;
  label: LocalizedText;
  value: string | number | boolean;
  unit?: LocalizedText;
  description?: LocalizedText;
  isPlaceholder: boolean;
}

export interface PackageRequirement {
  targetTier?: PackageTier;
  targetPlan?: string;
  targetRole?: string;
  targetCustomer?: LocalizedText;
  requiredModules?: string[];
  requiredPermissions?: string[];
  billingMode: PackageBillingMode;
  auditRequired: boolean;
  isPlaceholder: boolean;
}

export interface PackageContract {
  key: string;
  name: LocalizedText;
  description?: LocalizedText;
  category: PackageCategory;
  tier: PackageTier;
  status: PackageStatus;
  billingMode: PackageBillingMode;
  modules: string[];
  features: PackageFeatureRef[];
  limits: PackageLimit[];
  requirement: PackageRequirement;
  recommendedRoles: string[];
  recommendedSkins: string[];
  recommendedDashboards: string[];
  linkedRoute?: string;
  samplePreviewEnabled?: boolean;
  futureBillingKey?: string;
  futureSubscriptionKey?: string;
  futureProvisioningKey?: string;
  notes?: LocalizedText;
}

export interface PackagePreview {
  packageKey: string;
  canUse: boolean;
  status: PackageStatus;
  tier: PackageTier;
  category: PackageCategory;
  name: LocalizedText;
  reason: LocalizedText;
  moduleCount: number;
  featureCount: number;
  limitCount: number;
  billingMode: PackageBillingMode;
  placeholderNotice?: LocalizedText;
}

export type PackageGroupCategory = "base-plans" | "module-packs" | "operations" | "compliance" | "reporting" | "system-preview";

export interface PackageGroupContract {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  category: PackageGroupCategory;
  packages: string[];
  status: PackageStatus;
  notes?: LocalizedText;
}

export type PackageLocale = SupportedLocale;
