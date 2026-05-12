import { expiryBatchMaster, issueMaster, skuMaster, supplierMaster } from "@/lib/me/master-data";
import type { MeRuleDefinition } from "@/lib/me/types";

export const ruleDefinitions: MeRuleDefinition[] = [
  { id: "RULE-EXPIRY-003", module: "expiry", condition: "expiry within 3 days", action: "create expiry alert", severity: "high", enabled: true, description: "Create branch alert when expiry date is within 3 days." },
  { id: "RULE-STOCK-LOW", module: "inventory", condition: "stock below reorder point", action: "create reorder suggestion", severity: "high", enabled: true, description: "Propose replenishment when stock crosses reorder threshold." },
  { id: "RULE-INSPECTION-FAIL", module: "inspection", condition: "inspection has failed items", action: "create follow-up task", severity: "medium", enabled: true, description: "Open corrective task after failed checklist findings." },
  { id: "RULE-ISSUE-CRITICAL", module: "issues", condition: "issue severity critical", action: "notify branch manager", severity: "critical", enabled: true, description: "Escalate critical incident to branch and operations managers." },
  { id: "RULE-SCHEDULE-GAP", module: "schedule", condition: "coverage gap detected", action: "raise scheduling warning", severity: "high", enabled: true, description: "Warn workforce team when assigned shifts do not meet demand." },
  { id: "RULE-SUPPLIER-RATING", module: "supplier", condition: "supplier rating below threshold", action: "flag supplier review", severity: "medium", enabled: true, description: "Mark supplier for review when performance score drops." },
];

export function evaluateRules() {
  const expiringSoon = expiryBatchMaster.filter((item) => {
    const diff = (new Date(item.expiryDate).getTime() - Date.now()) / 86400000;
    return diff <= 3;
  }).length;

  return {
    expiringSoon,
    lowStockItems: skuMaster.filter((item) => {
      const statusValue = String((item as { status?: string }).status ?? "").toLowerCase();
      return statusValue.includes("pending") || statusValue.includes("review") || statusValue.includes("blocked");
    }).length,
    criticalIssues: issueMaster.filter((item) => item.severity === "critical").length,
    supplierReviewCount: supplierMaster.filter((item) => item.status === "review").length,
  };
}
