export interface RestaurantBrainRuleDefinition {
  key: string;
  module: string;
  triggerSource: string;
  conditionDescription: string;
  suggestedAction: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  futureWorkflowTarget: string;
  status: "planning-only" | "ui-preview-only";
  notExecutable: true;
}

export const restaurantBrainRules: RestaurantBrainRuleDefinition[] = [
  { key: "low-stock-suggest-purchase-request", module: "inventory", triggerSource: "inventory_stock", conditionDescription: "When stock coverage falls below minimum and no inbound supply covers the gap.", suggestedAction: "Suggest a procurement request preview in PSI.", riskLevel: "high", futureWorkflowTarget: "procurement_request", status: "planning-only", notExecutable: true },
  { key: "expiry-risk-create-watch-item", module: "expiry", triggerSource: "expiry_labels", conditionDescription: "When days remaining enters the watch window or a label is missing.", suggestedAction: "Surface a food-safety watch item in expiry and issue workspaces.", riskLevel: "high", futureWorkflowTarget: "issue_watch", status: "planning-only", notExecutable: true },
  { key: "inspection-failure-suggest-corrective-task", module: "inspection", triggerSource: "inspection_findings", conditionDescription: "When critical or repeated findings remain unresolved after review.", suggestedAction: "Suggest a corrective task placeholder linked to inspection and issue records.", riskLevel: "critical", futureWorkflowTarget: "task", status: "planning-only", notExecutable: true },
  { key: "schedule-coverage-gap-alert-manager", module: "schedule", triggerSource: "shift_assignments", conditionDescription: "When required headcount is not met for a planned shift.", suggestedAction: "Show a coverage alert in schedule and staff workspaces.", riskLevel: "high", futureWorkflowTarget: "schedule_alert", status: "planning-only", notExecutable: true },
  { key: "supplier-issue-request-follow-up", module: "supplier", triggerSource: "issues", conditionDescription: "When supplier-linked pricing, lead-time, or quality issues remain open.", suggestedAction: "Suggest supplier follow-up inside supplier and procurement previews.", riskLevel: "medium", futureWorkflowTarget: "supplier_follow_up", status: "planning-only", notExecutable: true },
  { key: "staff-training-gap-recommend-course", module: "training", triggerSource: "training_records", conditionDescription: "When a staff member lacks required completion for the assigned role or SOP.", suggestedAction: "Recommend a course or refresher in training and staff workspaces.", riskLevel: "medium", futureWorkflowTarget: "training_recommendation", status: "planning-only", notExecutable: true },
  { key: "branch-abnormal-sales-flag-review", module: "reports", triggerSource: "pos_sales_daily", conditionDescription: "When branch sales variance exceeds expected thresholds.", suggestedAction: "Flag branch performance review in reports and finance previews.", riskLevel: "medium", futureWorkflowTarget: "report_review", status: "planning-only", notExecutable: true },
  { key: "recipe-sop-mismatch-trigger-review", module: "sop", triggerSource: "product_sops", conditionDescription: "When recipe version, product standard, or linked training versions diverge.", suggestedAction: "Surface a standards review watch item in SOP and training workspaces.", riskLevel: "medium", futureWorkflowTarget: "standard_review", status: "planning-only", notExecutable: true },
  { key: "label-missing-flag-food-safety-issue", module: "expiry", triggerSource: "label_logs", conditionDescription: "When required expiry labels are missing in active storage zones.", suggestedAction: "Flag a food-safety issue and connect it to inspections and branch review.", riskLevel: "critical", futureWorkflowTarget: "food_safety_issue", status: "planning-only", notExecutable: true },
];
