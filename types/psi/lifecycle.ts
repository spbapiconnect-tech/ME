import type { LocalizedText } from "@/types/module";

import type { PsiLinkedTaskPlaceholder, PsiRecordStatus } from "./shared";

export type PsiLifecycleStatus =
  | "open"
  | "reviewing"
  | "pending-action"
  | "waiting-supplier"
  | "waiting-receiving"
  | "waiting-stock-check"
  | "resolved"
  | "escalated"
  | "closed"
  | "placeholder";

export type PsiLifecycleEventType =
  | "created"
  | "status-change-placeholder"
  | "comment-placeholder"
  | "evidence-placeholder"
  | "action-placeholder"
  | "audit-placeholder"
  | "task-placeholder"
  | "workflow-placeholder"
  | "notification-placeholder"
  | "system-placeholder";

export type PsiTimelineTone = "neutral" | "info" | "success" | "warning" | "danger" | "muted";

export type PsiTimelineActorType = "user-placeholder" | "role" | "system" | "supplier-placeholder" | "store-placeholder";

export interface PsiTimelineActor {
  actorType: PsiTimelineActorType;
  name: LocalizedText;
  role?: string;
  store?: string;
}

export interface PsiTimelineSource {
  moduleCode: string;
  recordId: string;
  recordType: string;
  route?: string;
  actionDraftKey?: string;
  actionKey?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  workflowKey?: string;
  notificationKey?: string;
  taskId?: string;
}

export interface PsiTimelineEvent {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  eventType: PsiLifecycleEventType;
  tone: PsiTimelineTone;
  status: PsiLifecycleStatus;
  actor: PsiTimelineActor;
  source: PsiTimelineSource;
  occurredAt: string;
  isPlaceholder: boolean;
  futureAuditKey?: string;
  futureWorkflowKey?: string;
  futureNotificationKey?: string;
}

export interface PsiIssueLifecycleStage {
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  status: PsiLifecycleStatus;
  tone: PsiTimelineTone;
  order: number;
  isCurrent: boolean;
  isPlaceholder: boolean;
}

export interface PsiLinkedRecord {
  key: string;
  label: LocalizedText;
  moduleCode: string;
  recordId: string;
  recordType: string;
  route?: string;
  status?: PsiRecordStatus;
  description?: LocalizedText;
}

export interface PsiDetailInsight {
  key: string;
  label: LocalizedText;
  value: LocalizedText;
  tone: PsiTimelineTone;
  description?: LocalizedText;
  source?: PsiTimelineSource;
}

export interface PsiDetailPanelData {
  recordId: string;
  moduleCode: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  lifecycle: PsiIssueLifecycleStage[];
  timeline: PsiTimelineEvent[];
  linkedRecords: PsiLinkedRecord[];
  insights: PsiDetailInsight[];
  relatedActionDraftKeys: string[];
  relatedTaskPlaceholders: PsiLinkedTaskPlaceholder[];
  relatedIssueIds: string[];
  notice: LocalizedText;
}
