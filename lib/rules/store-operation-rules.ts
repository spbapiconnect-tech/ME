import type { StoreOperationRule } from "@/lib/rules/rule-types";

export const storeOperationRules: StoreOperationRule[] = [
  {
    id: "expiry-expired",
    moduleId: "fefo-waste-control",
    description: "Mark expired when remaining days is zero or below.",
    run: (record) => {
      const remainingDays = Number((record as { remainingDays?: number }).remainingDays ?? 999);
      return remainingDays <= 0
        ? { matched: true, nextStatus: "Expired", suggestedAction: "Create disposal action", reason: "Remaining days <= 0" }
        : { matched: false, reason: "Not expired" };
    },
  },
  {
    id: "expiry-critical-priority",
    moduleId: "fefo-waste-control",
    description: "Set FEFO priority critical when remaining days is 1 or below.",
    run: (record) => {
      const remainingDays = Number((record as { remainingDays?: number }).remainingDays ?? 999);
      return remainingDays <= 1
        ? { matched: true, suggestedAction: "Escalate FEFO action", reason: "Remaining days <= 1", metadata: { fefoPriority: "Critical" } }
        : { matched: false, reason: "Priority not critical" };
    },
  },
  {
    id: "expiry-soon",
    moduleId: "fefo-waste-control",
    description: "Mark expiring soon when remaining days is within 3 days.",
    run: (record) => {
      const remainingDays = Number((record as { remainingDays?: number }).remainingDays ?? 999);
      return remainingDays > 0 && remainingDays <= 3
        ? { matched: true, nextStatus: "Expiring Soon", suggestedAction: "Create use-first task", reason: "Remaining days <= 3" }
        : { matched: false, reason: "Not within 3 days" };
    },
  },
  {
    id: "expiry-use-first",
    moduleId: "fefo-waste-control",
    description: "Use first when remaining days is within use-first threshold.",
    run: (record) => {
      const remainingDays = Number((record as { remainingDays?: number }).remainingDays ?? 999);
      return remainingDays > 3 && remainingDays <= 7
        ? { matched: true, nextStatus: "Use First", suggestedAction: "Create use-first task", reason: "Remaining days within use-first threshold", metadata: { fefoPriority: "Medium" } }
        : { matched: false, reason: "No use-first trigger" };
    },
  },
  {
    id: "expiry-proof-missing",
    moduleId: "fefo-waste-control",
    description: "Require proof when proof is mandatory and no photo is present.",
    run: (record) => {
      const photoProofRequired = Boolean((record as { photoProofRequired?: boolean }).photoProofRequired);
      const photoUrls = String((record as { photoUrls?: string }).photoUrls ?? "");
      return photoProofRequired && !photoUrls
        ? { matched: true, suggestedAction: "Upload expiry proof", reason: "Proof required but missing", metadata: { photoProofStatus: "Missing" } }
        : { matched: false, reason: "Proof available or not required" };
    },
  },
  {
    id: "expiry-disposal-missing-reason",
    moduleId: "fefo-waste-control",
    description: "Flag manager review when disposal has no waste reason.",
    run: (record) => {
      const status = String((record as { status?: string }).status ?? "");
      const disposedQuantity = Number((record as { disposedQuantity?: number }).disposedQuantity ?? 0);
      const wasteReason = String((record as { wasteReason?: string }).wasteReason ?? "");
      return (status === "Disposed" || disposedQuantity > 0) && !wasteReason
        ? { matched: true, suggestedAction: "Capture waste reason", reason: "Disposed quantity missing reason", metadata: { managerReviewStatus: "Pending Review" } }
        : { matched: false, reason: "Waste reason captured" };
    },
  },
  {
    id: "expiry-high-waste-incident",
    moduleId: "fefo-waste-control",
    description: "Suggest incident when waste cost is unusually high.",
    run: (record) => {
      const wasteCost = Number((record as { wasteCost?: number }).wasteCost ?? 0);
      return wasteCost >= 500
        ? { matched: true, suggestedAction: "Create waste incident", reason: "High waste cost", metadata: { incidentSuggested: "Yes" } }
        : { matched: false, reason: "Waste cost normal" };
    },
  },
  {
    id: "inspection-failed-items",
    moduleId: "store-inspection",
    description: "Suggest incident creation when failed items are present.",
    run: (record) => {
      const failedItems = Number((record as { failedItems?: number }).failedItems ?? 0);
      return failedItems > 0
        ? { matched: true, nextStatus: "Failed Items", suggestedAction: "Create incident suggestion", reason: "Failed items > 0" }
        : { matched: false, reason: "No failed items" };
    },
  },
  {
    id: "inspection-low-score",
    moduleId: "store-inspection",
    description: "Route low-scoring inspections to pending review.",
    run: (record) => {
      const score = Number((record as { score?: number }).score ?? 100);
      return score < 85
        ? { matched: true, nextStatus: "Pending Review", suggestedAction: "Manager review required", reason: "Score below threshold" }
        : { matched: false, reason: "Score acceptable" };
    },
  },
  {
    id: "inspection-photo-recheck",
    moduleId: "store-inspection",
    description: "Require photo recheck when failed items need new evidence.",
    run: (record) => {
      const recheckRequired = Boolean((record as { photoRecheckRequired?: boolean }).photoRecheckRequired);
      return recheckRequired
        ? { matched: true, suggestedAction: "Request new photo proof", reason: "Failed item requires new evidence" }
        : { matched: false, reason: "No recheck required" };
    },
  },
  {
    id: "task-proof-pending",
    moduleId: "outlet-execution",
    description: "Flag pending proof when a proof-required task has no photo proof.",
    run: (record) => {
      const proofRequired = String((record as { photoRequired?: string }).photoRequired ?? "");
      const proofs = String((record as { photoProofs?: string }).photoProofs ?? "");
      return proofRequired === "Required" && !proofs
        ? { matched: true, suggestedAction: "Request photo proof", reason: "Proof required but not uploaded" }
        : { matched: false, reason: "Proof already satisfied or not required" };
    },
  },
  {
    id: "task-due-today",
    moduleId: "outlet-execution",
    description: "Move scheduled tasks into due today when the due date is today.",
    run: (record, context) => {
      const dueDate = String((record as { dueDate?: string }).dueDate ?? "");
      const status = String((record as { status?: string }).status ?? "");
      const today = context.now.slice(0, 10);
      return status === "Scheduled" && dueDate === today
        ? { matched: true, nextStatus: "Due Today", suggestedAction: "Start outlet execution", reason: "Due date is today" }
        : { matched: false, reason: "Not due today" };
    },
  },
  {
    id: "task-overdue",
    moduleId: "outlet-execution",
    description: "Mark tasks overdue when due time has passed and they are not completed.",
    run: (record, context) => {
      const dueAt = String((record as { dueAt?: string }).dueAt ?? "");
      const status = String((record as { status?: string }).status ?? "");
      if (!dueAt || ["Completed"].includes(status)) return { matched: false, reason: "No active due time" };
      return new Date(dueAt).getTime() < new Date(context.now).getTime()
        ? { matched: true, nextStatus: "Overdue", suggestedAction: "Escalate overdue execution", reason: "Due time passed", metadata: { slaStatus: "Overdue" } }
        : { matched: false, reason: "Due time not passed" };
    },
  },
  {
    id: "task-proof-submitted",
    moduleId: "outlet-execution",
    description: "Move proof-submitted tasks into pending review.",
    run: (record) => {
      const photoProofStatus = String((record as { photoProofStatus?: string }).photoProofStatus ?? "");
      return photoProofStatus === "Submitted"
        ? { matched: true, nextStatus: "Pending Review", suggestedAction: "Manager review proof", reason: "Photo proof submitted" }
        : { matched: false, reason: "No proof submitted" };
    },
  },
  {
    id: "task-rework-required",
    moduleId: "outlet-execution",
    description: "Mark rework required when manager rejects proof.",
    run: (record) => {
      const managerReviewStatus = String((record as { managerReviewStatus?: string }).managerReviewStatus ?? "");
      return managerReviewStatus === "Rejected" || managerReviewStatus === "Rework Required"
        ? { matched: true, nextStatus: "Rework Required", suggestedAction: "Request new proof", reason: "Manager rejected proof" }
        : { matched: false, reason: "No rejection" };
    },
  },
  {
    id: "incident-critical-escalation",
    moduleId: "incident-center",
    description: "Escalate critical incidents immediately.",
    run: (record) => {
      const severity = String((record as { severity?: string }).severity ?? "");
      return severity === "Critical"
        ? { matched: true, suggestedAction: "Escalate to critical", reason: "Critical severity", metadata: { escalationLevel: "Critical" } }
        : { matched: false, reason: "Severity not critical" };
    },
  },
  {
    id: "incident-contained-transition",
    moduleId: "incident-center",
    description: "Allow contained state when immediate containment exists.",
    run: (record) => {
      const status = String((record as { status?: string }).status ?? "");
      const immediateContainment = String((record as { immediateContainment?: string }).immediateContainment ?? "");
      return status === "New" && immediateContainment
        ? { matched: true, nextStatus: "Contained", suggestedAction: "Mark contained", reason: "Containment captured" }
        : { matched: false, reason: "Containment not ready" };
    },
  },
  {
    id: "incident-overdue-sla",
    moduleId: "incident-center",
    description: "Flag overdue incidents when due time has passed and record is unresolved.",
    run: (record, context) => {
      const dueAt = String((record as { dueAt?: string }).dueAt ?? "");
      const status = String((record as { status?: string }).status ?? "");
      if (!dueAt || ["Resolved"].includes(status)) return { matched: false, reason: "No active SLA breach" };
      return new Date(dueAt).getTime() < new Date(context.now).getTime()
        ? { matched: true, suggestedAction: "Escalate overdue incident", reason: "Due time passed", metadata: { slaStatus: "Overdue" } }
        : { matched: false, reason: "SLA on track" };
    },
  },
  {
    id: "branch-missing-setup",
    moduleId: "branch-control",
    description: "Flag branch attention when setup is incomplete.",
    run: (record) => {
      const setupStatus = String((record as { setupStatus?: string }).setupStatus ?? "");
      return setupStatus === "Missing Setup"
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Create branch setup task", reason: "Setup status missing", metadata: { attentionLevel: "Attention" } }
        : { matched: false, reason: "Setup clear" };
    },
  },
  {
    id: "branch-critical-incident",
    moduleId: "branch-control",
    description: "Escalate branch attention when a critical incident exists.",
    run: (record) => {
      const criticalIncidentCount = Number((record as { criticalIncidentCount?: number }).criticalIncidentCount ?? 0);
      return criticalIncidentCount > 0
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Escalate critical incident", reason: "Critical incident found", metadata: { attentionLevel: "Critical" } }
        : { matched: false, reason: "No critical incident" };
    },
  },
  {
    id: "branch-overdue-tasks",
    moduleId: "branch-control",
    description: "Raise branch attention when overdue execution grows beyond threshold.",
    run: (record) => {
      const overdueTaskCount = Number((record as { overdueTaskCount?: number }).overdueTaskCount ?? 0);
      return overdueTaskCount >= 2
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Review overdue execution", reason: "Overdue tasks threshold reached", metadata: { attentionLevel: "Attention" } }
        : { matched: false, reason: "Overdue tasks within threshold" };
    },
  },
  {
    id: "branch-failed-inspection",
    moduleId: "branch-control",
    description: "Raise branch attention when failed inspection exists today.",
    run: (record) => {
      const failedInspectionCount = Number((record as { failedInspectionCount?: number }).failedInspectionCount ?? 0);
      return failedInspectionCount > 0
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Open inspection review", reason: "Failed inspection found", metadata: { attentionLevel: "Attention" } }
        : { matched: false, reason: "No failed inspection" };
    },
  },
  {
    id: "branch-expired-fefo",
    moduleId: "branch-control",
    description: "Escalate branch when expired FEFO items exist.",
    run: (record) => {
      const expiredFefoCount = Number((record as { expiredFefoCount?: number }).expiredFefoCount ?? 0);
      return expiredFefoCount > 0
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Create disposal action", reason: "Expired FEFO batch exists", metadata: { attentionLevel: "Critical" } }
        : { matched: false, reason: "No expired FEFO item" };
    },
  },
  {
    id: "branch-health-attention",
    moduleId: "branch-control",
    description: "Raise attention when branch health drops below thresholds.",
    run: (record) => {
      const healthScore = Number((record as { healthScore?: number }).healthScore ?? 100);
      if (healthScore < 50) {
        return { matched: true, nextStatus: "Attention", suggestedAction: "Open branch risk review", reason: "Health score below 50", metadata: { attentionLevel: "Critical" } };
      }
      if (healthScore < 70) {
        return { matched: true, nextStatus: "Attention", suggestedAction: "Review branch operational health", reason: "Health score below 70", metadata: { attentionLevel: "Attention" } };
      }
      return { matched: false, reason: "Health score healthy" };
    },
  },
  {
    id: "branch-open-issue-found",
    moduleId: "branch-control",
    description: "Raise attention when opening control finds an issue.",
    run: (record) => {
      const openTodayStatus = String((record as { openTodayStatus?: string }).openTodayStatus ?? "");
      return openTodayStatus === "Issue Found"
        ? { matched: true, nextStatus: "Attention", suggestedAction: "Review opening issue", reason: "Issue found during opening", metadata: { attentionLevel: "Attention" } }
        : { matched: false, reason: "Opening clear" };
    },
  },
];
