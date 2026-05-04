import type { LocalizedText } from "@/types/module";
import type { TaskSourceMapping } from "@/types/source-mapping";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in-progress" | "review" | "blocked" | "done" | "rejected" | "overdue";
export type TaskType = "manual" | "system" | "approval" | "issue" | "training" | "replenishment" | "audit";
export type TaskSourceModule = "procurement" | "supplier" | "inventory" | "pos-report" | "education" | "task";

export interface TaskLinkedRecord {
  moduleCode: TaskSourceModule;
  recordId: string;
  label: LocalizedText;
  route: string;
}

export interface TaskEvidenceItem {
  id: string;
  label: LocalizedText;
  type: "note" | "image" | "document" | "log";
  value: string;
}

export interface TaskTimelineItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  timestamp: string;
  status: TaskStatus;
}

export interface TaskActionItem {
  key: string;
  label: LocalizedText;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}

export interface TaskAuditTrailEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  note: string;
}

export interface TaskRecord {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  sourceModule: TaskSourceModule;
  sourceRecordId: string;
  sourceType: string;
  sourcePage: string;
  sourceComponent: string;
  ownerRole: string;
  ownerName: string;
  store: string;
  priority: TaskPriority;
  status: TaskStatus;
  taskType: TaskType;
  dueAt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  linkedRecords: TaskLinkedRecord[];
  evidence: TaskEvidenceItem[];
  timeline: TaskTimelineItem[];
  actions: TaskActionItem[];
  auditTrail: TaskAuditTrailEntry[];
  sourceMapping: TaskSourceMapping;
}

export interface TaskStats {
  total: number;
  overdue: number;
  inProgress: number;
  review: number;
  blocked: number;
  done: number;
  byPriority: Record<TaskPriority, number>;
  byStatus: Record<TaskStatus, number>;
}

export interface TaskSourceSummaryItem {
  moduleCode: TaskSourceModule;
  total: number;
  overdue: number;
  review: number;
  route: string;
}
