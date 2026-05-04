import type { LocalizedText, SupportedLocale } from "@/types/module";

export type ActionTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export type ActionIntent =
  | "navigate"
  | "create"
  | "update"
  | "approve"
  | "reject"
  | "export"
  | "assign"
  | "close"
  | "open-drawer"
  | "open-modal"
  | "trigger-task"
  | "trigger-workflow"
  | "configure"
  | "placeholder";

export type ActionStatus = "active" | "disabled" | "hidden" | "coming-soon" | "placeholder";

export interface ActionSource {
  sourceModule: string;
  sourceRecordId?: string;
  sourcePage: string;
  sourceComponent: string;
  sourceEvent: string;
  sourceRoute?: string;
}

export interface ActionTarget {
  targetModule?: string;
  targetRoute?: string;
  targetAction: string;
  targetPage?: string;
  targetComponent?: string;
}

export interface ActionRequirement {
  permissionRequired?: string;
  auditRequired: boolean;
  confirmationRequired: boolean;
  roleRequired?: string;
  planRequired?: string;
}

export interface ActionContract {
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  tone: ActionTone;
  intent: ActionIntent;
  status: ActionStatus;
  source: ActionSource;
  target: ActionTarget;
  requirement: ActionRequirement;
  isPlaceholder: boolean;
  isDestructive: boolean;
  futureWorkflowKey?: string;
  analyticsKey?: string;
}

export interface ActionExecutionPreview {
  actionKey: string;
  canExecute: boolean;
  reason?: LocalizedText;
  auditRequired: boolean;
  permissionRequired?: string;
  placeholderNotice?: LocalizedText;
}

export type ActionLocale = SupportedLocale;
