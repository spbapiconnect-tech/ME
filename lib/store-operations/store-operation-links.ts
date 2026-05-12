import type { ModuleRow } from "@/components/module/module-page-shell";

export function createIncidentFromInspectionFailure(
  inspection: ModuleRow,
  failedItem?: {
    id?: string;
    label: string;
    severity?: string;
    comment?: string;
  },
) {
  return {
    title: failedItem ? `${inspection.title} · ${failedItem.label}` : `Inspection Incident: ${inspection.title}`,
    source: inspection.id,
    linkedInspectionId: inspection.id,
    linkedFailedItemId: failedItem?.id,
    severity: failedItem?.severity ?? "High",
    summary: failedItem?.comment ?? inspection.subtitle,
    linkedModule: "incident-center",
  };
}

export function createTaskFromIncident(
  incident: ModuleRow,
  options?: {
    linkedInspectionId?: string;
    dueAt?: string;
    completionStandard?: string;
    photoProofRequired?: boolean;
  },
) {
  return {
    title: `Corrective Action: ${incident.title}`,
    source: incident.id,
    linkedIncidentId: incident.id,
    linkedInspectionId: options?.linkedInspectionId,
    dueAt: options?.dueAt,
    completionStandard: options?.completionStandard ?? "Upload updated outlet photo proof and close all failed points.",
    photoProofRequired: options?.photoProofRequired ?? true,
    linkedModule: "outlet-execution",
  };
}

export function createChecklistFromSop(sop: ModuleRow) {
  return {
    title: `Checklist From SOP: ${sop.title}`,
    source: sop.id,
    linkedModule: "store-inspection",
  };
}

export function createChecklistTemplateFromSop(sop: ModuleRow) {
  return {
    id: `CHK-${sop.id}`,
    title: `Checklist: ${sop.title}`,
    processArea: sop.detailItems?.find((item) => item.label === "Process Area")?.value || "Operations",
    targetRole: sop.detailItems?.find((item) => item.label === "Target Role")?.value || "",
    linkedSopId: sop.id,
  };
}

export function createInspectionTemplateFromSop(sop: ModuleRow) {
  return {
    id: `INSP-${sop.id}`,
    title: `Inspection Template: ${sop.title}`,
    processArea: sop.detailItems?.find((item) => item.label === "Process Area")?.value || "Operations",
    scoringRule: "100-point checklist",
    autoIssueSuggestion: "Yes",
    linkedSopId: sop.id,
  };
}

export function createTaskTemplateFromSop(sop: ModuleRow) {
  return {
    id: `TASKTPL-${sop.id}`,
    title: `Task Template: ${sop.title}`,
    taskType: "Daily Operation",
    completionStandard: `Execute SOP ${sop.title} and confirm all required steps.`,
    repeatRule: "Once",
    linkedSopId: sop.id,
  };
}

export function createTrainingTaskFromSop(sop: ModuleRow) {
  return {
    title: `Training Acknowledgement: ${sop.title}`,
    source: sop.id,
    linkedSopId: sop.id,
    taskType: "Training Acknowledgement",
    completionStandard: `Read and acknowledge SOP version ${sop.detailItems?.find((item) => item.label === "Version")?.value || "current"}.`,
    photoProofRequired: false,
    linkedModule: "outlet-execution",
  };
}

export function publishNewSopVersion(sop: ModuleRow, version: string) {
  return {
    title: sop.title,
    source: sop.id,
    nextVersion: version,
    previousVersionId: sop.id,
    linkedModule: "sop-training",
  };
}

export function supersedeOldSopVersion(sop: ModuleRow, replacementVersionId: string) {
  return {
    source: sop.id,
    replacementVersionId,
    linkedModule: "sop-training",
  };
}

export function createExpiryActionTask(batch: ModuleRow) {
  return {
    title: `FEFO Action: ${batch.title}`,
    source: batch.id,
    linkedModule: "outlet-execution",
  };
}

export function createUseFirstTaskFromFefoRecord(batch: ModuleRow, options?: { dueAt?: string }) {
  return {
    title: `Use First: ${batch.title}`,
    source: batch.id,
    linkedFefoWasteId: batch.id,
    dueAt: options?.dueAt,
    completionStandard: "Use or confirm stock rotation before expiry.",
    photoProofRequired: true,
    taskType: "FEFO Action",
    linkedModule: "outlet-execution",
  };
}

export function createDisposalTaskFromFefoRecord(batch: ModuleRow, options?: { dueAt?: string }) {
  return {
    title: `Dispose Expired: ${batch.title}`,
    source: batch.id,
    linkedFefoWasteId: batch.id,
    dueAt: options?.dueAt,
    completionStandard: "Record disposed quantity, waste reason, and upload disposal proof.",
    photoProofRequired: true,
    taskType: "FEFO Action",
    linkedModule: "outlet-execution",
  };
}

export function createTransferTaskFromFefoRecord(batch: ModuleRow, options?: { dueAt?: string }) {
  return {
    title: `Transfer Batch: ${batch.title}`,
    source: batch.id,
    linkedFefoWasteId: batch.id,
    dueAt: options?.dueAt,
    completionStandard: "Confirm transfer destination and upload transfer proof.",
    photoProofRequired: true,
    taskType: "FEFO Action",
    linkedModule: "outlet-execution",
  };
}

export function createIncidentFromExpiredWasteRecord(batch: ModuleRow) {
  return {
    title: `Expiry / Waste Incident: ${batch.title}`,
    source: batch.id,
    linkedFefoWasteId: batch.id,
    severity: "High",
    summary: batch.subtitle,
    linkedModule: "incident-center",
  };
}

export function createBranchSetupTask(
  branch: ModuleRow,
  options?: {
    missingSetupItem?: string;
    dueAt?: string;
    photoProofRequired?: boolean;
  },
) {
  return {
    title: `Branch Setup: ${branch.title}`,
    source: branch.id,
    branchId: branch.id,
    dueAt: options?.dueAt,
    taskType: "Daily Operation",
    completionStandard: options?.missingSetupItem
      ? `Complete branch setup item: ${options.missingSetupItem}.`
      : "Complete branch setup checklist and confirm operating readiness.",
    photoProofRequired: options?.photoProofRequired ?? true,
    linkedModule: "outlet-execution",
  };
}

export function calculateLinkedRecordSummary(row: ModuleRow) {
  return {
    linkedCount: row.detailItems?.filter((item) => item.label.toLowerCase().includes("linked")).length ?? 0,
    nextAction: row.nextAction ?? "Review linked records",
  };
}
