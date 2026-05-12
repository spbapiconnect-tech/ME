import type { ModuleRow } from "@/components/module/module-page-shell";
import {
  calculateBranchExpiryRiskScore,
  calculateDisposedQuantity,
  calculateExpiringInThreeDaysCount,
  calculateExpiringTodayCount,
  calculateFefoPriority,
  calculatePendingExpiryProofCount,
  calculateRemainingDays,
  calculateUseFirstCount,
  calculateWasteCost,
} from "@/lib/calculators/store-operation-calculators";

export type FefoBatchView = {
  row: ModuleRow;
  branch: string;
  productName: string;
  batchNo: string;
  lotNo: string;
  supplier: string;
  receivingRef: string;
  storageLocation: string;
  quantity: string;
  unit: string;
  receivedDate: string;
  expiryDate: string;
  remainingDays: number;
  fefoPriority: string;
  status: string;
  actionType: string;
  checkedBy: string;
  checkedAt: string;
  disposedQuantity: string;
  wasteReason: string;
  wasteCost: string;
  photoProofStatus: string;
  linkedOutletExecutionId: string;
  linkedOutletExecution: string;
  linkedIncidentId: string;
  linkedIncident: string;
};

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

export function toFefoBatchView(row: ModuleRow): FefoBatchView {
  const remainingDays = calculateRemainingDays(row);
  return {
    row,
    branch: detailValue(row, "Branch") || row.subtitle,
    productName: detailValue(row, "Product Name") || row.title,
    batchNo: detailValue(row, "Batch No.") || detailValue(row, "Batch") || "",
    lotNo: detailValue(row, "Lot No.") || "",
    supplier: detailValue(row, "Supplier") || "",
    receivingRef: detailValue(row, "Receiving Ref") || "",
    storageLocation: detailValue(row, "Storage Location") || detailValue(row, "Storage") || "",
    quantity: detailValue(row, "Quantity") || "0",
    unit: detailValue(row, "Unit") || "",
    receivedDate: detailValue(row, "Received Date") || "",
    expiryDate: detailValue(row, "Expiry Date") || "",
    remainingDays,
    fefoPriority: detailValue(row, "FEFO Priority") || calculateFefoPriority(remainingDays),
    status: row.status,
    actionType: detailValue(row, "Action Type") || "No Action",
    checkedBy: detailValue(row, "Checked By") || "",
    checkedAt: detailValue(row, "Checked At") || "",
    disposedQuantity: detailValue(row, "Disposed Quantity") || "0",
    wasteReason: detailValue(row, "Waste Reason") || "",
    wasteCost: detailValue(row, "Waste Cost") || "0",
    photoProofStatus: detailValue(row, "Photo Proof Status") || "Not Required",
    linkedOutletExecutionId: detailValue(row, "Linked Outlet Execution ID") || "",
    linkedOutletExecution: detailValue(row, "Linked Outlet Execution") || "",
    linkedIncidentId: detailValue(row, "Linked Incident ID") || "",
    linkedIncident: detailValue(row, "Linked Incident") || "",
  };
}

export function getFefoStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("expired") || value.includes("disposed")) return "destructive";
  if (value.includes("use first") || value.includes("hold") || value.includes("expiring")) return "secondary";
  return "outline";
}

export function getFefoPriorityTone(priority: string): "outline" | "secondary" | "destructive" {
  const value = priority.toLowerCase();
  if (value.includes("critical") || value.includes("high")) return "destructive";
  if (value.includes("medium")) return "secondary";
  return "outline";
}

export function getBatchRiskBoard(records: ModuleRow[]) {
  const views = records.map(toFefoBatchView);
  return {
    critical: views.filter((item) => item.fefoPriority === "Critical"),
    useFirst: views.filter((item) => item.status === "Use First"),
    expiringSoon: views.filter((item) => item.status === "Expiring Soon"),
    fresh: views.filter((item) => item.status === "Fresh"),
    hold: views.filter((item) => item.status === "Hold"),
    expired: views.filter((item) => item.status === "Expired"),
  };
}

export function getUseFirstQueue(records: ModuleRow[]) {
  return records.map(toFefoBatchView).filter((item) => item.status === "Use First" || item.fefoPriority === "Critical" || item.status === "Expiring Soon");
}

export function getWasteDisposalQueue(records: ModuleRow[]) {
  return records.map(toFefoBatchView).filter((item) => ["Expired", "Disposed", "Hold"].includes(item.status));
}

export function getExpiryReviewQueue(records: ModuleRow[]) {
  return records.map(toFefoBatchView).filter((item) => ["Missing", "Submitted", "Rejected"].includes(item.photoProofStatus) || !item.wasteReason && Number(item.disposedQuantity) > 0);
}

export function getBatchDetail(record?: ModuleRow) {
  return record ? toFefoBatchView(record) : null;
}

export function getFefoNextActions(record?: ModuleRow) {
  if (!record) return [];
  const detail = toFefoBatchView(record);
  const actions = ["Review expiry state and FEFO priority"];
  if (!detail.linkedOutletExecutionId && ["Use First", "Expired", "Expiring Soon"].includes(detail.status)) actions.push("Create FEFO action task");
  if (detail.status === "Expired") actions.push("Record disposal or hold item");
  if (detail.photoProofStatus === "Missing") actions.push("Upload proof");
  if (!detail.wasteReason && Number(detail.disposedQuantity) > 0) actions.push("Capture waste reason");
  if (detail.linkedIncidentId) actions.push("Review linked incident");
  return actions;
}

export function getFefoWasteKpis(records: ModuleRow[]) {
  const hold = records.filter((row) => row.status === "Hold").length;
  const expired = records.filter((row) => row.status === "Expired").length;
  const pendingProof = calculatePendingExpiryProofCount(records);
  return [
    { label: "Expiring Today", value: String(calculateExpiringTodayCount(records)) },
    { label: "Expiring 3 Days", value: String(calculateExpiringInThreeDaysCount(records)) },
    { label: "Use First", value: String(calculateUseFirstCount(records)) },
    { label: "On Hold", value: String(hold) },
    { label: "Expired", value: String(expired) },
    { label: "Disposed Qty", value: String(calculateDisposedQuantity(records)) },
    { label: "Waste Cost", value: String(calculateWasteCost(records)) },
    { label: "Pending Proof", value: String(pendingProof) },
  ];
}

export function getBranchExpiryRiskSummary(records: ModuleRow[]) {
  return calculateBranchExpiryRiskScore(records);
}

export function getWasteReasonSummary(records: ModuleRow[]) {
  const summary = new Map<string, number>();
  records.forEach((row) => {
    const reason = detailValue(row, "Waste Reason");
    if (!reason) return;
    summary.set(reason, (summary.get(reason) ?? 0) + 1);
  });
  return Array.from(summary.entries()).map(([reason, count]) => ({ reason, count }));
}
