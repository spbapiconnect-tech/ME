import {
  psiInventoryIssueLifecycleStages,
  psiProcurementIssueLifecycleStages,
  psiReceivingLifecycleStages,
  psiStockRiskLifecycleStages,
  psiSupplierIssueLifecycleStages,
} from "@/config/psi";
import type {
  PsiDetailInsight,
  PsiDetailPanelData,
  PsiIssueLifecycleStage,
  PsiLinkedRecord,
  PsiLifecycleStatus,
  PsiTimelineEvent,
  PsiTimelineSource,
} from "@/types/psi";
import type { LocalizedText, SupportedLocale } from "@/types/module";
import type { PsiLinkedTaskPlaceholder } from "@/types/psi/shared";

interface CreateTimelinePlaceholderParams {
  key: string;
  title: LocalizedText;
  description?: LocalizedText;
  status: PsiLifecycleStatus;
  source: PsiTimelineSource;
  occurredAt: string;
  tone?: PsiTimelineEvent["tone"];
  eventType?: PsiTimelineEvent["eventType"];
  actor?: PsiTimelineEvent["actor"];
}

interface BuildPsiDetailPanelDataParams {
  recordId: string;
  moduleCode: string;
  recordType: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  source: PsiTimelineSource;
  lifecycle?: PsiIssueLifecycleStage[];
  timeline?: PsiTimelineEvent[];
  linkedRecords?: PsiLinkedRecord[];
  insights?: PsiDetailInsight[];
  relatedActionDraftKeys?: string[];
  relatedTaskPlaceholders?: PsiLinkedTaskPlaceholder[];
  relatedIssueIds?: string[];
}

function cloneStages(stages: PsiIssueLifecycleStage[]): PsiIssueLifecycleStage[] {
  return stages.map((stage) => ({ ...stage }));
}

export function getPsiLifecycleStagesByModule(moduleCode: string): PsiIssueLifecycleStage[] {
  if (moduleCode === "procurement") return cloneStages(psiProcurementIssueLifecycleStages);
  if (moduleCode === "supplier") return cloneStages(psiSupplierIssueLifecycleStages);
  if (moduleCode === "inventory") return cloneStages(psiInventoryIssueLifecycleStages);
  return cloneStages(psiProcurementIssueLifecycleStages);
}

export function getPsiLifecycleStagesByRecordType(recordType: string): PsiIssueLifecycleStage[] {
  if (recordType.includes("receiving")) return cloneStages(psiReceivingLifecycleStages);
  if (recordType.includes("stock") || recordType.includes("replenishment")) return cloneStages(psiStockRiskLifecycleStages);
  if (recordType.includes("supplier")) return cloneStages(psiSupplierIssueLifecycleStages);
  if (recordType.includes("inventory") || recordType === "sku") return cloneStages(psiInventoryIssueLifecycleStages);
  if (recordType.includes("procurement") || recordType.includes("purchase")) return cloneStages(psiProcurementIssueLifecycleStages);
  return cloneStages(psiProcurementIssueLifecycleStages);
}

export function getCurrentPsiLifecycleStage(stages: PsiIssueLifecycleStage[]): PsiIssueLifecycleStage | null {
  if (stages.length === 0) return null;
  return stages.find((stage) => stage.isCurrent) ?? stages[0] ?? null;
}

export function createPsiTimelinePlaceholder(params: CreateTimelinePlaceholderParams): PsiTimelineEvent {
  return {
    key: params.key,
    title: params.title,
    description: params.description,
    eventType: params.eventType ?? "system-placeholder",
    tone: params.tone ?? "muted",
    status: params.status,
    actor: params.actor ?? {
      actorType: "system",
      name: { zh: "系统占位", en: "System Placeholder" },
      role: "System",
    },
    source: params.source,
    occurredAt: params.occurredAt,
    isPlaceholder: true,
    futureAuditKey: params.source.auditEventKey,
    futureWorkflowKey: params.source.workflowKey,
    futureNotificationKey: params.source.notificationKey,
  };
}

export function getPsiTimelineBySource(source: PsiTimelineSource): PsiTimelineEvent[] {
  const now = new Date().toISOString();
  return [
    createPsiTimelinePlaceholder({
      key: `${source.recordId}-created`,
      title: { zh: "记录创建（占位）", en: "Record Created (Placeholder)" },
      description: { zh: "当前仅展示只读占位记录。", en: "Read-only placeholder record is shown." },
      status: "open",
      eventType: "created",
      tone: "info",
      source,
      occurredAt: now,
      actor: {
        actorType: "role",
        name: { zh: "运营角色", en: "Operations Role" },
        role: "Operations",
      },
    }),
    createPsiTimelinePlaceholder({
      key: `${source.recordId}-action`,
      title: { zh: "关联动作草稿（占位）", en: "Related Action Draft (Placeholder)" },
      description: { zh: "可跳转到动作草稿，但不会提交。", en: "Can navigate to action draft, but no submit happens." },
      status: "pending-action",
      eventType: "action-placeholder",
      tone: "warning",
      source,
      occurredAt: now,
    }),
    createPsiTimelinePlaceholder({
      key: `${source.recordId}-audit`,
      title: { zh: "审计记录预览（占位）", en: "Audit Preview (Placeholder)" },
      description: { zh: "未写入真实审计，仅展示未来接入点。", en: "No real audit write; future integration point only." },
      status: "placeholder",
      eventType: "audit-placeholder",
      tone: "muted",
      source: {
        ...source,
        auditEventKey: source.auditEventKey ?? "audit.system.previewOnly",
      },
      occurredAt: now,
    }),
  ];
}

export function getPsiLinkedRecordsForSource(source: PsiTimelineSource): PsiLinkedRecord[] {
  const linked: PsiLinkedRecord[] = [
    {
      key: `${source.moduleCode}-${source.recordId}`,
      label: { zh: "来源记录", en: "Source Record" },
      moduleCode: source.moduleCode,
      recordId: source.recordId,
      recordType: source.recordType,
      route: source.route,
      description: { zh: "当前详情关联的来源数据。", en: "Source data linked to current detail." },
    },
  ];

  if (source.actionDraftKey) {
    linked.push({
      key: `${source.recordId}-action-draft`,
      label: { zh: "动作草稿", en: "Action Draft" },
      moduleCode: "psi",
      recordId: source.actionDraftKey,
      recordType: "action-draft",
      route: `/psi/actions/${source.actionDraftKey}`,
      description: { zh: "只读动作草稿预览。", en: "Read-only action draft preview." },
    });
  }

  if (source.taskId) {
    linked.push({
      key: `${source.recordId}-task`,
      label: { zh: "关联任务占位", en: "Related Task Placeholder" },
      moduleCode: "task",
      recordId: source.taskId,
      recordType: "task",
      route: `/tasks/${source.taskId}`,
      description: { zh: "任务创建尚未启用。", en: "Task creation is not enabled yet." },
    });
  }

  return linked;
}

export function getPsiDetailInsightsByModule(moduleCode: string): PsiDetailInsight[] {
  if (moduleCode === "procurement") {
    return [
      {
        key: "procurement-receiving",
        label: { zh: "收货联动", en: "Receiving Link" },
        value: { zh: "待收货复核占位", en: "Receiving check placeholder" },
        tone: "info",
        description: { zh: "采购单与收货记录通过占位关系连接。", en: "Purchase order and receiving record are linked via placeholders." },
      },
      {
        key: "procurement-supplier",
        label: { zh: "供应商关系", en: "Supplier Relation" },
        value: { zh: "等待供应商反馈", en: "Waiting supplier response" },
        tone: "warning",
      },
    ];
  }

  if (moduleCode === "supplier") {
    return [
      {
        key: "supplier-risk",
        label: { zh: "供应商风险", en: "Supplier Risk" },
        value: { zh: "观察名单占位", en: "Watchlist placeholder" },
        tone: "danger",
      },
      {
        key: "supplier-collaboration",
        label: { zh: "协作状态", en: "Collaboration" },
        value: { zh: "复核中", en: "Under review" },
        tone: "info",
      },
    ];
  }

  return [
    {
      key: "inventory-stock-risk",
      label: { zh: "库存风险", en: "Stock Risk" },
      value: { zh: "建议补货占位", en: "Replenishment suggestion placeholder" },
      tone: "warning",
      description: { zh: "库存风险到采购动作仅为预览链路。", en: "Stock-risk to procurement action is preview-only." },
    },
    {
      key: "inventory-recount",
      label: { zh: "复盘点状态", en: "Recount Status" },
      value: { zh: "复盘点占位", en: "Recount placeholder" },
      tone: "muted",
    },
  ];
}

export function buildPsiDetailPanelData(params: BuildPsiDetailPanelDataParams): PsiDetailPanelData {
  const lifecycle = params.lifecycle ?? getPsiLifecycleStagesByRecordType(params.recordType);
  const timeline = params.timeline ?? getPsiTimelineBySource(params.source);

  return {
    recordId: params.recordId,
    moduleCode: params.moduleCode,
    title: params.title,
    subtitle: params.subtitle,
    lifecycle,
    timeline,
    linkedRecords: params.linkedRecords ?? getPsiLinkedRecordsForSource(params.source),
    insights: params.insights ?? getPsiDetailInsightsByModule(params.moduleCode),
    relatedActionDraftKeys: params.relatedActionDraftKeys ?? [],
    relatedTaskPlaceholders: params.relatedTaskPlaceholders ?? [],
    relatedIssueIds: params.relatedIssueIds ?? [],
    notice: {
      zh: "当前为只读占位详情，不执行状态流转、审计写入、任务创建或工作流触发。",
      en: "This is a read-only placeholder detail. No status transition, audit write, task creation, or workflow trigger is executed.",
    },
  };
}

export function resolvePsiTimelineTitle(event: PsiTimelineEvent, locale: SupportedLocale = "en"): string {
  return event.title[locale] ?? event.title.en;
}

export function resolvePsiLifecycleStageLabel(stage: PsiIssueLifecycleStage, locale: SupportedLocale = "en"): string {
  return stage.label[locale] ?? stage.label.en;
}
