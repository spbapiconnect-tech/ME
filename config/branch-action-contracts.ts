export type BranchActionStatus =
  | "ui-ready"
  | "contract-ready"
  | "api-deferred"
  | "blocked";

export type BranchActionContract = {
  key: string;
  label: { en: string; zh: string };
  module: "branches";
  surface:
    | "page-header"
    | "filter-bar"
    | "table-row"
    | "detail-panel"
    | "right-rail"
    | "settings";
  currentBehavior: string;
  futureBehavior: string;
  permission: string;
  inputSchema: string[];
  outputSchema: string[];
  auditEvent?: string;
  notification?: string;
  targetRoute?: string;
  apiBoundary?: string;
  status: BranchActionStatus;
};

export const branchActionContracts: BranchActionContract[] = [
  {
    key: "branch.create",
    label: { en: "Add Branch", zh: "新增门店" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Opens the Add New Branch sheet with sample form fields.",
    futureBehavior: "Creates a branch after validation and refreshes the branch list.",
    permission: "branch.write",
    inputSchema: ["branchName", "branchCode", "regionId", "managerId?", "phone?", "address?", "status?"],
    outputSchema: ["branchId", "branchCode", "createdAt"],
    auditEvent: "branch.created",
    notification: "branch.created.optional",
    apiBoundary: "POST /api/branches",
    status: "contract-ready",
  },
  {
    key: "branch.export",
    label: { en: "Export", zh: "导出" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Shows an export toast placeholder.",
    futureBehavior: "Exports filtered branch records to CSV, Excel, or PDF.",
    permission: "branch.export",
    inputSchema: ["filters", "selectedBranchIds?", "format"],
    outputSchema: ["fileUrl", "generatedAt", "recordCount"],
    auditEvent: "branch.exported",
    apiBoundary: "POST /api/branches/export",
    status: "api-deferred",
  },
  {
    key: "branch.viewReports",
    label: { en: "View Reports", zh: "查看报表" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Routes to /reports?module=branches.",
    futureBehavior: "Routes to reports with branch, region, and date filter context.",
    permission: "report.read",
    inputSchema: ["module", "branchId?", "regionId?", "dateFrom?", "dateTo?"],
    outputSchema: ["route"],
    targetRoute: "/reports?module=branches",
    status: "contract-ready",
  },
  {
    key: "branch.openTasks",
    label: { en: "Open Tasks", zh: "打开任务" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Routes to /tasks?module=branches.",
    futureBehavior: "Routes to tasks filtered by branch or branch module context.",
    permission: "task.read",
    inputSchema: ["module", "branchId?", "status?", "priority?"],
    outputSchema: ["route"],
    targetRoute: "/tasks?module=branches",
    status: "contract-ready",
  },
  {
    key: "branch.createTask",
    label: { en: "Create Task", zh: "创建任务" },
    module: "branches",
    surface: "detail-panel",
    currentBehavior: "Shows a task creation toast placeholder.",
    futureBehavior: "Opens task creation sheet with branchId and linked branch context.",
    permission: "task.write",
    inputSchema: ["branchId", "sourceModule", "title", "priority", "assigneeId?", "dueDate?", "linkedRecordId?"],
    outputSchema: ["taskId", "createdAt"],
    auditEvent: "task.created_from_branch",
    notification: "task.assigned.optional",
    apiBoundary: "POST /api/tasks",
    status: "api-deferred",
  },
  {
    key: "branch.import",
    label: { en: "Import Branches", zh: "导入门店" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Exists as a More menu item.",
    futureBehavior: "Opens import sheet for CSV or Excel branch master data upload.",
    permission: "branch.import",
    inputSchema: ["file", "mappingProfile?", "dryRun"],
    outputSchema: ["validRows", "invalidRows", "importBatchId"],
    auditEvent: "branch.import_started",
    apiBoundary: "POST /api/branches/import",
    status: "api-deferred",
  },
  {
    key: "branch.batchEdit",
    label: { en: "Batch Edit", zh: "批量编辑" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Exists as a More menu item.",
    futureBehavior: "Batch updates selected branches.",
    permission: "branch.write",
    inputSchema: ["selectedBranchIds", "patch"],
    outputSchema: ["updatedCount", "skippedCount"],
    auditEvent: "branch.batch_updated",
    apiBoundary: "PATCH /api/branches/batch",
    status: "api-deferred",
  },
  {
    key: "branch.archive",
    label: { en: "Delete Archive", zh: "归档门店" },
    module: "branches",
    surface: "page-header",
    currentBehavior: "Exists as a destructive More menu item.",
    futureBehavior: "Archives branches instead of hard deleting them.",
    permission: "branch.archive",
    inputSchema: ["selectedBranchIds", "reason"],
    outputSchema: ["archivedCount", "archivedAt"],
    auditEvent: "branch.archived",
    apiBoundary: "POST /api/branches/archive",
    status: "api-deferred",
  },
  {
    key: "branch.filter.more",
    label: { en: "More Filters", zh: "更多筛选" },
    module: "branches",
    surface: "filter-bar",
    currentBehavior: "Displays filter button UI.",
    futureBehavior: "Opens advanced filter drawer for region, status, manager, alerts, score, and date range.",
    permission: "branch.read",
    inputSchema: ["regionId?", "status?", "managerId?", "alertLevel?", "inspectionScoreRange?", "dateRange?"],
    outputSchema: ["filters"],
    status: "contract-ready",
  },
  {
    key: "branch.region.manage",
    label: { en: "Manage Regions", zh: "管理区域" },
    module: "branches",
    surface: "settings",
    currentBehavior: "Region values are local UI sample values.",
    futureBehavior: "Region options come from Settings / Master Data / Region Management.",
    permission: "settings.region.write",
    inputSchema: ["regionId", "name", "status", "sortOrder?"],
    outputSchema: ["regionId", "updatedAt"],
    targetRoute: "/settings?section=regions",
    apiBoundary: "POST /api/settings/regions",
    status: "api-deferred",
  },
];

export function getBranchActionContract(key: string) {
  return branchActionContracts.find((action) => action.key === key) ?? null;
}

export function getBranchActionContractsBySurface(surface: BranchActionContract["surface"]) {
  return branchActionContracts.filter((action) => action.surface === surface);
}
