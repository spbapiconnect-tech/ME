import type { MeModuleRegistryItem } from "@/lib/me/types";
import { storeOperationModules } from "@/lib/store-operations/store-operation-modules";

function getStoreOperationRegistryMeta(route: string): Pick<MeModuleRegistryItem, "key" | "iconKey" | "requiredPermission" | "supportedViews" | "dataSourceKey"> {
  switch (route) {
    case "/branches":
      return { key: "branches", iconKey: "Store", requiredPermission: "branches.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "branchMaster" };
    case "/tasks":
      return { key: "tasks", iconKey: "ListTodo", requiredPermission: "tasks.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "taskMaster" };
    case "/inspection":
      return { key: "inspection", iconKey: "ClipboardList", requiredPermission: "inspection.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "inspectionMaster" };
    case "/issues":
      return { key: "issues", iconKey: "AlertCircle", requiredPermission: "issues.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "issueMaster" };
    case "/expiry":
      return { key: "expiry", iconKey: "ClipboardCheck", requiredPermission: "expiry.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "expiryBatchMaster" };
    case "/sop":
      return { key: "sop", iconKey: "BookOpen", requiredPermission: "sop.view", supportedViews: ["table", "cards", "detail"], dataSourceKey: "sopMaster" };
    default:
      throw new Error(`Unsupported store operation route: ${route}`);
  }
}

const storeOperationRegistryItems: MeModuleRegistryItem[] = storeOperationModules.map((module) => {
  const meta = getStoreOperationRegistryMeta(module.route);
  return {
    key: meta.key,
    name: module.label,
    group: "Store Operations",
    route: module.route,
    iconKey: meta.iconKey,
    description: module.description,
    primaryAction: module.primaryActionLabel,
    supportedViews: [...meta.supportedViews],
    requiredPermission: meta.requiredPermission,
    status: "Active",
    dataSourceKey: meta.dataSourceKey,
  };
});

export const moduleRegistry: MeModuleRegistryItem[] = [
  { key: "dashboard", name: "Dashboard", group: "Dashboard", route: "/", iconKey: "LayoutDashboard", description: "Operations workbench and cross-module health.", primaryAction: "Open Workspace", supportedViews: ["summary"], requiredPermission: "dashboard.view", status: "Active", dataSourceKey: "workspaceSummary" },
  ...storeOperationRegistryItems,

  { key: "psi-overview", name: "PSI Overview", group: "PSI", route: "/psi", iconKey: "BarChart3", description: "PSI module operational overview.", primaryAction: "Open PSI", supportedViews: ["summary", "detail"], requiredPermission: "psi.view", status: "Active", dataSourceKey: "psiSummary" },
  { key: "procurement", name: "Procurement", group: "PSI", route: "/psi/procurement", iconKey: "Truck", description: "Purchase requests and orders.", primaryAction: "Create PR", supportedViews: ["table", "detail"], requiredPermission: "procurement.view", status: "Active", dataSourceKey: "psiProcurement" },
  { key: "supplier", name: "Supplier", group: "PSI", route: "/psi/supplier", iconKey: "Users", description: "Supplier relationship and quality control.", primaryAction: "Add Supplier", supportedViews: ["table", "detail"], requiredPermission: "supplier.view", status: "Active", dataSourceKey: "psiSupplier" },
  { key: "inventory", name: "Inventory", group: "PSI", route: "/psi/inventory", iconKey: "Warehouse", description: "SKU and stock control.", primaryAction: "Add SKU", supportedViews: ["table", "detail"], requiredPermission: "inventory.view", status: "Active", dataSourceKey: "psiInventory" },
  { key: "receiving", name: "Receiving", group: "PSI", route: "/psi/receiving", iconKey: "History", description: "Receiving and variance handling.", primaryAction: "New Receiving", supportedViews: ["table", "detail"], requiredPermission: "receiving.view", status: "Active", dataSourceKey: "psiReceiving" },

  { key: "staff", name: "Staff", group: "Workforce", route: "/staff", iconKey: "Users", description: "Staff roster and status.", primaryAction: "Add Staff", supportedViews: ["table", "cards", "detail"], requiredPermission: "staff.view", status: "Active", dataSourceKey: "staffMaster" },
  { key: "schedule", name: "Schedule", group: "Workforce", route: "/schedule", iconKey: "CalendarDays", description: "Shift schedule and coverage.", primaryAction: "Create Schedule", supportedViews: ["table", "cards", "board"], requiredPermission: "schedule.view", status: "Active", dataSourceKey: "scheduleMaster" },
  { key: "training", name: "Training", group: "Workforce", route: "/training", iconKey: "GraduationCap", description: "Training execution and completion.", primaryAction: "Add Course", supportedViews: ["table", "cards", "detail"], requiredPermission: "training.view", status: "Active", dataSourceKey: "trainingMaster" },
  { key: "roles", name: "Roles", group: "Workforce", route: "/roles", iconKey: "ShieldCheck", description: "Role assignments and permission scope.", primaryAction: "Add Role", supportedViews: ["table", "cards", "detail"], requiredPermission: "roles.view", status: "Active", dataSourceKey: "roleMaster" },

  { key: "reports", name: "Reports", group: "Business", route: "/reports", iconKey: "BarChart3", description: "Business report library.", primaryAction: "Create Report", supportedViews: ["table", "cards", "summary"], requiredPermission: "reports.view", status: "Active", dataSourceKey: "reportMaster" },
  { key: "reports-pos", name: "POS Report", group: "Business", route: "/reports/pos", iconKey: "CalendarRange", description: "POS sales performance summary.", primaryAction: "Generate Report", supportedViews: ["table", "cards", "summary"], requiredPermission: "reports.pos.view", status: "Active", dataSourceKey: "posReportMaster" },
  { key: "finance", name: "Finance", group: "Business", route: "/finance", iconKey: "Receipt", description: "Revenue and expense records.", primaryAction: "Add Record", supportedViews: ["table", "cards", "summary"], requiredPermission: "finance.view", status: "Active", dataSourceKey: "financeRecordMaster" },
  { key: "packages", name: "Packages", group: "Business", route: "/packages", iconKey: "Package", description: "Package and entitlement setup.", primaryAction: "Create Package", supportedViews: ["table", "cards"], requiredPermission: "packages.view", status: "Active", dataSourceKey: "packageMaster" },
  { key: "stakeholder", name: "Stakeholder Summary", group: "Business", route: "/stakeholder-summary", iconKey: "Building2", description: "Executive summary and risk posture.", primaryAction: "Export Summary", supportedViews: ["summary", "cards"], requiredPermission: "stakeholder.view", status: "Active", dataSourceKey: "stakeholderSummary" },

  { key: "settings", name: "Settings", group: "System", route: "/settings", iconKey: "Settings", description: "Workspace and security settings.", primaryAction: "Save Changes", supportedViews: ["summary", "detail"], requiredPermission: "settings.manage", status: "Active", dataSourceKey: "systemSettings" },
  { key: "access-control", name: "Access Control", group: "System", route: "/access-control", iconKey: "ShieldCheck", description: "User and role access control.", primaryAction: "Add Access Rule", supportedViews: ["table", "cards", "detail"], requiredPermission: "access.manage", status: "Active", dataSourceKey: "accessRules" },
  { key: "rules", name: "Rules", group: "System", route: "/rules", iconKey: "SlidersHorizontal", description: "Business and automation rules.", primaryAction: "Create Rule", supportedViews: ["table", "cards"], requiredPermission: "rules.manage", status: "Active", dataSourceKey: "ruleDefinitions" },
  { key: "notifications", name: "Notifications", group: "System", route: "/notifications", iconKey: "Bell", description: "Notification routing and channels.", primaryAction: "Create Notification Rule", supportedViews: ["table", "cards", "detail"], requiredPermission: "notifications.manage", status: "Active", dataSourceKey: "notificationRules" },
  { key: "integration", name: "Integrations", group: "System", route: "/integration", iconKey: "LayoutGrid", description: "External system connections.", primaryAction: "Add Connector", supportedViews: ["table", "cards"], requiredPermission: "integrations.manage", status: "Active", dataSourceKey: "integrationMaster" },
  { key: "workflow", name: "Workflow", group: "System", route: "/workflow", iconKey: "Workflow", description: "Workflow definitions and runtime state.", primaryAction: "Create Workflow", supportedViews: ["table", "cards", "board"], requiredPermission: "workflow.manage", status: "Active", dataSourceKey: "workflowDefinitions" },
  { key: "templates", name: "Templates", group: "System", route: "/templates", iconKey: "FileText", description: "Template catalog and usage.", primaryAction: "Create Template", supportedViews: ["table", "cards"], requiredPermission: "templates.manage", status: "Active", dataSourceKey: "templateMaster" },
  { key: "audit-trail", name: "Audit Trail", group: "System", route: "/audit-trail", iconKey: "ScrollText", description: "Operational and security audit logs.", primaryAction: "Export Audit Log", supportedViews: ["table", "cards"], requiredPermission: "audit.view", status: "Active", dataSourceKey: "auditEventMaster" },
];

export function getModulesByGroup(group: MeModuleRegistryItem["group"]) {
  return moduleRegistry.filter((item) => item.group === group);
}
