import type { RuleGroupContract } from "@/types/rule";

const t = (zh: string, en: string) => ({ zh, en });

export const ruleGroups: RuleGroupContract[] = [
  {
    key: "rules.inventory-risk",
    name: t("库存风险", "Inventory Risk"),
    description: t("库存相关风险与估值规则目录。", "Catalog for inventory risk and valuation rules."),
    sourceModule: "inventory",
    rules: ["rule.inventory.lowStockRisk", "rule.inventory.stockValueEstimate", "rule.inventory.stockVarianceSeverity"],
    status: "active",
    category: "inventory",
  },
  {
    key: "rules.pos-alerts",
    name: t("POS 告警", "POS Alerts"),
    description: t("POS 退款与销售波动预警规则。", "POS refund and sales fluctuation warning rules."),
    sourceModule: "pos-report",
    rules: ["rule.pos.refundAlert", "rule.pos.salesDropWarning"],
    status: "coming-soon",
    category: "pos",
  },
  {
    key: "rules.procurement-sla",
    name: t("采购 SLA", "Procurement SLA"),
    description: t("采购审批与收货 SLA 规则。", "Procurement approval and receiving SLA rules."),
    sourceModule: "procurement",
    rules: ["rule.procurement.overdueReceiving", "rule.procurement.approvalSla"],
    status: "active",
    category: "procurement",
  },
  {
    key: "rules.supplier-quality",
    name: t("供应商质量", "Supplier Quality"),
    description: t("供应商问题评分与严重性规则。", "Supplier issue scoring and severity rules."),
    sourceModule: "supplier",
    rules: ["rule.supplier.issueSeverity"],
    status: "active",
    category: "supplier",
  },
  {
    key: "rules.task-sla",
    name: t("任务 SLA", "Task SLA"),
    description: t("任务逾期和响应优先级规则。", "Task overdue and response-priority rules."),
    sourceModule: "task",
    rules: ["rule.task.overdueSla"],
    status: "active",
    category: "task",
  },
  {
    key: "rules.training-progress",
    name: t("培训进度", "Training Progress"),
    description: t("培训完成率相关规则。", "Rules related to training completion rate."),
    sourceModule: "education",
    rules: ["rule.education.trainingCompletionRate"],
    status: "preview-only",
    category: "education",
  },
  {
    key: "rules.workflow-notification",
    name: t("流程与通知", "Workflow & Notification"),
    description: t("工作流优先级与通知升级规则。", "Workflow-priority and notification-escalation rules."),
    sourceModule: "workflow",
    rules: ["rule.workflow.triggerPriority", "rule.notification.escalationRequired"],
    status: "active",
    category: "workflow",
  },
  {
    key: "rules.dashboard-health",
    name: t("看板健康度", "Dashboard Health"),
    description: t("老板看板健康评分规则。", "Owner dashboard health scoring rules."),
    sourceModule: "report-builder",
    rules: ["rule.report.ownerDashboardHealthScore"],
    status: "active",
    category: "report",
  },
  {
    key: "rules.system-preview",
    name: t("系统预览", "System Preview"),
    description: t("系统级元数据预览占位规则。", "System-level metadata preview placeholder rules."),
    sourceModule: "system",
    rules: ["rule.system.previewOnly"],
    status: "placeholder",
    category: "system",
  },
];

export const ruleGroupsByKey: Record<string, RuleGroupContract> = Object.fromEntries(ruleGroups.map((item) => [item.key, item]));
