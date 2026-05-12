import type { ModuleRow } from "@/components/module/module-page-shell";
import {
  calculateBranchTaskCompletionRate,
  calculateCorrectiveActionTaskCount,
  calculateDueTodayTaskCount,
  calculateOverdueTaskCount,
  calculatePendingReviewTaskCount,
  calculatePhotoProofPendingCount,
  calculateReworkRequiredCount,
  calculateTaskCompletionRate,
  calculateTaskSlaStatus,
} from "@/lib/calculators/store-operation-calculators";

export type OutletExecutionView = {
  row: ModuleRow;
  branch: string;
  taskType: string;
  source: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  dueAt: string;
  status: string;
  photoProofStatus: string;
  managerReviewStatus: string;
  linkedIncidentId: string;
  linkedIncident: string;
  linkedInspectionId: string;
  linkedInspection: string;
  linkedInspectionFailedItemId: string;
  linkedFefoWasteId: string;
  completionStandard: string;
  checklistItems: string[];
  photoProofs: string[];
  outlets: string[];
  completedOutlets: string[];
  proofComment: string;
  managerReviewComment: string;
};

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function dueAtFrom(row: ModuleRow) {
  return detailValue(row, "Due At") || [detailValue(row, "Due Date"), detailValue(row, "Due Time")].filter(Boolean).join(" ");
}

export function toExecutionView(row: ModuleRow): OutletExecutionView {
  const taskType = detailValue(row, "Task Type") || "Daily Operation";
  const source = detailValue(row, "Source")
    || (detailValue(row, "Linked Incident ID") ? "Incident Center" : detailValue(row, "Linked Inspection ID") ? "Store Inspection" : detailValue(row, "Linked FEFO / Waste ID") ? "FEFO / Waste" : "Manual");
  const photoProofs = splitList(detailValue(row, "Photo Proofs"));
  const photoRequired = detailValue(row, "Photo Required") || "Required";
  const managerReviewStatus = detailValue(row, "Manager Review Status") || (row.status === "Pending Review" ? "Pending Review" : "Not Submitted");
  const photoProofStatus = detailValue(row, "Photo Proof Status")
    || (managerReviewStatus === "Accepted" ? "Accepted"
      : managerReviewStatus === "Rejected" ? "Rejected"
      : photoRequired === "Required" && !photoProofs.length ? "Missing"
      : photoProofs.length ? "Submitted" : "Not Required");
  return {
    row,
    branch: detailValue(row, "Branch") || splitList(detailValue(row, "Outlets"))[0] || row.subtitle,
    taskType,
    source,
    priority: detailValue(row, "Priority") || (taskType === "Corrective Action" ? "High" : "Normal"),
    dueDate: detailValue(row, "Due Date"),
    dueTime: detailValue(row, "Due Time"),
    dueAt: dueAtFrom(row),
    status: row.status,
    photoProofStatus,
    managerReviewStatus,
    linkedIncidentId: detailValue(row, "Linked Incident ID"),
    linkedIncident: detailValue(row, "Linked Incident"),
    linkedInspectionId: detailValue(row, "Linked Inspection ID"),
    linkedInspection: detailValue(row, "Linked Inspection"),
    linkedInspectionFailedItemId: detailValue(row, "Linked Inspection Failed Item ID"),
    linkedFefoWasteId: detailValue(row, "Linked FEFO / Waste ID"),
    completionStandard: detailValue(row, "Completion Standard"),
    checklistItems: detailValue(row, "Checklist Items").split("\n").map((item) => item.trim()).filter(Boolean),
    photoProofs,
    outlets: splitList(detailValue(row, "Outlets")),
    completedOutlets: splitList(detailValue(row, "Completed Outlets")),
    proofComment: detailValue(row, "Proof Comment"),
    managerReviewComment: detailValue(row, "Manager Review Comment"),
  };
}

export function getTaskStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("overdue") || value.includes("rejected") || value.includes("rework") || value.includes("escalated")) return "destructive";
  if (value.includes("pending") || value.includes("scheduled") || value.includes("due today") || value.includes("submitted")) return "secondary";
  return "outline";
}

export function getPhotoProofStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("missing") || value.includes("rejected") || value.includes("recheck")) return "destructive";
  if (value.includes("required") || value.includes("submitted")) return "secondary";
  return "outline";
}

export function getManagerReviewStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("rejected") || value.includes("rework")) return "destructive";
  if (value.includes("pending")) return "secondary";
  return "outline";
}

export function getExecutionBoard(tasks: ModuleRow[]) {
  const views = tasks.map(toExecutionView);
  return {
    dueToday: views.filter((task) => task.status === "Due Today"),
    inProgress: views.filter((task) => task.status === "In Progress"),
    pendingReview: views.filter((task) => task.status === "Pending Review"),
    correctiveAction: views.filter((task) => task.taskType === "Corrective Action"),
    reworkRequired: views.filter((task) => task.status === "Rework Required" || task.managerReviewStatus === "Rejected"),
    overdue: views.filter((task) => task.status === "Overdue" || task.status === "Escalated"),
  };
}

export function getDailyExecutionPlan(tasks: ModuleRow[], selectedDate: string) {
  const plan = tasks.map(toExecutionView).filter((task) => task.dueDate === selectedDate);
  const branchLoad = new Map<string, { total: number; completed: number; pendingReview: number }>();
  plan.forEach((task) => {
    const entry = branchLoad.get(task.branch) ?? { total: 0, completed: 0, pendingReview: 0 };
    entry.total += 1;
    if (task.status === "Completed") entry.completed += 1;
    if (task.status === "Pending Review") entry.pendingReview += 1;
    branchLoad.set(task.branch, entry);
  });
  return {
    tasks: plan,
    branchLoad: Array.from(branchLoad.entries()).map(([branch, data]) => ({ branch, ...data })),
  };
}

export function getReviewQueue(tasks: ModuleRow[]) {
  return tasks.map(toExecutionView).filter((task) => task.status === "Pending Review" || task.managerReviewStatus === "Pending Review");
}

export function getPhotoProofQueue(tasks: ModuleRow[]) {
  return tasks.map(toExecutionView).filter((task) => ["Missing", "Submitted", "Rejected", "Recheck Required"].includes(task.photoProofStatus));
}

export function getCorrectiveActionQueue(tasks: ModuleRow[]) {
  return tasks.map(toExecutionView).filter((task) => task.taskType === "Corrective Action" || Boolean(task.linkedIncidentId));
}

export function getExecutionDetail(task?: ModuleRow) {
  return task ? toExecutionView(task) : null;
}

export function getExecutionNextActions(task?: ModuleRow) {
  if (!task) return [];
  const detail = toExecutionView(task);
  const actions = ["Review outlet execution evidence"];
  if (detail.photoProofStatus === "Missing") actions.push("Upload proof");
  if (detail.photoProofStatus === "Submitted") actions.push("Manager review proof");
  if (detail.managerReviewStatus === "Rejected" || detail.status === "Rework Required") actions.push("Request outlet rework");
  if (detail.linkedIncidentId) actions.push("Update incident review state");
  if (detail.linkedInspectionId) actions.push("Update inspection recheck state");
  if (detail.taskType === "Corrective Action") actions.push("Complete corrective action");
  return actions;
}

export function getOutletExecutionKpis(tasks: ModuleRow[]) {
  return [
    { label: "Due Today", value: String(calculateDueTodayTaskCount(tasks)) },
    { label: "Overdue", value: String(calculateOverdueTaskCount(tasks)) },
    { label: "Pending Review", value: String(calculatePendingReviewTaskCount(tasks)) },
    { label: "Photo Proof Pending", value: String(calculatePhotoProofPendingCount(tasks)) },
    { label: "Corrective Actions", value: String(calculateCorrectiveActionTaskCount(tasks)) },
    { label: "Rework Required", value: String(calculateReworkRequiredCount(tasks)) },
    { label: "Completion Rate", value: `${calculateTaskCompletionRate(tasks)}%` },
  ];
}

export function getBranchCompletionSummary(tasks: ModuleRow[]) {
  return calculateBranchTaskCompletionRate(tasks);
}

export function getCalendarDayStats(tasks: ModuleRow[]) {
  const views = tasks.map(toExecutionView);
  const map = new Map<string, { total: number; completed: number; pending: number }>();
  views.forEach((task) => {
    if (!task.dueDate) return;
    const current = map.get(task.dueDate) ?? { total: 0, completed: 0, pending: 0 };
    current.total += 1;
    if (task.status === "Completed") current.completed += 1;
    if (["Pending Review", "Rework Required", "Overdue"].includes(task.status)) current.pending += 1;
    map.set(task.dueDate, current);
  });
  return map;
}

export function getExecutionSlaSummary(tasks: ModuleRow[]) {
  return calculateTaskSlaStatus(tasks);
}
