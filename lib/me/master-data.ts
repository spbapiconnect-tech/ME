import { psiInventoryPageData, psiProcurementPageData, psiSupplierPageData } from "@/data/psi";

export const branchMaster: Array<{
  branchId: string;
  name: string;
  region: string;
  manager: string;
  status: string;
  todaySales: number;
  openTasks: number;
  stockAlerts: number;
  inspectionScore: number;
  lastActivity: string;
}> = [];

export const staffMaster: Array<{
  staffId: string;
  name: string;
  role: string;
  branchId: string;
  status: string;
}> = [];

export const roleMaster: Array<{
  roleId: string;
  name: string;
  permissionGroup: string;
}> = [];

export const permissionMaster: Array<{
  key: string;
  description: string;
}> = [];

export const supplierMaster = psiSupplierPageData.suppliers;
export const productMaster = psiSupplierPageData.products;
export const skuMaster = psiInventoryPageData.skus;
export const storageLocationMaster = psiInventoryPageData.storeStocks;

export const sopMaster = [
  { sopId: "SOP-001", title: "Daily Opening Procedure", category: "Kitchen", version: "v3.2", owner: "Operations", reviewDue: "2026-06-15" },
  { sopId: "SOP-002", title: "Food Allergy Handling", category: "Service", version: "v1.9", owner: "QA", reviewDue: "2026-05-20" },
];

export const inspectionMaster: Array<{
  inspectionId: string;
  checklistName: string;
  branchId: string;
  score: number;
  failedItems: number;
  inspector: string;
  reviewStatus: string;
}> = [];

export const taskMaster: Array<{
  taskId: string;
  title: string;
  branchId: string;
  owner: string;
  dueAt: string;
  priority: string;
  status: string;
}> = [];

export const issueMaster: Array<{
  issueId: string;
  title: string;
  severity: string;
  branchId: string;
  owner: string;
  status: string;
}> = [];

export const expiryBatchMaster = [
  { batchId: "EXP-001", item: "Fresh Milk 2L", batchCode: "M23019", storage: "Chiller A", expiryDate: "2026-05-11", checkedBy: "Storekeeper", status: "Pending" },
  { batchId: "EXP-002", item: "Yogurt Cup", batchCode: "Y88310", storage: "Front Cooler", expiryDate: "2026-05-10", checkedBy: "Supervisor", status: "Review" },
];

export const reportMaster = [
  { reportId: "RPT-001", name: "Daily Sales by Branch", category: "Sales", frequency: "Daily", status: "Active" },
  { reportId: "RPT-002", name: "Waste & Expiry Snapshot", category: "Stock", frequency: "Daily", status: "Review" },
];

export const financeRecordMaster = [
  { recordId: "FIN-001", type: "Revenue", amount: 2310000, status: "Active" },
  { recordId: "FIN-002", type: "Expense", amount: 1440000, status: "Review" },
];

export const integrationMaster = [
  { integrationId: "INT-001", name: "POS Gateway", status: "Active", lastSync: "2026-05-11T10:21:00Z" },
  { integrationId: "INT-002", name: "Payroll Provider", status: "Setup Required", lastSync: null },
];

export const notificationRuleMaster = [
  { ruleId: "NTF-001", name: "Critical Issue Escalation", channel: "App+Email", status: "Active" },
  { ruleId: "NTF-002", name: "Shift Confirmation Reminder", channel: "App+SMS", status: "Review" },
];

export const auditEventMaster = [
  { eventId: "AUD-001", event: "Permission rule updated", severity: "critical", module: "Access Control", at: "2026-05-11T09:18:00Z" },
  { eventId: "AUD-002", event: "Branch settings saved", severity: "medium", module: "Settings", at: "2026-05-11T08:42:00Z" },
];

export function getPsiMasterDataSnapshot() {
  return {
    procurement: psiProcurementPageData,
    supplier: psiSupplierPageData,
    inventory: psiInventoryPageData,
  };
}
