import type { MeBrainSignal } from "@/lib/me/types";

export const meBrainMap: Record<string, MeBrainSignal> = {
  inventory: {
    key: "inventory",
    watch: ["low stock", "no movement", "cost variance", "expiry risk", "supplier delay"],
    suggestedActions: ["create replenishment plan", "review stale SKUs", "verify purchase costs"],
    riskSignals: ["stockout risk", "waste risk", "margin pressure"],
    autoSummaryFields: ["atRiskSkus", "coverageDays", "highVarianceSkus"],
    operatorHints: ["Prioritize high-sales SKUs with low coverage.", "Escalate supplier delay > 48h."],
  },
  inspection: {
    key: "inspection",
    watch: ["failed checklist item", "repeated branch failure", "overdue review"],
    suggestedActions: ["open corrective task", "assign reviewer", "schedule re-inspection"],
    riskSignals: ["compliance risk", "hygiene risk"],
    autoSummaryFields: ["failedItems", "repeatFailures", "overdueReviews"],
    operatorHints: ["Focus on repeated failures before next opening cycle."],
  },
  issues: {
    key: "issues",
    watch: ["critical severity", "stale open issues", "reopened issues"],
    suggestedActions: ["escalate to manager", "assign owner", "trigger cross-branch alert"],
    riskSignals: ["service interruption", "operational instability"],
    autoSummaryFields: ["criticalOpen", "inReview", "staleIssues"],
    operatorHints: ["Close critical issues within SLA window."],
  },
};
