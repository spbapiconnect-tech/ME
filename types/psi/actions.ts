import type { LocalizedText } from "@/types/module";

export type PsiActionDraftStatus = "draft" | "placeholder" | "preview-only" | "coming-soon" | "blocked" | "disabled";

export type PsiActionDraftCategory = "procurement" | "supplier" | "inventory" | "receiving" | "issue" | "stock" | "system";

export type PsiActionDraftIntent =
  | "create"
  | "update-placeholder"
  | "review"
  | "approve-placeholder"
  | "receive"
  | "adjust"
  | "transfer"
  | "report-issue"
  | "suggest"
  | "configure"
  | "placeholder";

export type PsiActionFieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "quantity"
  | "select"
  | "multi-select"
  | "date"
  | "date-range"
  | "supplier-select"
  | "sku-select"
  | "store-select"
  | "warehouse-select"
  | "file-placeholder"
  | "evidence-placeholder";

export interface PsiActionField {
  key: string;
  label: LocalizedText;
  fieldType: PsiActionFieldType;
  required: boolean;
  placeholder?: LocalizedText;
  helper?: LocalizedText;
  options?: Array<{ label: LocalizedText; value: string }>;
  defaultValue?: string | number | boolean | string[];
  isPlaceholder: boolean;
}

export interface PsiActionSection {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: PsiActionField[];
}

export interface PsiActionDraftSource {
  moduleCode: string;
  sourceRoute?: string;
  sourceRecordId?: string;
  sourceRecordType?: string;
  actionKey?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  workflowKey?: string;
  notificationKey?: string;
  packageKey?: string;
}

export interface PsiActionDraftRequirement {
  permissionRequired?: string;
  roleRequired?: string;
  planRequired?: string;
  auditRequired: boolean;
  confirmationRequired: boolean;
  humanReviewRequired: boolean;
  createsTaskPlaceholder: boolean;
  triggersWorkflowPlaceholder: boolean;
  sendsNotificationPlaceholder: boolean;
  isPlaceholder: boolean;
}

export interface PsiActionDraftContract {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  category: PsiActionDraftCategory;
  intent: PsiActionDraftIntent;
  status: PsiActionDraftStatus;
  source: PsiActionDraftSource;
  sections: PsiActionSection[];
  requirement: PsiActionDraftRequirement;
  submitLabel: LocalizedText;
  cancelLabel: LocalizedText;
  linkedRoute?: string;
  futureServiceMethod?: string;
  futureRepositoryMethod?: string;
  futureApiEndpoint?: string;
  notes?: LocalizedText;
}

export interface PsiActionDraftPreview {
  actionDraftKey: string;
  canSubmit: boolean;
  status: PsiActionDraftStatus;
  title: LocalizedText;
  reason: LocalizedText;
  fieldCount: number;
  requiredFieldCount: number;
  auditRequired: boolean;
  confirmationRequired: boolean;
  createsTaskPlaceholder: boolean;
  triggersWorkflowPlaceholder: boolean;
  sendsNotificationPlaceholder: boolean;
  placeholderNotice?: LocalizedText;
}
