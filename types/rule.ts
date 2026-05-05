import type { LocalizedText, SupportedLocale } from "@/types/module";

export type RuleType =
  | "formula"
  | "threshold"
  | "condition"
  | "score"
  | "risk"
  | "sla"
  | "validation"
  | "recommendation"
  | "escalation"
  | "placeholder";

export type RuleStatus = "active" | "preview-only" | "placeholder" | "coming-soon" | "blocked" | "disabled";

export type RuleSeverity = "neutral" | "low" | "medium" | "high" | "critical";

export type RuleInputType =
  | "metric"
  | "field"
  | "dimension"
  | "status"
  | "date"
  | "amount"
  | "count"
  | "percentage"
  | "boolean"
  | "text"
  | "custom";

export type RuleOutputType =
  | "number"
  | "currency"
  | "percentage"
  | "status"
  | "severity"
  | "boolean"
  | "text"
  | "recommendation"
  | "task-placeholder"
  | "notification-placeholder"
  | "workflow-placeholder";

export type RuleConditionOperator =
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "eq"
  | "neq"
  | "contains"
  | "in"
  | "between"
  | "exists"
  | "missing"
  | "custom";

export interface RuleSource {
  sourceModule: string;
  sourcePage?: string;
  sourceRoute?: string;
  sourceComponent?: string;
  sourceService?: string;
  sourceRepository?: string;
  sourceDataset?: string;
  actionKey?: string;
  accessRuleKey?: string;
  auditEventKey?: string;
  workflowKey?: string;
  notificationKey?: string;
  reportWidgetKey?: string;
}

export interface RuleInput {
  key: string;
  label: LocalizedText;
  inputType: RuleInputType;
  sampleValue?: string | number | boolean;
  required: boolean;
  description?: LocalizedText;
}

export interface RuleOutput {
  key: string;
  label: LocalizedText;
  outputType: RuleOutputType;
  sampleValue?: string | number | boolean;
  severity?: RuleSeverity;
  description?: LocalizedText;
}

export interface RuleCondition {
  key: string;
  label: LocalizedText;
  operator: RuleConditionOperator;
  thresholdValue?: string | number | boolean | [number, number];
  compareField?: string;
  description?: LocalizedText;
}

export interface RuleRequirement {
  permissionRequired?: string;
  roleRequired?: string;
  planRequired?: string;
  auditRequired: boolean;
  humanReviewRequired: boolean;
  canTriggerWorkflow: boolean;
  canSendNotification: boolean;
  canCreateTask: boolean;
  isPlaceholder: boolean;
}

export interface RuleContract {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  ruleType: RuleType;
  status: RuleStatus;
  severity: RuleSeverity;
  source: RuleSource;
  inputs: RuleInput[];
  outputs: RuleOutput[];
  conditions: RuleCondition[];
  requirement: RuleRequirement;
  sampleExpression?: string;
  sampleExplanation?: LocalizedText;
  linkedRoute?: string;
  samplePreviewEnabled?: boolean;
  futureRuleEngineKey?: string;
  futureFormulaKey?: string;
  futureAutomationKey?: string;
  notes?: LocalizedText;
}

export interface RulePreview {
  ruleKey: string;
  canEvaluate: boolean;
  status: RuleStatus;
  severity: RuleSeverity;
  title: LocalizedText;
  reason: LocalizedText;
  sourceModule: string;
  inputCount: number;
  outputCount: number;
  conditionCount: number;
  auditRequired: boolean;
  humanReviewRequired: boolean;
  canTriggerWorkflow: boolean;
  canSendNotification: boolean;
  canCreateTask: boolean;
  placeholderNotice?: LocalizedText;
}

export type RuleGroupStatus = RuleStatus;

export type RuleGroupCategory =
  | "inventory"
  | "pos"
  | "procurement"
  | "supplier"
  | "task"
  | "education"
  | "workflow"
  | "notification"
  | "report"
  | "system";

export interface RuleGroupContract {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  sourceModule?: string;
  rules: string[];
  status: RuleGroupStatus;
  category: RuleGroupCategory;
  notes?: LocalizedText;
}

export type RuleLocale = SupportedLocale;
