import type { PsiIssueLifecycleStage, PsiLifecycleStatus, PsiTimelineTone } from "@/types/psi";

interface StageSeed {
  key: string;
  label: { zh: string; en: string };
  description: { zh: string; en: string };
  status: PsiLifecycleStatus;
  tone: PsiTimelineTone;
}

function createStageSet(stages: StageSeed[], currentKey: string): PsiIssueLifecycleStage[] {
  return stages.map((stage, index) => ({
    ...stage,
    order: index + 1,
    isCurrent: stage.key === currentKey,
    isPlaceholder: true,
  }));
}

export const psiProcurementIssueLifecycleStages = createStageSet(
  [
    {
      key: "open",
      label: { zh: "已开启", en: "Open" },
      description: { zh: "采购问题已登记，等待运营复核。", en: "Issue is registered and waiting operational review." },
      status: "open",
      tone: "warning",
    },
    {
      key: "review",
      label: { zh: "复核中", en: "Review" },
      description: { zh: "采购负责人复核问题来源与凭证。", en: "Procurement lead reviews source and evidence." },
      status: "reviewing",
      tone: "info",
    },
    {
      key: "waitingSupplier",
      label: { zh: "待供应商", en: "Waiting Supplier" },
      description: { zh: "等待供应商反馈交付或价格说明。", en: "Waiting supplier response for delivery or price clarification." },
      status: "waiting-supplier",
      tone: "muted",
    },
    {
      key: "receivingCheck",
      label: { zh: "收货复核", en: "Receiving Check" },
      description: { zh: "收货数据与订单数据进行占位比对。", en: "Receiving and order data are compared in placeholder mode." },
      status: "waiting-receiving",
      tone: "warning",
    },
    {
      key: "resolved",
      label: { zh: "已解决", en: "Resolved" },
      description: { zh: "问题进入解决占位阶段。", en: "Issue moves into resolved placeholder state." },
      status: "resolved",
      tone: "success",
    },
  ],
  "review",
);

export const psiSupplierIssueLifecycleStages = createStageSet(
  [
    {
      key: "open",
      label: { zh: "已开启", en: "Open" },
      description: { zh: "供应商问题被记录。", en: "Supplier issue is logged." },
      status: "open",
      tone: "warning",
    },
    {
      key: "supplierReview",
      label: { zh: "供应商复核", en: "Supplier Review" },
      description: { zh: "等待供应商提供说明。", en: "Waiting supplier clarification." },
      status: "waiting-supplier",
      tone: "info",
    },
    {
      key: "qualityCheck",
      label: { zh: "质量检查", en: "Quality Check" },
      description: { zh: "质量团队执行占位复核。", en: "Quality team performs placeholder review." },
      status: "reviewing",
      tone: "warning",
    },
    {
      key: "watchlist",
      label: { zh: "观察名单（占位）", en: "Watchlist Placeholder" },
      description: { zh: "供应商可能进入观察名单。", en: "Supplier may enter watchlist placeholder." },
      status: "escalated",
      tone: "danger",
    },
    {
      key: "resolved",
      label: { zh: "已解决", en: "Resolved" },
      description: { zh: "供应商问题闭环占位。", en: "Supplier issue closure placeholder." },
      status: "resolved",
      tone: "success",
    },
  ],
  "supplierReview",
);

export const psiInventoryIssueLifecycleStages = createStageSet(
  [
    {
      key: "open",
      label: { zh: "已开启", en: "Open" },
      description: { zh: "库存问题已被识别。", en: "Inventory issue is identified." },
      status: "open",
      tone: "warning",
    },
    {
      key: "stockCheck",
      label: { zh: "库存复核", en: "Stock Check" },
      description: { zh: "执行库存与盘点差异占位核对。", en: "Placeholder stock and count variance checks." },
      status: "waiting-stock-check",
      tone: "info",
    },
    {
      key: "adjustment",
      label: { zh: "库存调整（占位）", en: "Adjustment Placeholder" },
      description: { zh: "调整动作仅为占位，不写入库存。", en: "Adjustment is preview-only and does not write stock." },
      status: "pending-action",
      tone: "warning",
    },
    {
      key: "recount",
      label: { zh: "复盘点（占位）", en: "Recount Placeholder" },
      description: { zh: "复盘点流程仅展示占位。", en: "Recount flow is shown as placeholder only." },
      status: "reviewing",
      tone: "muted",
    },
    {
      key: "resolved",
      label: { zh: "已解决", en: "Resolved" },
      description: { zh: "库存问题进入已解决占位状态。", en: "Inventory issue enters resolved placeholder state." },
      status: "resolved",
      tone: "success",
    },
  ],
  "stockCheck",
);

export const psiReceivingLifecycleStages = createStageSet(
  [
    {
      key: "pending",
      label: { zh: "待收货", en: "Pending" },
      description: { zh: "收货记录等待处理。", en: "Receiving record is pending handling." },
      status: "pending-action",
      tone: "muted",
    },
    {
      key: "partial",
      label: { zh: "部分收货", en: "Partial" },
      description: { zh: "仅完成部分收货。", en: "Receiving is partially completed." },
      status: "waiting-receiving",
      tone: "warning",
    },
    {
      key: "disputed",
      label: { zh: "争议中", en: "Disputed" },
      description: { zh: "收货差异进入争议占位。", en: "Receiving variance enters disputed placeholder." },
      status: "escalated",
      tone: "danger",
    },
    {
      key: "completed",
      label: { zh: "已完成", en: "Completed" },
      description: { zh: "收货流程占位完成。", en: "Receiving flow is placeholder-completed." },
      status: "resolved",
      tone: "success",
    },
  ],
  "pending",
);

export const psiStockRiskLifecycleStages = createStageSet(
  [
    {
      key: "detected",
      label: { zh: "已发现", en: "Detected" },
      description: { zh: "库存风险信号被检测到。", en: "Stock risk signal is detected." },
      status: "open",
      tone: "danger",
    },
    {
      key: "replenishmentSuggested",
      label: { zh: "建议补货", en: "Replenishment Suggested" },
      description: { zh: "系统给出补货建议占位。", en: "System provides replenishment suggestion placeholder." },
      status: "pending-action",
      tone: "info",
    },
    {
      key: "purchaseRequest",
      label: { zh: "采购申请（占位）", en: "Purchase Request Placeholder" },
      description: { zh: "采购申请仅为占位关联。", en: "Purchase request linkage is placeholder-only." },
      status: "placeholder",
      tone: "muted",
    },
    {
      key: "monitoring",
      label: { zh: "持续监控", en: "Monitoring" },
      description: { zh: "风险监控持续进行。", en: "Risk remains under monitoring." },
      status: "reviewing",
      tone: "warning",
    },
    {
      key: "resolved",
      label: { zh: "已解决", en: "Resolved" },
      description: { zh: "风险进入解决占位。", en: "Risk enters resolved placeholder state." },
      status: "resolved",
      tone: "success",
    },
  ],
  "replenishmentSuggested",
);
