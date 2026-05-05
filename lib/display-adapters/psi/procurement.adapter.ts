import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

function toSource(moduleCode: string, recordId: string, sourceComponent: string): DisplayRecord["source"] {
  return { moduleCode, recordId, pageType: "listing", sourceComponent, sourceEvent: "psi-preview" };
}

export function toProcurementDisplayRecords(data: Psi.ProcurementPageData): DisplayRecord[] {
  return data.purchaseRequests.map((item) => ({
    id: item.requestId,
    title: item.requestNo,
    subtitle: `${item.storeId} · ${item.supplierId ?? "No Supplier"}`,
    description: `${item.lines.length} lines · ${item.totalAmount.currency} ${item.totalAmount.amount.toFixed(2)}`,
    status: item.status,
    priority: item.priority,
    meta: [
      { label: { zh: "申请日期", en: "Request Date" }, value: item.requestDate },
      { label: { zh: "需求日期", en: "Need By" }, value: item.neededBy ?? "N/A" },
    ],
    actions: [
      { key: "view", label: { zh: "查看", en: "View" }, tone: "brand" },
    ],
    source: toSource(item.sourceRef.moduleCode, item.requestId, "psi-procurement-adapter"),
  }));
}

export function toProcurementIssueDisplayRecords(data: Psi.PurchaseIssueDto[]): DisplayRecord[] {
  return data.map((item) => ({
    id: item.issueId,
    title: item.title.en,
    subtitle: item.title.zh,
    description: `${item.issueType} · ${item.supplierId ?? "No Supplier"}`,
    status: item.status,
    priority: item.priority,
    meta: [{ label: { zh: "开启时间", en: "Opened At" }, value: item.openedAt }],
    actions: [{ key: "detail", label: { zh: "详情", en: "Detail" }, tone: "neutral" }],
    source: toSource(item.sourceRef.moduleCode, item.issueId, "psi-procurement-issue-adapter"),
  }));
}
