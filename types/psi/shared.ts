import type { LocalizedText } from "@/types/module";

export type PsiRecordStatus =
  | "draft"
  | "active"
  | "review"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "disputed"
  | "blocked"
  | "archived";

export type PsiPriority = "low" | "medium" | "high" | "critical";

export interface PsiMoney {
  amount: number;
  currency: string;
}

export interface PsiQuantity {
  value: number;
  unit: string;
}

export interface PsiDateRange {
  from?: string;
  to?: string;
}

export interface PsiSourceRef {
  moduleCode: string;
  recordId: string;
  recordType: string;
  route?: string;
}

export interface PsiAuditPlaceholder {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface PsiIssueSummary {
  issueId: string;
  title: LocalizedText;
  status: PsiRecordStatus;
  priority: PsiPriority;
  sourceRef: PsiSourceRef;
}

export interface PsiLinkedTaskPlaceholder {
  taskId: string;
  title: LocalizedText;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
}
