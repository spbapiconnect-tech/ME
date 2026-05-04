import type { LocalizedText } from "@/types/module"

export type AccessRole =
  | "owner"
  | "operations-manager"
  | "purchasing-manager"
  | "store-manager"
  | "warehouse-handler"
  | "supplier-coordinator"
  | "staff"
  | "admin"
  | "system"

export type AccessRoleCategory = "leadership" | "operations" | "store" | "warehouse" | "supplier" | "platform" | "system"

export type AccessPlan = "starter" | "ops" | "pro" | "enterprise"

export type AccessPlanStatus = "active" | "coming-soon" | "placeholder"

export type AccessStatus = "allowed" | "blocked" | "placeholder" | "coming-soon" | "hidden"

export type AccessScope = "module" | "page" | "action" | "record" | "field"

export interface AccessCondition {
  requiredPermission?: string
  requiredRole?: AccessRole
  requiredPlan?: AccessPlan
  requiredModule?: string
  requiredStore?: string
  requiresAudit: boolean
  requiresConfirmation: boolean
  isPlaceholder: boolean
}

export interface AccessRule {
  key: string
  label: LocalizedText
  description?: LocalizedText
  scope: AccessScope
  targetModule?: string
  targetPage?: string
  targetAction?: string
  condition: AccessCondition
  status: AccessStatus
  reason?: LocalizedText
  futureEnforcementKey?: string
}

export interface AccessPreview {
  ruleKey: string
  canAccess: boolean
  status: AccessStatus
  reason: LocalizedText
  requiredPermission?: string
  requiredRole?: AccessRole
  requiredPlan?: AccessPlan
  requiresAudit: boolean
  requiresConfirmation: boolean
  placeholderNotice?: LocalizedText
}

export interface RoleRegistryItem {
  code: AccessRole
  name: LocalizedText
  description: LocalizedText
  category: AccessRoleCategory
  defaultLanding?: string
  notes?: LocalizedText
}

export interface PlanRegistryItem {
  code: AccessPlan
  name: LocalizedText
  description: LocalizedText
  targetCustomer: LocalizedText
  recommendedModules: string[]
  status: AccessPlanStatus
}
