import type { LocalizedText, SupportedLocale } from "@/types/module"

export type AuditEventType =
  | "navigation"
  | "create"
  | "update"
  | "approve"
  | "reject"
  | "export"
  | "assign"
  | "close"
  | "access-check"
  | "permission-preview"
  | "workflow-preview"
  | "system-preview"
  | "placeholder"

export type AuditSeverity = "info" | "notice" | "warning" | "critical"

export type AuditStatus = "captured" | "preview-only" | "pending" | "skipped" | "blocked" | "failed"

export type AuditActorType = "user" | "role" | "system" | "service" | "unknown"

export interface AuditActor {
  actorType: AuditActorType
  actorId?: string
  actorName?: string
  role?: string
  store?: string
}

export interface AuditSource {
  sourceModule: string
  sourceRecordId?: string
  sourcePage: string
  sourceComponent: string
  sourceEvent: string
  sourceRoute?: string
}

export interface AuditTarget {
  targetModule?: string
  targetRecordId?: string
  targetPage?: string
  targetRoute?: string
  targetAction: string
  targetComponent?: string
}

export interface AuditRequirement {
  auditRequired: boolean
  permissionRequired?: string
  roleRequired?: string
  planRequired?: string
  confirmationRequired: boolean
  accessRuleKey?: string
  actionKey?: string
}

export type AuditTimestampStrategy = "client-preview" | "server-generated" | "database-generated" | "future"

export interface AuditEventContract {
  key: string
  label: LocalizedText
  description?: LocalizedText
  eventType: AuditEventType
  severity: AuditSeverity
  status: AuditStatus
  actor: AuditActor
  source: AuditSource
  target: AuditTarget
  requirement: AuditRequirement
  timestampStrategy: AuditTimestampStrategy
  isPlaceholder: boolean
  futureEventKey?: string
  retentionHint?: string
}

export interface AuditPreview {
  eventKey: string
  shouldCapture: boolean
  status: AuditStatus
  severity: AuditSeverity
  reason: LocalizedText
  actorLabel?: string
  sourceLabel?: string
  targetLabel?: string
  auditRequired: boolean
  permissionRequired?: string
  accessRuleKey?: string
  placeholderNotice?: LocalizedText
}

export type AuditRetentionPiiRisk = "low" | "medium" | "high"
export type AuditRetentionStatus = "placeholder" | "active" | "future"

export interface AuditRetentionProfile {
  code: string
  name: LocalizedText
  description: LocalizedText
  retentionDays: number
  exportable: boolean
  piiRisk: AuditRetentionPiiRisk
  status: AuditRetentionStatus
}

export type AuditLocale = SupportedLocale
