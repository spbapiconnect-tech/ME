import type { LocalizedText } from "@/types/module";

import type { DemoModuleCode } from "@/data/demo";

interface DemoFlowStep {
  id: string;
  moduleCode: DemoModuleCode;
  title: LocalizedText;
  description: LocalizedText;
  signal: string;
}

interface DemoDashboardData {
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  heroMetrics: Array<{
    label: LocalizedText;
    value: string;
  }>;
  flowSteps: DemoFlowStep[];
}

export const demoDashboardData: DemoDashboardData = {
  title: { zh: "ME Demo Workspace", en: "ME Demo Workspace" },
  subtitle: {
    zh: "跨模块演示工作台，使用本地 mock data 串联六个核心模块。",
    en: "Cross-module demo workspace that connects six core modules with local mock data.",
  },
  description: {
    zh: "当前页面仅用于展示与验证，不接入真实 API、数据库或业务执行逻辑。",
    en: "This route is presentation-only and does not connect any real API, database, or execution logic.",
  },
  heroMetrics: [
    {
      label: { zh: "演示模块", en: "Demo Modules" },
      value: "6",
    },
    {
      label: { zh: "跨模块流转", en: "Cross-Module Flow" },
      value: "1",
    },
    {
      label: { zh: "本地 Mock 数据", en: "Local Mock Data" },
      value: "100%",
    },
  ],
  flowSteps: [
    {
      id: "flow-pos",
      moduleCode: "pos-report",
      title: { zh: "POS 销售信号", en: "POS Sales Signal" },
      description: {
        zh: "热销 SKU 与异常退款被标记，触发门店补货关注。",
        en: "Fast-moving SKUs and refund alerts are flagged to trigger replenishment attention.",
      },
      signal: "POS-1001 / TXN-1001",
    },
    {
      id: "flow-inventory",
      moduleCode: "inventory",
      title: { zh: "库存风险", en: "Inventory Risk" },
      description: {
        zh: "低库存与在途数量一起判断补货紧急程度。",
        en: "Low stock and pending inbound volume are combined to assess replenishment urgency.",
      },
      signal: "SKU-1001",
    },
    {
      id: "flow-procurement",
      moduleCode: "procurement",
      title: { zh: "采购建议", en: "Procurement Suggestion" },
      description: {
        zh: "系统展示建议采购申请与待审批节奏的演示样例。",
        en: "The workspace surfaces a suggested purchase request and approval pacing example.",
      },
      signal: "PR-1001 / PO-1001",
    },
    {
      id: "flow-supplier",
      moduleCode: "supplier",
      title: { zh: "供应商检查", en: "Supplier Check" },
      description: {
        zh: "同步查看交付表现、价格变动与合同到期提醒。",
        en: "Delivery performance, price movement, and contract expiry are reviewed together.",
      },
      signal: "SUP-1001",
    },
    {
      id: "flow-task",
      moduleCode: "task",
      title: { zh: "任务分配", en: "Task Assignment" },
      description: {
        zh: "将门店补货复核与供应商跟进拆解为执行任务。",
        en: "Store review and supplier follow-up are converted into execution tasks.",
      },
      signal: "TASK-1001",
    },
    {
      id: "flow-education",
      moduleCode: "education",
      title: { zh: "培训 / SOP 跟进", en: "Education / SOP Follow-up" },
      description: {
        zh: "把补货 SOP 与课程分派给门店团队，完成闭环演示。",
        en: "Replenishment SOPs and training courses are assigned to complete the demo loop.",
      },
      signal: "SOP-1001 / CRS-1001",
    },
  ],
};
