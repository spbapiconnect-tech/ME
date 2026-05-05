import type { WorkflowTargetCatalogItem } from "@/types/workflow";

export const workflowTargetCatalog: WorkflowTargetCatalogItem[] = [
  {
    code: "task.replenishment",
    name: { zh: "补货任务", en: "Replenishment Task" },
    description: { zh: "未来用于库存补货任务创建。", en: "Future metadata target for inventory replenishment task creation." },
    targetType: "task",
    targetModule: "inventory",
    status: "coming-soon",
  },
  {
    code: "task.supplier-review",
    name: { zh: "供应商复核任务", en: "Supplier Review Task" },
    description: { zh: "未来用于供应商资质复核任务。", en: "Future metadata target for supplier qualification review tasks." },
    targetType: "task",
    targetModule: "supplier",
    status: "preview-only",
  },
  {
    code: "task.refund-audit",
    name: { zh: "退款审计任务", en: "Refund Audit Task" },
    description: { zh: "未来用于退款风险审计任务。", en: "Future metadata target for refund risk audit tasks." },
    targetType: "task",
    targetModule: "pos-report",
    status: "placeholder",
  },
  {
    code: "approval.purchase-request",
    name: { zh: "采购申请审批", en: "Purchase Request Approval" },
    description: { zh: "未来采购申请审批路由目标。", en: "Future approval routing target for purchase requests." },
    targetType: "approval",
    targetModule: "procurement",
    status: "coming-soon",
  },
  {
    code: "notification.manager-alert",
    name: { zh: "经理告警通知", en: "Manager Alert Notification" },
    description: { zh: "未来经理通知通道占位。", en: "Future metadata placeholder for manager alert notifications." },
    targetType: "notification",
    targetModule: "task",
    status: "preview-only",
  },
  {
    code: "report.daily-ops-summary",
    name: { zh: "每日运营摘要", en: "Daily Ops Summary" },
    description: { zh: "未来日报汇总目标。", en: "Future reporting target for daily operations summary." },
    targetType: "report",
    targetModule: "shell",
    status: "active",
  },
  {
    code: "human-review.stock-variance",
    name: { zh: "库存差异人工复核", en: "Stock Variance Human Review" },
    description: { zh: "库存差异需人工确认的复核目标。", en: "Human review target for stock variance confirmation." },
    targetType: "human-review",
    targetModule: "inventory",
    status: "active",
  },
  {
    code: "automation-placeholder.external-connector",
    name: { zh: "外部连接器自动化占位", en: "External Connector Automation Placeholder" },
    description: { zh: "保留未来外部自动化连接能力。", en: "Reserved for future external automation connector integration." },
    targetType: "automation-placeholder",
    status: "placeholder",
  },
];

export const workflowTargetCatalogByCode: Record<string, WorkflowTargetCatalogItem> = Object.fromEntries(
  workflowTargetCatalog.map((target) => [target.code, target]),
);
