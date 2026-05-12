import type { ModuleRow } from "@/components/module/module-page-shell";
import { calculateInspectionAverageScore } from "@/lib/calculators/store-operation-calculators";

export type InspectionFailedItemView = {
  id: string;
  label: string;
  severity: string;
  result: string;
  comment: string;
  photoRequired: boolean;
  photoUrls: string[];
  shouldCreateIncident: boolean;
  correctiveActionRequired: boolean;
};

export type InspectionSignal = {
  id: string;
  taskId: string;
  branchName: string;
  taskTitle: string;
  reason: string;
  dueAt: string;
  photoProofStatus: string;
  status: string;
  linkedIncident: string;
};

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseFailedInspectionItems(inspection?: ModuleRow): InspectionFailedItemView[] {
  if (!inspection) return [];
  const payload = detailValue(inspection, "Failed Item Payload");
  if (!payload) return [];
  try {
    const parsed = JSON.parse(payload);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getInspectionQueue(records: ModuleRow[]) {
  return [...records].sort((a, b) => a.id < b.id ? 1 : -1);
}

export function getExecutionSignals(outletExecutions: ModuleRow[]) {
  const signals: InspectionSignal[] = [];
  outletExecutions.forEach((task) => {
    const status = task.status;
    const dueDate = detailValue(task, "Due Date");
    const dueTime = detailValue(task, "Due Time");
    const dueAt = [dueDate, dueTime].filter(Boolean).join(" ") || task.meta;
    const outlets = splitList(detailValue(task, "Outlets"));
    const completed = splitList(detailValue(task, "Completed Outlets"));
    const proofs = splitList(detailValue(task, "Photo Proofs"));
    const photoRequired = detailValue(task, "Photo Required") || "Required";
    const linkedIncident = detailValue(task, "Linked Incident") || detailValue(task, "Source Issue");
    const branchName = outlets[0] || detailValue(task, "Branch") || "Unassigned Outlet";

    const reasons: string[] = [];
    if (status === "Overdue") reasons.push("Overdue task");
    if (status === "Pending Review") reasons.push("Pending review");
    if (photoRequired === "Required" && proofs.length === 0) reasons.push("Missing photo proof");
    if (proofs.some((proof) => proof.toLowerCase().includes("rejected"))) reasons.push("Rejected photo proof");
    if (linkedIncident) reasons.push("Linked incident follow-up");
    if (completed.length < outlets.length && completed.length > 0) reasons.push("Incomplete outlet completion");
    if (task.detailNote?.toLowerCase().includes("flag")) reasons.push("Manager flagged execution");

    if (!reasons.length) return;

    signals.push({
      id: `signal-${task.id}`,
      taskId: task.id,
      branchName,
      taskTitle: task.title,
      reason: reasons[0],
      dueAt,
      photoProofStatus: photoRequired === "Required" ? (proofs.length ? `${proofs.length} proof uploaded` : "Proof missing") : "Proof not required",
      status,
      linkedIncident,
    });
  });
  return signals;
}

export function getFailedInspectionItems(inspection?: ModuleRow) {
  return parseFailedInspectionItems(inspection);
}

export function getInspectionReviewSummary(inspection?: ModuleRow) {
  if (!inspection) return null;
  return {
    branch: detailValue(inspection, "Branch") || "Not assigned",
    inspectionType: detailValue(inspection, "Inspection Type") || "Manual Inspection",
    checklist: detailValue(inspection, "Checklist Template") || detailValue(inspection, "Checklist Name") || "Not configured",
    score: detailValue(inspection, "Score") || "0",
    failedItems: detailValue(inspection, "Failed Items") || String(parseFailedInspectionItems(inspection).length),
    linkedExecutionTask: detailValue(inspection, "Linked Outlet Execution") || "Not linked",
    linkedIncident: detailValue(inspection, "Linked Incident Titles") || "Not created",
    correctiveActionStatus: detailValue(inspection, "Corrective Action Status") || "Not Created",
    requiredNewPhotoProof: detailValue(inspection, "Required New Photo Proof") || "No",
    reviewStatus: detailValue(inspection, "Review Status") || inspection.status,
  };
}

export function getInspectionNextActions(inspection?: ModuleRow) {
  if (!inspection) return [];
  const failedItems = parseFailedInspectionItems(inspection);
  const actions = ["Review checklist result"];
  if (failedItems.some((item) => item.shouldCreateIncident)) actions.push("Create incident from failed item");
  if ((detailValue(inspection, "Corrective Action Status") || "") !== "Completed") actions.push("Push corrective action back to outlet");
  if (detailValue(inspection, "Required New Photo Proof") === "Yes") actions.push("Request new photo proof");
  return actions;
}

export function getInspectionKpis(inspections: ModuleRow[], outletExecutions: ModuleRow[], incidents: ModuleRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  const scheduledToday = inspections.filter((row) => (detailValue(row, "Scheduled Time") || "").startsWith(today)).length;
  const pendingReview = inspections.filter((row) => row.status === "Pending Review").length;
  const failedItems = inspections.reduce((sum, row) => sum + Number(detailValue(row, "Failed Items") || 0), 0);
  const correctiveActions = outletExecutions.filter((row) => detailValue(row, "Inspection Source") || detailValue(row, "Linked Inspection")).length;
  const photoRecheckRequired = inspections.filter((row) => detailValue(row, "Required New Photo Proof") === "Yes").length;
  const completionRate = inspections.length
    ? Math.round((inspections.filter((row) => row.status === "Completed").length / inspections.length) * 100)
    : 0;

  return [
    { label: "Scheduled Today", value: String(scheduledToday) },
    { label: "Pending Review", value: String(pendingReview) },
    { label: "Failed Items", value: String(failedItems) },
    { label: "Corrective Actions", value: String(correctiveActions) },
    { label: "Photo Recheck Required", value: String(photoRecheckRequired) },
    { label: "Completion Rate", value: `${completionRate || calculateInspectionAverageScore(inspections)}%` },
    { label: "Open Incidents", value: String(incidents.filter((row) => ["New", "Contained", "Assigned", "In Progress"].includes(row.status)).length) },
  ];
}
