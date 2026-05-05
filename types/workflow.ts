import type { LocalizedText, SupportedLocale } from "@/types/module";

export type WorkflowTriggerType =
  | "action"
  | "audit-event"
  | "access-rule"
  | "schedule"
  | "manual"
  | "system"
  | "placeholder";

export type WorkflowTargetType =
  | "task"
  | "approval"
  | "notification"
  | "report"
  | "webhook-placeholder"
  | "api-placeholder"
  | "automation-placeholder"
  | "human-review"
  | "none";

export type WorkflowStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "blocked" | "disabled";

export type WorkflowSeverity = "low" | "medium" | "high" | "critical";

export interface WorkflowSource {
  sourceModule: string;
  sourceRecordId?: string;
  sourcePage: string;
  sourceComponent: string;
  sourceEvent: string;
  sourceRoute?: string;
  actionKey?: string;
  auditEventKey?: string;
  accessRuleKey?: string;
}

export interface WorkflowTarget {
  targetType: WorkflowTargetType;
  targetModule?: string;
  targetAction: string;
  targetRoute?: string;
  targetOwnerRole?: string;
  targetDescription?: LocalizedText;
}

export interface WorkflowRequirement {
  humanConfirmationRequired: boolean;
  auditRequired: boolean;
  permissionRequired?: string;
  roleRequired?: string;
  planRequired?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  actionKey?: string;
}

export interface WorkflowContract {
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  triggerType: WorkflowTriggerType;
  target: WorkflowTarget;
  status: WorkflowStatus;
  severity: WorkflowSeverity;
  source: WorkflowSource;
  requirement: WorkflowRequirement;
  isPlaceholder: boolean;
  futureEngineKey?: string;
  futureQueueKey?: string;
  notes?: LocalizedText;
}

export interface WorkflowPreview {
  workflowKey: string;
  canTrigger: boolean;
  status: WorkflowStatus;
  severity: WorkflowSeverity;
  reason: LocalizedText;
  triggerLabel?: string;
  targetLabel?: string;
  humanConfirmationRequired: boolean;
  auditRequired: boolean;
  permissionRequired?: string;
  placeholderNotice?: LocalizedText;
}

export interface WorkflowTargetCatalogItem {
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  targetType: WorkflowTargetType;
  targetModule?: string;
  status: WorkflowStatus;
}

export type WorkflowLocale = SupportedLocale;
