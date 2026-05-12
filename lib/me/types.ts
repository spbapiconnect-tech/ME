export type MeModuleGroup = "Dashboard" | "Store Operations" | "PSI" | "Workforce" | "Business" | "System";

export type MeModuleStatus = "Active" | "Draft" | "Setup Required" | "Review" | "Internal";

export type MeModuleRegistryItem = {
  key: string;
  name: string;
  group: MeModuleGroup;
  route: string;
  iconKey: string;
  description: string;
  primaryAction: string;
  supportedViews: Array<"table" | "cards" | "detail" | "board" | "summary">;
  requiredPermission: string;
  status: MeModuleStatus;
  dataSourceKey: string;
};

export type MeRuleDefinition = {
  id: string;
  module: string;
  condition: string;
  action: string;
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  description: string;
};

export type WorkflowTransition = {
  from: string;
  to: string;
  action: string;
  ownerRole: string;
  nextActionLabel: string;
};

export type WorkflowDefinition = {
  id: string;
  module: string;
  states: string[];
  transitions: WorkflowTransition[];
};

export type MeBrainSignal = {
  key: string;
  watch: string[];
  suggestedActions: string[];
  riskSignals: string[];
  autoSummaryFields: string[];
  operatorHints: string[];
};
