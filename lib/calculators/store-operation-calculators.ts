import type { ModuleRow } from "@/components/module/module-page-shell";

function ratio(done: number, total: number) {
  return total > 0 ? done / total : 0;
}

function detailValue(row: ModuleRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function branchOf(row: ModuleRow) {
  return detailValue(row, "Branch")
    || detailValue(row, "Branch Name")
    || detailValue(row, "Outlets").split(",")[0]?.trim()
    || row.title;
}

function byBranch(rows: ModuleRow[], branch: string) {
  return rows.filter((row) => branchOf(row) === branch);
}

export function calculateBranchExecutionScore(tasks: ModuleRow[]) {
  if (!tasks.length) return 100;
  const overdue = calculateOverdueTaskCount(tasks);
  const pendingReview = calculatePendingReviewTaskCount(tasks);
  const rework = calculateReworkRequiredCount(tasks);
  const completionRate = calculateTaskCompletionRate(tasks);
  const total = tasks.length;
  const penalty = Math.round(
    ratio(overdue, total) * 35
    + ratio(pendingReview, total) * 20
    + ratio(rework, total) * 25
    + ((100 - completionRate) / 100) * 20,
  );
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function calculateBranchInspectionScore(inspections: ModuleRow[]) {
  if (!inspections.length) return 100;
  const avgScore = calculateInspectionAverageScore(inspections);
  const failedItems = inspections.reduce((sum, row) => sum + Number(detailValue(row, "Failed Items") || 0), 0);
  const pendingReview = inspections.filter((row) => row.status === "Pending Review").length;
  const total = inspections.length;
  const scorePenalty = Math.max(0, 100 - avgScore) * 0.45;
  const failedPenalty = Math.min(30, failedItems * 4);
  const reviewPenalty = ratio(pendingReview, total) * 25;
  return Math.max(0, Math.min(100, Math.round(100 - scorePenalty - failedPenalty - reviewPenalty)));
}

export function calculateBranchIncidentRiskScore(incidents: ModuleRow[]) {
  if (!incidents.length) return 0;
  const open = calculateOpenIncidentCount(incidents);
  const critical = calculateCriticalIncidentCount(incidents);
  const overdue = calculateOverdueIncidentCount(incidents);
  const reopened = incidents.filter((row) => row.status === "Reopened").length;
  const total = incidents.length;
  const score = Math.round(
    (
      ratio(open, total) * 35
      + ratio(critical, total) * 35
      + ratio(overdue, total) * 20
      + ratio(reopened, total) * 10
    ),
  );
  return Math.max(0, Math.min(100, score));
}

export function calculateBranchFefoRiskScore(fefoRows: ModuleRow[]) {
  if (!fefoRows.length) return 0;
  const expiringToday = calculateExpiringTodayCount(fefoRows);
  const expired = calculateExpiredBatchCount(fefoRows);
  const pendingProof = calculatePendingExpiryProofCount(fefoRows);
  const wasteCost = calculateWasteCost(fefoRows);
  const total = fefoRows.length;
  const score = Math.round(
    (
      ratio(expiringToday, total) * 30
      + ratio(expired, total) * 35
      + ratio(pendingProof, total) * 20
      + Math.min(15, wasteCost / 100)
    ),
  );
  return Math.max(0, Math.min(100, score));
}

export function calculateBranchTodayReadinessScore(
  tasks: ModuleRow[],
  inspections: ModuleRow[],
  incidents: ModuleRow[],
  fefoRows: ModuleRow[],
) {
  const executionScore = calculateBranchExecutionScore(tasks);
  const inspectionScore = calculateBranchInspectionScore(inspections);
  const incidentRisk = calculateBranchIncidentRiskScore(incidents);
  const fefoRisk = calculateBranchFefoRiskScore(fefoRows);
  return Math.max(0, Math.min(100, Math.round(
    executionScore * 0.4
    + inspectionScore * 0.25
    + (100 - incidentRisk) * 0.2
    + (100 - fefoRisk) * 0.15,
  )));
}

export function calculateBranchHealthScore(
  branch: string,
  tasks: ModuleRow[],
  inspections: ModuleRow[],
  incidents: ModuleRow[],
  fefoRows: ModuleRow[],
) {
  const branchTasks = byBranch(tasks, branch);
  const branchInspections = byBranch(inspections, branch);
  const branchIncidents = byBranch(incidents, branch);
  const branchFefo = byBranch(fefoRows, branch);
  const executionScore = calculateBranchExecutionScore(branchTasks);
  const inspectionScore = calculateBranchInspectionScore(branchInspections);
  const incidentRisk = calculateBranchIncidentRiskScore(branchIncidents);
  const fefoRisk = calculateBranchFefoRiskScore(branchFefo);
  return Math.max(0, Math.min(100, Math.round(
    executionScore * 0.35
    + inspectionScore * 0.25
    + (100 - incidentRisk) * 0.2
    + (100 - fefoRisk) * 0.2,
  )));
}

export function calculateBranchRiskScore(
  branch: string,
  tasks: ModuleRow[],
  inspections: ModuleRow[],
  incidents: ModuleRow[],
  fefoRows: ModuleRow[],
) {
  const branchTasks = byBranch(tasks, branch);
  const branchInspections = byBranch(inspections, branch);
  const branchIncidents = byBranch(incidents, branch);
  const branchFefo = byBranch(fefoRows, branch);
  return Math.max(0, Math.min(100, Math.round(
    calculateBranchIncidentRiskScore(branchIncidents) * 0.4
    + calculateBranchFefoRiskScore(branchFefo) * 0.3
    + (100 - calculateBranchExecutionScore(branchTasks)) * 0.2
    + (100 - calculateBranchInspectionScore(branchInspections)) * 0.1,
  )));
}

export function calculateBranchAttentionLevel(healthScore: number, riskScore: number) {
  if (riskScore >= 75 || healthScore < 50) return "Critical";
  if (riskScore >= 55 || healthScore < 70) return "Attention";
  if (riskScore >= 35 || healthScore < 85) return "Watch";
  return "Healthy";
}

export function calculateTaskCompletionRate(rows: ModuleRow[]) {
  if (!rows.length) return 0;
  const completed = rows.filter((row) => row.status === "Completed").length;
  return Math.round(ratio(completed, rows.length) * 100);
}

export function calculateDueTodayTaskCount(rows: ModuleRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  return rows.filter((row) => {
    const dueDate = row.detailItems?.find((item) => item.label === "Due Date")?.value ?? "";
    return dueDate === today || row.status === "Due Today";
  }).length;
}

export function calculateOverdueTaskCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Overdue" || row.detailItems?.find((item) => item.label === "SLA Status")?.value === "Overdue").length;
}

export function calculatePendingReviewTaskCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Pending Review" || row.detailItems?.find((item) => item.label === "Manager Review Status")?.value === "Pending Review").length;
}

export function calculatePhotoProofPendingCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const status = row.detailItems?.find((item) => item.label === "Photo Proof Status")?.value ?? "";
    const required = row.detailItems?.find((item) => item.label === "Photo Required")?.value ?? "";
    return status === "Missing" || status === "Recheck Required" || (required === "Required" && !row.detailItems?.find((item) => item.label === "Photo Proofs")?.value);
  }).length;
}

export function calculateCorrectiveActionTaskCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const taskType = row.detailItems?.find((item) => item.label === "Task Type")?.value ?? "";
    const linkedIncident = row.detailItems?.find((item) => item.label === "Linked Incident ID")?.value ?? "";
    return taskType === "Corrective Action" || Boolean(linkedIncident);
  }).length;
}

export function calculateReworkRequiredCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const review = row.detailItems?.find((item) => item.label === "Manager Review Status")?.value ?? "";
    return row.status === "Rework Required" || review === "Rejected" || review === "Rework Required";
  }).length;
}

export function calculateBranchTaskCompletionRate(rows: ModuleRow[]) {
  const branchSummary = new Map<string, { total: number; completed: number }>();
  rows.forEach((row) => {
    const branch = row.detailItems?.find((item) => item.label === "Branch")?.value
      ?? row.detailItems?.find((item) => item.label === "Outlets")?.value.split(",")[0]?.trim()
      ?? row.subtitle;
    const entry = branchSummary.get(branch) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (row.status === "Completed") entry.completed += 1;
    branchSummary.set(branch, entry);
  });
  return Array.from(branchSummary.entries()).map(([branch, data]) => ({
    branch,
    completionRate: data.total ? Math.round((data.completed / data.total) * 100) : 0,
    total: data.total,
    completed: data.completed,
  }));
}

export function calculateTaskSlaStatus(rows: ModuleRow[]) {
  return {
    onTrack: rows.filter((row) => (row.detailItems?.find((item) => item.label === "SLA Status")?.value ?? "On Track") === "On Track").length,
    dueSoon: rows.filter((row) => row.detailItems?.find((item) => item.label === "SLA Status")?.value === "Due Soon").length,
    overdue: rows.filter((row) => row.detailItems?.find((item) => item.label === "SLA Status")?.value === "Overdue").length,
    breached: rows.filter((row) => row.detailItems?.find((item) => item.label === "SLA Status")?.value === "Breached").length,
  };
}

export function calculateInspectionAverageScore(rows: ModuleRow[]) {
  const scores = rows
    .map((row) => Number(row.detailItems?.find((item) => item.label === "Score")?.value ?? 0))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

export function calculateIncidentSlaStatus(rows: ModuleRow[]) {
  return {
    overdue: rows.filter((row) => {
      const status = row.detailItems?.find((item) => item.label === "SLA Status")?.value ?? row.status;
      return ["Overdue", "Breached"].includes(status);
    }).length,
    open: rows.filter((row) => ["New", "Contained", "Assigned", "In Progress"].includes(row.status)).length,
  };
}

export function calculateOpenIncidentCount(rows: ModuleRow[]) {
  return rows.filter((row) => ["New", "Contained", "Assigned", "In Progress", "Pending Review", "Reopened"].includes(row.status)).length;
}

export function calculateCriticalIncidentCount(rows: ModuleRow[]) {
  return rows.filter((row) => (row.detailItems?.find((item) => item.label === "Severity")?.value ?? "") === "Critical").length;
}

export function calculateOverdueIncidentCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const sla = row.detailItems?.find((item) => item.label === "SLA Status")?.value ?? "";
    return sla === "Overdue" || sla === "Breached";
  }).length;
}

export function calculateResolvedTodayCount(rows: ModuleRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  return rows.filter((row) => row.status === "Resolved" && row.meta.toLowerCase().includes("resolved")).length
    || rows.filter((row) => {
      const reported = row.detailItems?.find((item) => item.label === "Reported Time")?.value ?? "";
      return row.status === "Resolved" && reported.startsWith(today);
    }).length;
}

export function calculateCorrectiveActionCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const linked = row.detailItems?.find((item) => item.label === "Linked Incident ID")?.value ?? "";
    const taskType = row.detailItems?.find((item) => item.label === "Task Type")?.value ?? "";
    return Boolean(linked) || taskType === "Corrective Action";
  }).length;
}

export function calculateIncidentRiskScore(rows: ModuleRow[]) {
  if (!rows.length) return 0;
  const weighted = rows.reduce((sum, row) => {
    const severity = row.detailItems?.find((item) => item.label === "Severity")?.value ?? "Low";
    const points = severity === "Critical" ? 4 : severity === "High" ? 3 : severity === "Medium" ? 2 : 1;
    return sum + points;
  }, 0);
  return Math.round((weighted / (rows.length * 4)) * 100);
}

export function calculateExpiryRiskScore(rows: ModuleRow[]) {
  const risky = rows.filter((row) => ["Expiring Soon", "Use First", "Expired"].includes(row.status)).length;
  return rows.length ? Math.round(ratio(risky, rows.length) * 100) : 0;
}

export function calculateRemainingDays(row: ModuleRow) {
  const value = row.detailItems?.find((item) => item.label === "Remaining Days")?.value ?? "0";
  return Number(value || 0);
}

export function calculateExpiringTodayCount(rows: ModuleRow[]) {
  return rows.filter((row) => calculateRemainingDays(row) <= 0 && row.status !== "Disposed").length;
}

export function calculateExpiringInThreeDaysCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const days = calculateRemainingDays(row);
    return days > 0 && days <= 3;
  }).length;
}

export function calculateUseFirstCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Use First").length;
}

export function calculateExpiredBatchCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Expired").length;
}

export function calculateDisposedQuantity(rows: ModuleRow[]) {
  return rows.reduce((sum, row) => {
    const raw = row.detailItems?.find((item) => item.label === "Disposed Quantity")?.value ?? "0";
    return sum + Number(raw);
  }, 0);
}

export function calculatePendingExpiryProofCount(rows: ModuleRow[]) {
  return rows.filter((row) => {
    const status = row.detailItems?.find((item) => item.label === "Photo Proof Status")?.value ?? "";
    return ["Missing", "Submitted", "Rejected"].includes(status);
  }).length;
}

export function calculateBranchExpiryRiskScore(rows: ModuleRow[]) {
  const branchTotals = new Map<string, { total: number; risk: number }>();
  rows.forEach((row) => {
    const branch = row.detailItems?.find((item) => item.label === "Branch")?.value ?? row.subtitle;
    const priority = row.detailItems?.find((item) => item.label === "FEFO Priority")?.value ?? "Low";
    const points = priority === "Critical" ? 4 : priority === "High" ? 3 : priority === "Medium" ? 2 : 1;
    const current = branchTotals.get(branch) ?? { total: 0, risk: 0 };
    current.total += 1;
    current.risk += points;
    branchTotals.set(branch, current);
  });
  return Array.from(branchTotals.entries()).map(([branch, data]) => ({
    branch,
    riskScore: data.total ? Math.round((data.risk / (data.total * 4)) * 100) : 0,
    total: data.total,
  }));
}

export function calculateFefoPriority(remainingDays: number) {
  if (remainingDays <= 1) return "Critical";
  if (remainingDays <= 3) return "High";
  if (remainingDays <= 7) return "Medium";
  return "Low";
}

export function calculateWasteCost(rows: ModuleRow[]) {
  return rows.reduce((sum, row) => {
    const raw = row.detailItems?.find((item) => item.label === "Waste Cost")?.value ?? "0";
    return sum + Number(raw);
  }, 0);
}

export function calculateSopTrainingCompletion(rows: ModuleRow[]) {
  if (!rows.length) return 0;
  const effective = rows.filter((row) => row.status === "Effective").length;
  return Math.round(ratio(effective, rows.length) * 100);
}

export function calculateEffectiveSopCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Effective").length;
}

export function calculateSopNeedReviewCount(rows: ModuleRow[]) {
  return rows.filter((row) => row.status === "Need Review").length;
}

export function calculateSopDraftReviewCount(rows: ModuleRow[]) {
  return rows.filter((row) => ["Draft", "Review", "Approved"].includes(row.status)).length;
}

export function calculateTrainingPendingCount(tasks: ModuleRow[]) {
  return tasks.filter((row) => detailValue(row, "Task Type") === "Training Acknowledgement" && !["Completed"].includes(row.status)).length;
}

export function calculateTrainingOverdueCount(tasks: ModuleRow[]) {
  return tasks.filter((row) => detailValue(row, "Task Type") === "Training Acknowledgement" && row.status === "Overdue").length;
}

export function calculateTrainingAcknowledgedCount(tasks: ModuleRow[]) {
  return tasks.filter((row) => detailValue(row, "Task Type") === "Training Acknowledgement" && row.status === "Completed").length;
}

export function calculateChecklistLinkedCount(rows: ModuleRow[]) {
  return rows.filter((row) => detailValue(row, "Linked Checklist Template IDs")).length;
}

export function calculateTemplatesGeneratedCount(rows: ModuleRow[]) {
  return rows.filter((row) =>
    detailValue(row, "Linked Checklist Template IDs")
    || detailValue(row, "Linked Inspection Template IDs")
    || detailValue(row, "Linked Task Template IDs"),
  ).length;
}

export function calculateSopTrainingCompletionRate(tasks: ModuleRow[]) {
  const trainingTasks = tasks.filter((row) => detailValue(row, "Task Type") === "Training Acknowledgement");
  if (!trainingTasks.length) return 0;
  return Math.round((trainingTasks.filter((row) => row.status === "Completed").length / trainingTasks.length) * 100);
}

export function calculateSopGovernanceRiskScore(rows: ModuleRow[], tasks: ModuleRow[]) {
  if (!rows.length) return 0;
  const needReview = calculateSopNeedReviewCount(rows);
  const draftReview = calculateSopDraftReviewCount(rows);
  const overdueTraining = calculateTrainingOverdueCount(tasks);
  const missingTemplates = rows.filter((row) => !detailValue(row, "Linked Checklist Template IDs")).length;
  return Math.max(0, Math.min(100, Math.round(
    ratio(needReview, rows.length) * 35
    + ratio(draftReview, rows.length) * 20
    + Math.min(20, overdueTraining * 5)
    + ratio(missingTemplates, rows.length) * 25,
  )));
}
