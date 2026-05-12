import type { ModulePageConfig } from "@/components/module/module-page-shell";
import { getStoreOperationModuleByLegacyKey } from "@/lib/store-operations/store-operation-modules";

type Key =
  | "inspection" | "issues" | "tasks" | "expiry" | "sop"
  | "staff" | "schedule" | "training" | "roles"
  | "reports" | "reports-pos" | "finance" | "branches" | "packages" | "stakeholder"
  | "settings" | "access" | "rules" | "notifications" | "integration" | "workflow" | "templates" | "audit"
  | "layout-engine" | "navigation" | "components" | "display-settings" | "demo-mode" | "demo-readiness" | "demo-story" | "system-foundation" | "action-contracts";

function deriveScenario(title: string) {
  const key = title.toLowerCase();
  const workforce = ["staff", "schedule", "training", "roles"];
  const business = ["reports", "pos report", "finance", "packages", "stakeholder summary"];
  const system = ["settings", "access control", "rules", "notifications", "integrations", "workflow", "templates", "audit trail"];

  if (workforce.includes(key)) {
    return {
      emptyGuide: `No ${key} records are configured yet. Set up workforce data and approval flow to activate this module.`,
      processSteps: ["Create workforce record", "Map role and branch", "Approve assignment", "Track completion"],
      quickActions: ["Assign Role", "Request Approval", "Export Workforce List"],
      workspaceCards: [
        { label: "People Queue", value: "0", note: "Workforce records pending action" },
        { label: "Coverage Status", value: "Not Configured", note: "Shift and staffing coverage not set" },
        { label: "Compliance Readiness", value: "Input Required", note: "Training and document inputs required" },
      ],
    };
  }

  if (business.includes(key)) {
    return {
      emptyGuide: `No ${key} records are configured yet. Add source records to generate management-level business outputs.`,
      processSteps: ["Capture source records", "Validate business metrics", "Review management summary", "Publish decision pack"],
      quickActions: ["Generate Summary", "Flag Variance", "Export Business Pack"],
      workspaceCards: [
        { label: "Decision Queue", value: "0", note: "Business records awaiting review" },
        { label: "Metric Health", value: "Not Configured", note: "Business metrics not yet baselined" },
        { label: "Reporting Readiness", value: "Input Required", note: "Input data required for report generation" },
      ],
    };
  }

  if (system.includes(key)) {
    return {
      emptyGuide: `No ${key} records are configured yet. Configure policies and controls before enabling this module for operations.`,
      processSteps: ["Create policy record", "Assign control owner", "Validate configuration", "Publish control state"],
      quickActions: ["Create Policy", "Run Validation", "Export Control Log"],
      workspaceCards: [
        { label: "Control Queue", value: "0", note: "Configuration records pending publication" },
        { label: "Policy Status", value: "Not Configured", note: "System policy baseline not configured" },
        { label: "Operational Safety", value: "Input Required", note: "Control inputs required before activation" },
      ],
    };
  }

  return {
    emptyGuide: `No ${key} records are configured yet. Create your first record and complete setup rules to activate this module.`,
    processSteps: ["Create record", "Assign owner", "Review status", "Close cycle"],
    quickActions: ["Assign Owner", "Escalate Priority", "Export Current List"],
    workspaceCards: [
      { label: "Operational Queue", value: "0", note: `${title} records pending execution` },
      { label: "Service SLA", value: "Not Configured", note: "Define SLA rules for this module" },
      { label: "Action Readiness", value: "Input Required", note: "Operator input required to activate workflows" },
    ],
  };
}

function emptyConfig(partial: Omit<ModulePageConfig, "rows">): ModulePageConfig {
  const scenario = deriveScenario(partial.title);
  return {
    ...scenario,
    ...partial,
    rows: [],
    processSteps: partial.processSteps ?? scenario.processSteps,
    quickActions: partial.quickActions ?? scenario.quickActions,
    workspaceCards: partial.workspaceCards ?? scenario.workspaceCards,
    emptyGuide: partial.emptyGuide ?? scenario.emptyGuide,
  };
}

function storeOperationConfig(moduleKey: "branches" | "inspection" | "issues" | "tasks" | "expiry" | "sop"): ModulePageConfig {
  const moduleDef = getStoreOperationModuleByLegacyKey(moduleKey);
  if (!moduleDef) {
    throw new Error(`Missing store operation module config for ${moduleKey}`);
  }

  return emptyConfig({
    title: moduleDef.label,
    description: moduleDef.description,
    primaryAction: moduleDef.primaryActionLabel,
    emptyStateTitle: moduleDef.emptyStateTitle,
    kpis: moduleDef.kpis.map((item) => ({ label: item.label, value: item.key.toLowerCase().includes("rate") || item.key.toLowerCase().includes("score") ? "0%" : item.key.toLowerCase().includes("cost") ? "0" : "0" })),
    chips: moduleDef.filters,
    searchPlaceholder: moduleDef.searchPlaceholder,
    tableTitle: moduleDef.recordLabel,
    detailTitle: moduleDef.detailTitle,
    detailActionLabel: `Open ${moduleDef.recordLabel}`,
    emptyGuide: moduleDef.emptyStateDescription,
    processSteps: [
      `Review ${moduleDef.recordLabel.toLowerCase()} status`,
      `Check linked ${moduleDef.linkedModules[0]?.replace(/-/g, " ") ?? "records"}`,
      "Assign next action",
      "Close operational follow-up",
    ],
    quickActions: [moduleDef.primaryActionLabel, "Review Linked Records", "Export Current List"],
    workspaceCards: moduleDef.kpis.slice(0, 3).map((item) => ({
      label: item.label,
      value: "0",
      note: `${moduleDef.recordLabel} operational indicator`,
    })),
  });
}

export const modulePages: Record<Key, ModulePageConfig> = {
  branches: storeOperationConfig("branches"),
  inspection: storeOperationConfig("inspection"),
  issues: storeOperationConfig("issues"),
  tasks: storeOperationConfig("tasks"),
  expiry: storeOperationConfig("expiry"),
  sop: storeOperationConfig("sop"),

  staff: emptyConfig({ title: "Staff", description: "Staff directory and status.", primaryAction: "Add Staff", kpis: [{ label: "Active Staff", value: "0" }, { label: "On Shift Today", value: "0" }, { label: "Pending Docs", value: "0" }, { label: "New Staff", value: "0" }], chips: ["Branch", "Role", "Active", "New"], searchPlaceholder: "Search staff", tableTitle: "Staff", detailTitle: "Profile Detail" }),
  schedule: emptyConfig({ title: "Schedule", description: "Shift planning and coverage.", primaryAction: "Create Schedule", secondaryAction: "Publish", kpis: [{ label: "Scheduled Today", value: "0" }, { label: "Coverage Gaps", value: "0" }, { label: "Pending Confirmation", value: "0" }, { label: "Total Hours", value: "0" }], chips: ["This Week", "Branch", "Shift", "Role"], searchPlaceholder: "Search shift", tableTitle: "Schedule", detailTitle: "Schedule Detail" }),
  training: emptyConfig({ title: "Training", description: "Training programs and progress.", primaryAction: "Add Course", kpis: [{ label: "Active Courses", value: "0" }, { label: "In Progress", value: "0" }, { label: "Completed", value: "0" }, { label: "Overdue Training", value: "0" }], chips: ["Required", "In Progress", "Completed", "Overdue"], searchPlaceholder: "Search course or staff", tableTitle: "Course", detailTitle: "Training Detail" }),
  roles: emptyConfig({ title: "Roles", description: "Role and permission mapping.", primaryAction: "Add Role", kpis: [{ label: "Total Roles", value: "0" }, { label: "Assigned Staff", value: "0" }, { label: "Permission Groups", value: "0" }, { label: "Review Needed", value: "0" }], chips: ["Store", "Manager", "Admin", "Custom"], searchPlaceholder: "Search role", tableTitle: "Role", detailTitle: "Permission Detail" }),

  reports: emptyConfig({ title: "Reports", description: "Business report library.", primaryAction: "Create Report", kpis: [{ label: "Available Reports", value: "0" }, { label: "Scheduled Reports", value: "0" }, { label: "Generated Today", value: "0" }, { label: "Attention Needed", value: "0" }], chips: ["Sales", "Stock", "Staff", "Finance"], searchPlaceholder: "Search report", tableTitle: "Report", detailTitle: "Report Detail" }),
  "reports-pos": emptyConfig({ title: "POS Report", description: "POS sales performance.", primaryAction: "Generate Report", secondaryAction: "Import POS Report", kpis: [{ label: "Net Sales", value: "0" }, { label: "Transactions", value: "0" }, { label: "Average Ticket", value: "0" }, { label: "Variance / Refunds", value: "0" }], chips: ["Date Range", "Branch", "Sales", "Refund"], searchPlaceholder: "Search POS report", tableTitle: "POS Entry", detailTitle: "POS Detail" }),
  finance: emptyConfig({ title: "Finance", description: "Revenue and expense records.", primaryAction: "Add Record", kpis: [{ label: "Revenue", value: "0" }, { label: "Expenses", value: "0" }, { label: "Gross Margin", value: "0%" }, { label: "Pending Review", value: "0" }], chips: ["Revenue", "Expense", "Pending", "Approved"], searchPlaceholder: "Search financial record", tableTitle: "Finance Record", detailTitle: "Finance Detail" }),
  packages: emptyConfig({ title: "Packages", description: "Package and module bundle configuration.", primaryAction: "Create Package", kpis: [{ label: "Active Packages", value: "0" }, { label: "Assigned Branches", value: "0" }, { label: "Modules Included", value: "0" }, { label: "Renewal Needed", value: "0" }], chips: ["Active", "Draft", "Expiring", "Custom"], searchPlaceholder: "Search package", tableTitle: "Package", detailTitle: "Package Detail" }),
  stakeholder: emptyConfig({ title: "Stakeholder Summary", description: "Executive operational summary.", primaryAction: "Export Summary", kpis: [{ label: "Business Health", value: "Not Configured" }, { label: "Open Risks", value: "0" }, { label: "Weekly Progress", value: "0%" }, { label: "Pending Decisions", value: "0" }], searchPlaceholder: "Search summary", tableTitle: "Summary Item", detailTitle: "Summary Detail" }),

  settings: emptyConfig({ title: "Settings", description: "Workspace settings and defaults.", primaryAction: "Save Changes", kpis: [{ label: "Workspace", value: "Not Configured" }, { label: "Appearance", value: "Not Configured" }, { label: "Branch Defaults", value: "Not Configured" }, { label: "Security", value: "Not Configured" }], searchPlaceholder: "Search setting", tableTitle: "Setting Section", detailTitle: "Settings Detail" }),
  access: emptyConfig({ title: "Access Control", description: "Access policy and role assignment.", primaryAction: "Add Access Rule", kpis: [{ label: "Active Users", value: "0" }, { label: "Roles", value: "0" }, { label: "Restricted Areas", value: "0" }, { label: "Review Needed", value: "0" }], chips: ["Admin", "Manager", "Staff", "Restricted"], searchPlaceholder: "Search user or role", tableTitle: "Access Rule", detailTitle: "Access Detail" }),
  rules: emptyConfig({ title: "Rules", description: "Business rules and automation.", primaryAction: "Create Rule", kpis: [{ label: "Active Rules", value: "0" }, { label: "Draft Rules", value: "0" }, { label: "Failed Runs", value: "0" }, { label: "Last Updated", value: "Not Configured" }], chips: ["Active", "Draft", "Error", "System"], searchPlaceholder: "Search rule", tableTitle: "Rule", detailTitle: "Rule Detail" }),
  notifications: emptyConfig({ title: "Notifications", description: "Notification routing and channels.", primaryAction: "Create Notification Rule", kpis: [{ label: "Sent Today", value: "0" }, { label: "Unread", value: "0" }, { label: "Failed", value: "0" }, { label: "Active Channels", value: "0" }], chips: ["Unread", "Failed", "System", "Staff"], searchPlaceholder: "Search notification", tableTitle: "Notification", detailTitle: "Notification Detail" }),
  integration: emptyConfig({ title: "Integrations", description: "Connector and sync management.", primaryAction: "Add Connector", kpis: [{ label: "Connected", value: "0" }, { label: "Needs Setup", value: "0" }, { label: "Sync Issues", value: "0" }, { label: "Last Sync", value: "Not Configured" }], chips: ["Connected", "Setup Required", "Error", "Available"], searchPlaceholder: "Search connector", tableTitle: "Connector", detailTitle: "Connector Detail" }),
  workflow: emptyConfig({ title: "Workflow", description: "Workflow definitions and runtime status.", primaryAction: "Create Workflow", kpis: [{ label: "Active Workflows", value: "0" }, { label: "Runs Today", value: "0" }, { label: "Failed Runs", value: "0" }, { label: "Pending Approval", value: "0" }], chips: ["Active", "Draft", "Failed", "Approval"], searchPlaceholder: "Search workflow", tableTitle: "Workflow", detailTitle: "Workflow Detail" }),
  templates: emptyConfig({ title: "Templates", description: "Template library.", primaryAction: "Create Template", kpis: [{ label: "Active Templates", value: "0" }, { label: "Used This Week", value: "0" }, { label: "Need Review", value: "0" }, { label: "Categories", value: "0" }], chips: ["SOP", "Report", "Form", "Message"], searchPlaceholder: "Search template", tableTitle: "Template", detailTitle: "Template Detail" }),
  audit: emptyConfig({ title: "Audit Trail", description: "Audit event history.", primaryAction: "Export Audit Log", kpis: [{ label: "Events Today", value: "0" }, { label: "Critical Events", value: "0" }, { label: "User Changes", value: "0" }, { label: "System Changes", value: "0" }], chips: ["Today", "Critical", "User", "System"], searchPlaceholder: "Search event or user", tableTitle: "Audit Event", detailTitle: "Audit Detail" }),

  "layout-engine": emptyConfig({ title: "Layout Engine", description: "Internal layout policy controls.", primaryAction: "Update Layout Policy", kpis: [{ label: "Active Layout Profiles", value: "0" }, { label: "Recent Changes", value: "0" }, { label: "Validation Errors", value: "0" }, { label: "Published", value: "0" }], searchPlaceholder: "Search layout profile", tableTitle: "Layout Profile", detailTitle: "Layout Detail" }),
  navigation: emptyConfig({ title: "Navigation", description: "Route grouping and navigation definitions.", primaryAction: "Update Navigation", kpis: [{ label: "Module Groups", value: "0" }, { label: "Active Routes", value: "0" }, { label: "Pending Changes", value: "0" }, { label: "Broken Links", value: "0" }], searchPlaceholder: "Search route", tableTitle: "Route", detailTitle: "Route Detail" }),
  components: emptyConfig({ title: "Components", description: "Component registry and status.", primaryAction: "Review Components", kpis: [{ label: "Registered Components", value: "0" }, { label: "In Use", value: "0" }, { label: "Deprecated", value: "0" }, { label: "Needs Review", value: "0" }], searchPlaceholder: "Search component", tableTitle: "Component", detailTitle: "Component Detail" }),
  "display-settings": emptyConfig({ title: "Display Settings", description: "Display and density policies.", primaryAction: "Save Display Settings", kpis: [{ label: "Profiles", value: "0" }, { label: "Default Theme", value: "Not Configured" }, { label: "Density Mode", value: "Not Configured" }, { label: "Last Changed", value: "Not Configured" }], searchPlaceholder: "Search display setting", tableTitle: "Display Policy", detailTitle: "Display Detail" }),
  "demo-mode": emptyConfig({ title: "Presentation Mode", description: "Presentation profile controls.", primaryAction: "Update Presentation Mode", kpis: [{ label: "Active Presets", value: "0" }, { label: "Locked Data Views", value: "0" }, { label: "Session Templates", value: "0" }, { label: "Last Session", value: "Not Configured" }], searchPlaceholder: "Search presentation setting", tableTitle: "Presentation Preset", detailTitle: "Presentation Detail" }),
  "demo-readiness": emptyConfig({ title: "Readiness Check", description: "Readiness validation checklist.", primaryAction: "Run Readiness Check", kpis: [{ label: "Checklist Items", value: "0" }, { label: "Passed", value: "0" }, { label: "Needs Attention", value: "0" }, { label: "Last Run", value: "Not Configured" }], searchPlaceholder: "Search readiness item", tableTitle: "Readiness Item", detailTitle: "Readiness Detail" }),
  "demo-story": emptyConfig({ title: "Walkthrough Story", description: "Walkthrough narrative configuration.", primaryAction: "Update Walkthrough", kpis: [{ label: "Story Sections", value: "0" }, { label: "Published", value: "0" }, { label: "In Review", value: "0" }, { label: "Last Edit", value: "Not Configured" }], searchPlaceholder: "Search story step", tableTitle: "Story Step", detailTitle: "Story Detail" }),
  "system-foundation": emptyConfig({ title: "System Foundation", description: "Foundation-level policies and contracts.", primaryAction: "Update Foundation", kpis: [{ label: "Core Policies", value: "0" }, { label: "Dependency Maps", value: "0" }, { label: "Pending Reviews", value: "0" }, { label: "Last Audit", value: "Not Configured" }], searchPlaceholder: "Search foundation policy", tableTitle: "Foundation Policy", detailTitle: "Foundation Detail" }),
  "action-contracts": emptyConfig({ title: "Action Contracts", description: "Action payload and contract definitions.", primaryAction: "Create Contract", kpis: [{ label: "Active Contracts", value: "0" }, { label: "Versioned", value: "0" }, { label: "Breaking Changes", value: "0" }, { label: "Pending Review", value: "0" }], searchPlaceholder: "Search action contract", tableTitle: "Contract", detailTitle: "Contract Detail" }),
};
