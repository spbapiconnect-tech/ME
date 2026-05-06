import { buildPsiDetailPanelData, getCurrentPsiLifecycleStage, getPsiLifecycleStagesByModule } from "@/lib/psi-lifecycle";
import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

function toSource(moduleCode: string, recordId: string, sourceComponent: string): DisplayRecord["source"] {
  return { moduleCode, recordId, pageType: "listing", sourceComponent, sourceEvent: "psi-preview" };
}

export function toSupplierDisplayRecords(data: Psi.SupplierPageData): DisplayRecord[] {
  return data.suppliers.map((item) => ({
    id: item.supplierId,
    title: item.name,
    subtitle: `${item.supplierCode} · ${item.category}`,
    description: `${item.serviceRegion} · ${item.leadTimeDays} days lead time`,
    status: item.status,
    priority: "medium",
    meta: [{ label: { zh: "区域", en: "Region" }, value: item.serviceRegion }],
    actions: [{ key: "view", label: { zh: "查看", en: "View" }, tone: "brand" }],
    source: toSource(item.sourceRef.moduleCode, item.supplierId, "psi-supplier-adapter"),
  }));
}

export function toSupplierIssueDisplayRecords(data: Psi.SupplierIssueDto[]): DisplayRecord[] {
  return data.map((item) => {
    const currentStage = getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule(item.sourceRef.moduleCode));
    return {
      id: item.issueId,
      title: item.title.en,
      subtitle: item.title.zh,
      description: `${item.supplierId} · ${item.openedAt}`,
      status: item.status,
      priority: item.priority,
      meta: [
        { label: { zh: "供应商", en: "Supplier" }, value: item.supplierId },
        { label: { zh: "生命周期", en: "Lifecycle" }, value: currentStage?.label.en ?? "Placeholder" },
        { label: { zh: "关联动作", en: "Related Action" }, value: "psi.action.reportSupplierIssue" },
      ],
      actions: [{ key: "detail", label: { zh: "详情", en: "Detail" }, tone: "neutral" }],
      source: toSource(item.sourceRef.moduleCode, item.issueId, "psi-supplier-issue-adapter"),
    };
  });
}

export function toSupplierDetailPanelData(record: Psi.SupplierDto): Psi.PsiDetailPanelData {
  return buildPsiDetailPanelData({
    recordId: record.supplierId,
    moduleCode: "supplier",
    recordType: record.sourceRef.recordType,
    title: { zh: `供应商 ${record.name}`, en: `Supplier ${record.name}` },
    subtitle: { zh: `${record.supplierCode} · ${record.serviceRegion}`, en: `${record.supplierCode} · ${record.serviceRegion}` },
    source: {
      moduleCode: record.sourceRef.moduleCode,
      recordId: record.sourceRef.recordId,
      recordType: record.sourceRef.recordType,
      route: record.sourceRef.route,
      actionDraftKey: "psi.action.reviewSupplier",
      accessRuleKey: "access.supplier.module",
      auditEventKey: "audit.access.procurement.module",
      workflowKey: "workflow.audit.accessProcurementModule",
      notificationKey: "notification.audit.accessProcurementModule",
    },
    relatedActionDraftKeys: [
      "psi.action.addSupplier",
      "psi.action.reviewSupplier",
      "psi.action.reportSupplierIssue",
    ],
    relatedTaskPlaceholders: [],
    relatedIssueIds: [],
  });
}
