import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

function toSource(moduleCode: string, recordId: string, sourceComponent: string): DisplayRecord["source"] {
  return { moduleCode, recordId, pageType: "listing", sourceComponent, sourceEvent: "psi-preview" };
}

export function toInventoryDisplayRecords(data: Psi.InventoryPageData): DisplayRecord[] {
  return data.skus.map((item) => ({
    id: item.skuId,
    title: item.productName,
    subtitle: `${item.skuCode} · ${item.unit}`,
    description: `Safety stock ${item.safetyStock}`,
    status: item.status,
    priority: "medium",
    meta: [{ label: { zh: "SKU", en: "SKU" }, value: item.skuId }],
    actions: [{ key: "view", label: { zh: "查看", en: "View" }, tone: "brand" }],
    source: toSource(item.sourceRef.moduleCode, item.skuId, "psi-inventory-adapter"),
  }));
}

export function toInventoryIssueDisplayRecords(data: Psi.InventoryIssueDto[]): DisplayRecord[] {
  return data.map((item) => ({
    id: item.issueId,
    title: item.title.en,
    subtitle: item.title.zh,
    description: `${item.skuId} · ${item.openedAt}`,
    status: item.status,
    priority: item.priority,
    meta: [{ label: { zh: "SKU", en: "SKU" }, value: item.skuId }],
    actions: [{ key: "detail", label: { zh: "详情", en: "Detail" }, tone: "neutral" }],
    source: toSource(item.sourceRef.moduleCode, item.issueId, "psi-inventory-issue-adapter"),
  }));
}
