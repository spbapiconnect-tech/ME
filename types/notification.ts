import type { LocalizedText } from "@/types/module";

export type NotificationChannel =
  | "in-app"
  | "email-placeholder"
  | "whatsapp-placeholder"
  | "sms-placeholder"
  | "push-placeholder"
  | "webhook-placeholder"
  | "system";

export type NotificationCategory =
  | "task"
  | "approval"
  | "alert"
  | "reminder"
  | "report"
  | "audit"
  | "workflow"
  | "system"
  | "placeholder";

export type NotificationSeverity = "low" | "medium" | "high" | "critical";

export type NotificationStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "blocked" | "disabled";

export type NotificationRecipientType = "role" | "user-placeholder" | "store" | "module-owner" | "supplier-placeholder" | "system";

export interface NotificationSource {
  sourceModule: string;
  sourceRecordId?: string;
  sourcePage: string;
  sourceComponent: string;
  sourceEvent: string;
  sourceRoute?: string;
  actionKey?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  workflowKey?: string;
}

export interface NotificationRecipient {
  recipientType: NotificationRecipientType;
  role?: string;
  userId?: string;
  store?: string;
  label?: LocalizedText;
}

export interface NotificationMessage {
  title: LocalizedText;
  body: LocalizedText;
  shortBody?: LocalizedText;
  ctaLabel?: LocalizedText;
}

export interface NotificationRequirement {
  humanReviewRequired: boolean;
  auditRequired: boolean;
  permissionRequired?: string;
  roleRequired?: string;
  planRequired?: string;
  workflowKey?: string;
  actionKey?: string;
  auditEventKey?: string;
  accessRuleKey?: string;
}

export interface NotificationContract {
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  channel: NotificationChannel;
  category: NotificationCategory;
  severity: NotificationSeverity;
  status: NotificationStatus;
  source: NotificationSource;
  recipient: NotificationRecipient;
  message: NotificationMessage;
  requirement: NotificationRequirement;
  isPlaceholder: boolean;
  futureProviderKey?: string;
  futureTemplateKey?: string;
  notes?: LocalizedText;
}

export interface NotificationPreview {
  notificationKey: string;
  canSend: boolean;
  status: NotificationStatus;
  severity: NotificationSeverity;
  channel: NotificationChannel;
  reason: LocalizedText;
  recipientLabel?: string;
  messageTitle?: string;
  humanReviewRequired: boolean;
  auditRequired: boolean;
  permissionRequired?: string;
  placeholderNotice?: LocalizedText;
}

export interface NotificationTemplate {
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  category: NotificationCategory;
  defaultChannel: NotificationChannel;
  status: NotificationStatus;
  sampleTitle: LocalizedText;
  sampleBody: LocalizedText;
}
