import {
  buildPsiDetailPanelData,
  getCurrentPsiLifecycleStage,
  getPsiLifecycleStagesByModule,
  resolvePsiTimelineTitle,
} from "@/lib/psi-lifecycle";
import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

function toSource(moduleCode: string, recordId: string, sourceComponent: string): DisplayRecord["source"] {
  return { moduleCode, recordId, pageType: "listing", sourceComponent, sourceEvent: "psi-preview" };
}

export function toPsiIssueDisplayRecord(issue: Psi.PurchaseIssueDto): DisplayRecord {
  const currentStage = getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule(issue.sourceRef.moduleCode));
  return {
    id: issue.issueId,
    title: issue.title.en,
    subtitle: issue.title.zh,
    description: `${issue.issueType} · ${issue.supplierId ?? "No Supplier"}`,
    status: issue.status,
    priority: issue.priority,
    meta: [
      { label: { zh: "开启时间", en: "Opened At" }, value: issue.openedAt },
      { label: { zh: "生命周期", en: "Lifecycle" }, value: currentStage?.label.en ?? "Placeholder" },
      { label: { zh: "来源", en: "Source" }, value: issue.sourceRef.recordId },
      { label: { zh: "关联动作", en: "Related Action" }, value: "psi.action.reportPurchaseIssue" },
    ],
    actions: [{ key: "detail", label: { zh: "详情", en: "Detail" }, tone: "neutral" }],
    source: toSource(issue.sourceRef.moduleCode, issue.issueId, "psi-procurement-issue-adapter"),
  };
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
    actions: [{ key: "view", label: { zh: "查看", en: "View" }, tone: "brand" }],
    source: toSource(item.sourceRef.moduleCode, item.requestId, "psi-procurement-adapter"),
  }));
}

export function toProcurementIssueDisplayRecords(data: Psi.PurchaseIssueDto[]): DisplayRecord[] {
  return data.map((item) => toPsiIssueDisplayRecord(item));
}

export function toProcurementDetailPanelData(record: Psi.PurchaseRequestDto): Psi.PsiDetailPanelData {
  return buildPsiDetailPanelData({
    recordId: record.requestId,
    moduleCode: "procurement",
    recordType: record.sourceRef.recordType,
    title: { zh: `采购申请 ${record.requestNo}`, en: `Purchase Request ${record.requestNo}` },
    subtitle: { zh: `${record.storeId} · ${record.supplierId ?? "未指定供应商"}`, en: `${record.storeId} · ${record.supplierId ?? "No Supplier"}` },
    source: {
      moduleCode: record.sourceRef.moduleCode,
      recordId: record.sourceRef.recordId,
      recordType: record.sourceRef.recordType,
      route: record.sourceRef.route,
      actionDraftKey: "psi.action.reportPurchaseIssue",
      accessRuleKey: "access.procurement.listing",
      auditEventKey: "audit.action.createPurchaseRequest",
      workflowKey: "workflow.action.createPurchaseRequest",
      notificationKey: "notification.workflow.purchaseRequestCreated",
      taskId: record.linkedTasks?.[0]?.taskId,
    },
    relatedActionDraftKeys: [
      "psi.action.createPurchaseRequest",
      "psi.action.recordReceiving",
      "psi.action.reportPurchaseIssue",
    ],
    relatedTaskPlaceholders: record.linkedTasks ?? [],
    relatedIssueIds: record.issues?.map((issue) => issue.issueId) ?? [],
  });
}

export function toPsiTimelineDisplayRows(events: Psi.PsiTimelineEvent[]) {
  return events.map((event) => ({
    key: event.key,
    title: resolvePsiTimelineTitle(event, "en"),
    actor: event.actor.name.en,
    eventType: event.eventType,
    tone: event.tone,
    status: event.status,
    occurredAt: event.occurredAt,
    isPlaceholder: event.isPlaceholder,
  }));
}

export function toPsiLinkedRecordRows(records: Psi.PsiLinkedRecord[]) {
  return records.map((item) => ({
    key: item.key,
    label: item.label.en,
    moduleCode: item.moduleCode,
    recordId: item.recordId,
    recordType: item.recordType,
    route: item.route,
    status: item.status ?? "pending",
  }));
}
