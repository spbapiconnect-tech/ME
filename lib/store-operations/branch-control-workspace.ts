import type { ModuleRow } from "@/components/module/module-page-shell";
import {
  calculateBranchAttentionLevel,
  calculateBranchFefoRiskScore,
  calculateBranchHealthScore,
  calculateBranchIncidentRiskScore,
  calculateBranchInspectionScore,
  calculateBranchRiskScore,
  calculateBranchTodayReadinessScore,
  calculateBranchExecutionScore,
  calculateCriticalIncidentCount,
  calculateExpiringTodayCount,
  calculateOpenIncidentCount,
  calculateOverdueTaskCount,
} from "@/lib/calculators/store-operation-calculators";

function detailValue(row: ModuleRow, label: string) {
  return row.detailItems?.find((item) => item.label === label)?.value ?? "";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function branchNameFromRow(row: ModuleRow) {
  return detailValue(row, "Branch")
    || detailValue(row, "Branch Name")
    || splitList(detailValue(row, "Outlets"))[0]
    || row.title;
}

function branchScoped(rows: ModuleRow[], branch: string) {
  return rows.filter((row) => branchNameFromRow(row) === branch);
}

function startsToday(value: string) {
  const today = new Date().toISOString().slice(0, 10);
  return value.startsWith(today);
}

export function getMissingSetupItems(branch?: ModuleRow) {
  if (!branch) return [];
  const checks = [
    { label: "Manager", empty: ["", "Unassigned"] },
    { label: "Supervisor", empty: [""] },
    { label: "Operating Hours", empty: [""] },
    { label: "POS ID", empty: [""] },
    { label: "Service Channels", empty: [""] },
    { label: "Station Areas", empty: [""] },
  ];
  return checks
    .filter((item) => item.empty.includes(detailValue(branch, item.label)))
    .map((item) => item.label);
}

export function getBranchStatusTone(status: string): "outline" | "secondary" | "destructive" {
  const value = status.toLowerCase();
  if (value.includes("suspended") || value.includes("closed") || value.includes("attention")) return "destructive";
  if (value.includes("setup") || value.includes("draft")) return "secondary";
  return "outline";
}

export function getBranchAttentionTone(level: string): "outline" | "secondary" | "destructive" {
  const value = level.toLowerCase();
  if (value.includes("critical") || value.includes("attention") || value.includes("high")) return "destructive";
  if (value.includes("watch") || value.includes("medium")) return "secondary";
  return "outline";
}

export function getBranchHealthBreakdown(branch: string, tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  const branchTasks = branchScoped(tasks, branch);
  const branchInspections = branchScoped(inspections, branch);
  const branchIncidents = branchScoped(incidents, branch);
  const branchFefo = branchScoped(fefoRecords, branch);
  return [
    { label: "Execution", value: `${calculateBranchExecutionScore(branchTasks)}%` },
    { label: "Inspection", value: `${calculateBranchInspectionScore(branchInspections)}%` },
    { label: "Incident Control", value: `${100 - calculateBranchIncidentRiskScore(branchIncidents)}%` },
    { label: "FEFO Control", value: `${100 - calculateBranchFefoRiskScore(branchFefo)}%` },
    { label: "Today Readiness", value: `${calculateBranchTodayReadinessScore(branchTasks, branchInspections, branchIncidents, branchFefo)}%` },
  ];
}

export function getBranchRiskBreakdown(branch: string, tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  const branchTasks = branchScoped(tasks, branch);
  const branchInspections = branchScoped(inspections, branch);
  const branchIncidents = branchScoped(incidents, branch);
  const branchFefo = branchScoped(fefoRecords, branch);
  return [
    { label: "Overdue Tasks", value: String(calculateOverdueTaskCount(branchTasks)) },
    { label: "Failed Inspections", value: String(branchInspections.filter((row) => row.status === "Failed Items").length) },
    { label: "Open Incidents", value: String(calculateOpenIncidentCount(branchIncidents)) },
    { label: "Critical Incidents", value: String(calculateCriticalIncidentCount(branchIncidents)) },
    { label: "FEFO Expiring Today", value: String(calculateExpiringTodayCount(branchFefo)) },
    { label: "Risk Score", value: `${calculateBranchRiskScore(branch, tasks, inspections, incidents, fefoRecords)}%` },
  ];
}

export function getTodayOperationSummary(branch: ModuleRow, tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  const branchName = branch.title;
  const branchTasks = branchScoped(tasks, branchName);
  const branchInspections = branchScoped(inspections, branchName);
  const branchIncidents = branchScoped(incidents, branchName);
  const branchFefo = branchScoped(fefoRecords, branchName);
  return {
    branch: branchName,
    openTodayStatus: detailValue(branch, "Open Today Status") || "Not Opened",
    dueTasks: branchTasks.filter((row) => row.status === "Due Today" || startsToday(detailValue(row, "Due Date"))).length,
    pendingReview: branchTasks.filter((row) => row.status === "Pending Review").length,
    inspectionStatus: branchInspections.find((row) => startsToday(detailValue(row, "Scheduled Time")))?.status || "Not Scheduled",
    criticalIncident: branchIncidents.some((row) => detailValue(row, "Severity") === "Critical") ? "Critical" : "Clear",
    expiringItems: branchFefo.filter((row) => ["Expiring Soon", "Use First", "Expired"].includes(row.status)).length,
    readinessScore: calculateBranchTodayReadinessScore(branchTasks, branchInspections, branchIncidents, branchFefo),
  };
}

export function getBranchNextActions(branch: ModuleRow, tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  const branchName = branch.title;
  const branchTasks = branchScoped(tasks, branchName);
  const branchInspections = branchScoped(inspections, branchName);
  const branchIncidents = branchScoped(incidents, branchName);
  const branchFefo = branchScoped(fefoRecords, branchName);
  const actions: Array<{ actionId: string; label: string; sourceModule: string; severity: string; route: string; linkedRecordId?: string }> = [];

  if (getMissingSetupItems(branch).length) {
    actions.push({ actionId: "branch-setup", label: "Create branch setup task", sourceModule: "Branch Control", severity: "Medium", route: "/tasks" });
  }
  const overdueTask = branchTasks.find((row) => row.status === "Overdue");
  if (overdueTask) actions.push({ actionId: "overdue-execution", label: "Review overdue outlet execution", sourceModule: "Outlet Execution", severity: "High", route: "/tasks", linkedRecordId: overdueTask.id });
  const pendingProof = branchTasks.find((row) => detailValue(row, "Photo Proof Status") === "Submitted");
  if (pendingProof) actions.push({ actionId: "pending-proof", label: "Review submitted photo proof", sourceModule: "Outlet Execution", severity: "Medium", route: "/tasks", linkedRecordId: pendingProof.id });
  const failedInspection = branchInspections.find((row) => row.status === "Failed Items");
  if (failedInspection) actions.push({ actionId: "failed-inspection", label: "Open inspection review", sourceModule: "Store Inspection", severity: "High", route: "/inspection", linkedRecordId: failedInspection.id });
  const criticalIncident = branchIncidents.find((row) => detailValue(row, "Severity") === "Critical");
  if (criticalIncident) actions.push({ actionId: "critical-incident", label: "Escalate incident", sourceModule: "Incident Center", severity: "Critical", route: "/issues", linkedRecordId: criticalIncident.id });
  const expiredFefo = branchFefo.find((row) => row.status === "Expired");
  if (expiredFefo) actions.push({ actionId: "expired-fefo", label: "Create disposal action", sourceModule: "FEFO / Waste Control", severity: "High", route: "/expiry", linkedRecordId: expiredFefo.id });

  return actions;
}

export function getBranchDetail(branch: ModuleRow | undefined, tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  if (!branch) return null;
  const branchName = branch.title;
  const branchTasks = branchScoped(tasks, branchName);
  const branchInspections = branchScoped(inspections, branchName);
  const branchIncidents = branchScoped(incidents, branchName);
  const branchFefo = branchScoped(fefoRecords, branchName);
  return {
    branchName,
    code: detailValue(branch, "Branch Code") || detailValue(branch, "Code") || "Not Set",
    region: detailValue(branch, "Region") || "Not Set",
    brand: detailValue(branch, "Brand") || "Not Set",
    outletType: detailValue(branch, "Outlet Type") || "Not Set",
    manager: detailValue(branch, "Manager") || "Unassigned",
    supervisor: detailValue(branch, "Supervisor") || "Unassigned",
    operatingHours: detailValue(branch, "Operating Hours") || "Not Set",
    setupStatus: detailValue(branch, "Setup Status") || "Not Started",
    openTodayStatus: detailValue(branch, "Open Today Status") || "Not Opened",
    attentionLevel: calculateBranchAttentionLevel(
      calculateBranchHealthScore(branchName, tasks, inspections, incidents, fefoRecords),
      calculateBranchRiskScore(branchName, tasks, inspections, incidents, fefoRecords),
    ),
    healthScore: calculateBranchHealthScore(branchName, tasks, inspections, incidents, fefoRecords),
    riskScore: calculateBranchRiskScore(branchName, tasks, inspections, incidents, fefoRecords),
    todayOperation: getTodayOperationSummary(branch, tasks, inspections, incidents, fefoRecords),
    missingSetupItems: getMissingSetupItems(branch),
    linkedTasks: branchTasks.slice(0, 5),
    linkedInspections: branchInspections.slice(0, 5),
    linkedIncidents: branchIncidents.slice(0, 5),
    linkedFefoRecords: branchFefo.slice(0, 5),
    healthBreakdown: getBranchHealthBreakdown(branchName, tasks, inspections, incidents, fefoRecords),
    riskBreakdown: getBranchRiskBreakdown(branchName, tasks, inspections, incidents, fefoRecords),
    nextActions: getBranchNextActions(branch, tasks, inspections, incidents, fefoRecords),
  };
}

export function getBranchHealthBoard(branches: ModuleRow[], tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  return branches.map((branch) => {
    const branchName = branch.title;
    const branchTasks = branchScoped(tasks, branchName);
    const branchInspections = branchScoped(inspections, branchName);
    const branchIncidents = branchScoped(incidents, branchName);
    const branchFefo = branchScoped(fefoRecords, branchName);
    const healthScore = calculateBranchHealthScore(branchName, tasks, inspections, incidents, fefoRecords);
    const riskScore = calculateBranchRiskScore(branchName, tasks, inspections, incidents, fefoRecords);
    return {
      row: branch,
      branch: branchName,
      status: branch.status,
      setupStatus: detailValue(branch, "Setup Status") || "Not Started",
      openTodayStatus: detailValue(branch, "Open Today Status") || "Not Opened",
      manager: detailValue(branch, "Manager") || "Unassigned",
      healthScore,
      riskScore,
      attentionLevel: calculateBranchAttentionLevel(healthScore, riskScore),
      openIncidents: calculateOpenIncidentCount(branchIncidents),
      criticalIncidents: calculateCriticalIncidentCount(branchIncidents),
      overdueTasks: calculateOverdueTaskCount(branchTasks),
      failedInspections: branchInspections.filter((row) => row.status === "Failed Items").length,
      fefoRisk: calculateBranchFefoRiskScore(branchFefo),
      linkedCounts: {
        tasks: branchTasks.length,
        inspections: branchInspections.length,
        incidents: branchIncidents.length,
        fefo: branchFefo.length,
      },
    };
  }).sort((a, b) => b.riskScore - a.riskScore || a.healthScore - b.healthScore);
}

export function getBranchAttentionQueue(branches: ModuleRow[], tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  return branches.flatMap((branch) => {
    const branchName = branch.title;
    const items: Array<{ id: string; branch: string; riskReason: string; sourceModule: string; severity: string; linkedRecordId?: string }> = [];
    const overdueTask = branchScoped(tasks, branchName).find((row) => row.status === "Overdue");
    if (overdueTask) items.push({ id: `${branch.id}-overdue`, branch: branchName, riskReason: "Overdue outlet execution", sourceModule: "Outlet Execution", severity: "High", linkedRecordId: overdueTask.id });
    const criticalIncident = branchScoped(incidents, branchName).find((row) => detailValue(row, "Severity") === "Critical");
    if (criticalIncident) items.push({ id: `${branch.id}-critical-incident`, branch: branchName, riskReason: "Critical incident open", sourceModule: "Incident Center", severity: "Critical", linkedRecordId: criticalIncident.id });
    const failedInspection = branchScoped(inspections, branchName).find((row) => row.status === "Failed Items");
    if (failedInspection) items.push({ id: `${branch.id}-failed-inspection`, branch: branchName, riskReason: "Failed inspection review", sourceModule: "Store Inspection", severity: "High", linkedRecordId: failedInspection.id });
    const expiredFefo = branchScoped(fefoRecords, branchName).find((row) => ["Expired", "Use First"].includes(row.status));
    if (expiredFefo) items.push({ id: `${branch.id}-fefo-risk`, branch: branchName, riskReason: expiredFefo.status === "Expired" ? "Expired FEFO batch" : "Use-first batch requires action", sourceModule: "FEFO / Waste Control", severity: expiredFefo.status === "Expired" ? "Critical" : "Medium", linkedRecordId: expiredFefo.id });
    const missingSetup = getMissingSetupItems(branch);
    if (missingSetup.length) items.push({ id: `${branch.id}-setup`, branch: branchName, riskReason: `Missing setup: ${missingSetup[0]}`, sourceModule: "Branch Control", severity: "Medium" });
    return items;
  });
}

export function getBranchKpis(branches: ModuleRow[], tasks: ModuleRow[], inspections: ModuleRow[], incidents: ModuleRow[], fefoRecords: ModuleRow[]) {
  const healthBoard = getBranchHealthBoard(branches, tasks, inspections, incidents, fefoRecords);
  return [
    { label: "Total Branches", value: String(branches.length) },
    { label: "Open Today", value: String(healthBoard.filter((item) => item.openTodayStatus === "Open").length) },
    { label: "Need Attention", value: String(healthBoard.filter((item) => ["Attention", "Critical"].includes(item.attentionLevel)).length) },
    { label: "Critical Risk", value: String(healthBoard.filter((item) => item.attentionLevel === "Critical").length) },
    { label: "Overdue Tasks", value: String(tasks.filter((row) => row.status === "Overdue").length) },
    { label: "Open Incidents", value: String(calculateOpenIncidentCount(incidents)) },
    { label: "Failed Inspections", value: String(inspections.filter((row) => row.status === "Failed Items").length) },
    { label: "FEFO Risk", value: String(fefoRecords.filter((row) => ["Expiring Soon", "Use First", "Expired"].includes(row.status)).length) },
  ];
}
