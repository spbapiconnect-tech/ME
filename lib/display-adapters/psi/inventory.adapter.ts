import { buildPsiDetailPanelData, getCurrentPsiLifecycleStage, getPsiLifecycleStagesByModule } from "@/lib/psi-lifecycle";
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
  return data.map((item) => {
    const currentStage = getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule(item.sourceRef.moduleCode));
    return {
      id: item.issueId,
      title: item.title.en,
      subtitle: item.title.zh,
      description: `${item.skuId} · ${item.openedAt}`,
      status: item.status,
      priority: item.priority,
      meta: [
        { label: { zh: "SKU", en: "SKU" }, value: item.skuId },
        { label: { zh: "生命周期", en: "Lifecycle" }, value: currentStage?.label.en ?? "Placeholder" },
        { label: { zh: "关联动作", en: "Related Action" }, value: "psi.action.reportInventoryIssue" },
      ],
      actions: [{ key: "detail", label: { zh: "详情", en: "Detail" }, tone: "neutral" }],
      source: toSource(item.sourceRef.moduleCode, item.issueId, "psi-inventory-issue-adapter"),
    };
  });
}

export function toInventoryDetailPanelData(record: Psi.SkuDto): Psi.PsiDetailPanelData {
  return buildPsiDetailPanelData({
    recordId: record.skuId,
    moduleCode: "inventory",
    recordType: record.sourceRef.recordType,
    title: { zh: `库存 ${record.productName}`, en: `Inventory ${record.productName}` },
    subtitle: { zh: `${record.skuCode} · 安全库存 ${record.safetyStock}`, en: `${record.skuCode} · Safety stock ${record.safetyStock}` },
    source: {
      moduleCode: record.sourceRef.moduleCode,
      recordId: record.sourceRef.recordId,
      recordType: record.sourceRef.recordType,
      route: record.sourceRef.route,
      actionDraftKey: "psi.action.adjustInventory",
      accessRuleKey: "access.inventory.detail",
      auditEventKey: "audit.access.inventory.detail",
      workflowKey: "workflow.audit.inventoryDetailPreview",
      notificationKey: "notification.audit.inventoryDetailPreview",
    },
    relatedActionDraftKeys: [
      "psi.action.adjustInventory",
      "psi.action.transferStock",
      "psi.action.reportInventoryIssue",
    ],
    relatedTaskPlaceholders: [],
    relatedIssueIds: [],
  });
}
