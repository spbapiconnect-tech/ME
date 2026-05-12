import type { ModuleRow } from "@/components/module/module-page-shell";
import {
  calculateCorrectiveActionCount,
  calculateCriticalIncidentCount,
  calculateIncidentRiskScore,
  calculateOpenIncidentCount,
  calculateOverdueIncidentCount,
  calculateResolvedTodayCount,
} from "@/lib/calculators/store-operation-calculators";
import { parseFailedInspectionItems } from "@/lib/store-operations/inspection-workspace";

export type IncidentSourceSignal = {
  id: string;
  sourceType: "inspection" | "outlet-execution" | "fefo-waste";
  branch: string;
  title: string;
  reason: string;
  severity: string;
  sourceRecordId: string;
  linkedInspectionId?: string;
  linkedInspectionFailedItemId?: string;
  linkedOutletExecutionId?: string;
  linkedFefoWasteId?: string;
  dueAt?: string;
};

function detailValue(row: { detailItems?: Array<{ label: string; value: string }> }, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function severityRank(severity: string) {
  switch (severity) {
    case "Critical": return 4;
    case "High": return 3;
    case "Medium": return 2;
    default: return 1;
  }
}

export function getIncidentSeverityLabel(severity: string) {
  return severity || "Medium";
}

export function getIncidentDueAtBySeverity(severity: string, from = new Date()) {
  const next = new Date(from);
  if (severity === "Critical") next.setHours(next.getHours() + 2);
  else if (severity === "High") next.setHours(next.getHours() + 8);
  else if (severity === "Medium") next.setDate(next.getDate() + 1);
  else next.setDate(next.getDate() + 2);
  return next.toISOString().slice(0, 16);
}

export function getIncidentStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("critical") || value.includes("breached") || value.includes("overdue") || value.includes("reopened")) return "destructive";
  if (value.includes("new") || value.includes("contained") || value.includes("pending") || value.includes("assigned")) return "secondary";
  return "outline";
}

export function getIncidentSlaSummary(incident?: ModuleRow) {
  if (!incident) return { status: "On Track", dueAt: "Not set", escalationLevel: "None" };
  const dueAt = detailValue(incident, "Due Time") || detailValue(incident, "Due At") || "";
  const escalationLevel = detailValue(incident, "Escalation Level") || "None";
  const explicit = detailValue(incident, "SLA Status");
  if (explicit) return { status: explicit, dueAt: dueAt || "Not set", escalationLevel };
  if (!dueAt) return { status: "On Track", dueAt: "Not set", escalationLevel };
  const dueDate = new Date(dueAt).getTime();
  if (Number.isNaN(dueDate)) return { status: "On Track", dueAt, escalationLevel };
  const now = Date.now();
  const diff = dueDate - now;
  if (diff < -24 * 60 * 60 * 1000) return { status: "Breached", dueAt, escalationLevel };
  if (diff < 0) return { status: "Overdue", dueAt, escalationLevel };
  if (diff < 12 * 60 * 60 * 1000) return { status: "Due Soon", dueAt, escalationLevel };
  return { status: "On Track", dueAt, escalationLevel };
}

export function getIncidentQueue(incidents: ModuleRow[]) {
  return [...incidents].sort((a, b) => {
    const aSeverity = severityRank(detailValue(a, "Severity"));
    const bSeverity = severityRank(detailValue(b, "Severity"));
    if (aSeverity !== bSeverity) return bSeverity - aSeverity;
    return a.id < b.id ? 1 : -1;
  });
}

export function getLinkedCorrectiveActions(incident: ModuleRow | undefined, outletExecutions: ModuleRow[]) {
  if (!incident) return [];
  return outletExecutions.filter((task) => {
    const linkedIncidentId = detailValue(task, "Linked Incident ID");
    const linkedIncident = detailValue(task, "Linked Incident");
    return linkedIncidentId === incident.id || linkedIncident === incident.title;
  });
}

export function getIncidentSourceSignals(inspections: ModuleRow[], outletExecutions: ModuleRow[], fefoWasteRecords: ModuleRow[]) {
  const signals: IncidentSourceSignal[] = [];

  inspections.forEach((inspection) => {
    const branch = detailValue(inspection, "Branch") || inspection.subtitle;
    const linkedInspectionId = inspection.id;
    const existingFailedItemIds = splitList(detailValue(inspection, "Linked Incident IDs"));
    parseFailedInspectionItems(inspection).forEach((item) => {
      if (!item.shouldCreateIncident) return;
      const maybeAlreadyLinked = existingFailedItemIds.some((value) => value.includes(item.id));
      if (maybeAlreadyLinked) return;
      signals.push({
        id: `signal-inspection-${inspection.id}-${item.id}`,
        sourceType: "inspection",
        branch,
        title: `${inspection.title} · ${item.label}`,
        reason: "Failed checklist item",
        severity: item.severity,
        sourceRecordId: inspection.id,
        linkedInspectionId,
        linkedInspectionFailedItemId: item.id,
      });
    });
  });

  outletExecutions.forEach((task) => {
    const status = task.status;
    const photoProofs = splitList(detailValue(task, "Photo Proofs"));
    const photoRequired = detailValue(task, "Photo Required") || "Required";
    const branch = splitList(detailValue(task, "Outlets"))[0] || detailValue(task, "Branch") || task.subtitle;
    const reasons: Array<{ reason: string; severity: string }> = [];
    if (status === "Overdue") reasons.push({ reason: "Overdue outlet execution", severity: "High" });
    if (status === "Pending Review") reasons.push({ reason: "Execution pending review", severity: "Medium" });
    if (photoRequired === "Required" && photoProofs.length === 0) reasons.push({ reason: "Missing photo proof", severity: "Medium" });
    if (photoProofs.some((proof) => proof.toLowerCase().includes("rejected"))) reasons.push({ reason: "Rejected photo proof", severity: "High" });
    if (!reasons.length) return;
    signals.push({
      id: `signal-task-${task.id}`,
      sourceType: "outlet-execution",
      branch,
      title: task.title,
      reason: reasons[0].reason,
      severity: reasons[0].severity,
      sourceRecordId: task.id,
      linkedOutletExecutionId: task.id,
      dueAt: [detailValue(task, "Due Date"), detailValue(task, "Due Time")].filter(Boolean).join(" "),
    });
  });

  fefoWasteRecords.forEach((row) => {
    if (!["Expired", "Disposed"].includes(row.status)) return;
    signals.push({
      id: `signal-fefo-${row.id}`,
      sourceType: "fefo-waste",
      branch: detailValue(row, "Branch") || row.subtitle,
      title: row.title,
      reason: row.status === "Expired" ? "Expired FEFO batch" : "Disposed waste review",
      severity: row.status === "Expired" ? "High" : "Medium",
      sourceRecordId: row.id,
      linkedFefoWasteId: row.id,
    });
  });

  return signals;
}

export function getIncidentReviewSummary(incident?: ModuleRow) {
  if (!incident) return null;
  const sla = getIncidentSlaSummary(incident);
  return {
    source: detailValue(incident, "Source") || incident.subtitle,
    branch: detailValue(incident, "Branch") || "Not assigned",
    severity: detailValue(incident, "Severity") || "Medium",
    category: detailValue(incident, "Category") || "Not set",
    impactArea: detailValue(incident, "Impact Area") || "Not set",
    containment: detailValue(incident, "Immediate Containment") || "Not captured",
    owner: incident.owner || "Unassigned",
    slaStatus: sla.status,
    escalationLevel: sla.escalationLevel,
    linkedInspection: detailValue(incident, "Linked Inspection") || "Not linked",
    linkedExecutionTask: detailValue(incident, "Linked Outlet Execution") || "Not linked",
    linkedCorrectiveAction: detailValue(incident, "Linked Corrective Actions") || "Not created",
    resolutionEvidence: detailValue(incident, "Resolution Evidence") || "Not submitted",
    reviewStatus: detailValue(incident, "Review Status") || incident.status,
  };
}

export function getIncidentNextActions(incident?: ModuleRow) {
  if (!incident) return [];
  const actions = ["Review incident source and containment"];
  const containment = detailValue(incident, "Immediate Containment");
  const correctiveAction = detailValue(incident, "Linked Corrective Actions");
  const reviewStatus = detailValue(incident, "Review Status") || incident.status;
  if (!containment) actions.push("Capture immediate containment");
  if (!correctiveAction) actions.push("Create corrective action");
  if (reviewStatus !== "Resolved") actions.push("Prepare manager review");
  const sla = getIncidentSlaSummary(incident);
  if (["Overdue", "Breached"].includes(sla.status)) actions.push("Escalate SLA breach");
  return actions;
}

export function getIncidentKpis(incidents: ModuleRow[], outletExecutions: ModuleRow[]) {
  const open = calculateOpenIncidentCount(incidents);
  const critical = calculateCriticalIncidentCount(incidents);
  const overdue = calculateOverdueIncidentCount(incidents);
  const contained = incidents.filter((row) => row.status === "Contained").length;
  const pendingReview = incidents.filter((row) => row.status === "Pending Review").length;
  const correctiveActions = calculateCorrectiveActionCount(outletExecutions);
  const resolvedToday = calculateResolvedTodayCount(incidents);
  const risk = calculateIncidentRiskScore(incidents);
  return [
    { label: "Open Incidents", value: String(open) },
    { label: "Critical", value: String(critical) },
    { label: "Overdue SLA", value: String(overdue) },
    { label: "Contained", value: String(contained) },
    { label: "Pending Review", value: String(pendingReview) },
    { label: "Corrective Actions", value: String(correctiveActions) },
    { label: "Resolved Today", value: String(resolvedToday) },
    { label: "Risk Score", value: `${risk}%` },
  ];
}
