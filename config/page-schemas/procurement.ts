import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const procurementPageSchemas = createModulePageSchemas({
  moduleCode: "procurement",
  moduleName: { zh: "采购", en: "Procurement" },
  moduleShortName: { zh: "采购", en: "Procure" },
  moduleDescription: { zh: "采购执行与申请模板。", en: "Procurement execution and request templates." },
  dashboardWidgets: [
    { key: "openRequests", title: { zh: "待处理申请", en: "Open Requests" }, description: { zh: "当前待处理采购申请数量", en: "Open procurement requests pending action" } },
    { key: "approvalQueue", title: { zh: "审批队列", en: "Approval Queue" }, description: { zh: "待审批采购事项", en: "Procurement approvals waiting for review" } },
    { key: "supplierRisk", title: { zh: "供应风险", en: "Supplier Risk" }, description: { zh: "供应稳定性关注项", en: "Supplier stability watch items" } },
    { key: "costWatch", title: { zh: "成本关注", en: "Cost Watch" }, description: { zh: "成本波动与预算提示", en: "Budget and cost watch indicators" } }
  ],
  listingColumns: [
    { key: "requestNo", label: { zh: "申请单号", en: "Request No" }, emphasis: true },
    { key: "supplier", label: { zh: "供应商", en: "Supplier" } },
    { key: "totalAmount", label: { zh: "总金额", en: "Total Amount" } },
    { key: "status", label: { zh: "状态", en: "Status" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" } },
    { key: "createdAt", label: { zh: "创建时间", en: "Created At" } }
  ],
  filters: [
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
    { key: "supplier", label: { zh: "供应商", en: "Supplier" }, type: "select" },
    { key: "dateRange", label: { zh: "日期范围", en: "Date Range" }, type: "date-range" }
  ],
  detailSections: [
    { key: "summary", title: { zh: "采购摘要", en: "Procurement Summary" }, layout: "panel", fieldKeys: ["requestNo", "supplier", "totalAmount", "status"] },
    { key: "owner", title: { zh: "责任与协作", en: "Ownership & Collaboration" }, layout: "panel", fieldKeys: ["owner", "createdAt"] },
    { key: "timeline", title: { zh: "处理时间线", en: "Processing Timeline" }, layout: "timeline" }
  ],
  issueFields: [
    { key: "issueType", label: { zh: "问题类型", en: "Issue Type" }, type: "select", placeholder: { zh: "选择问题类型", en: "Select Issue Type" } },
    { key: "supplier", label: { zh: "供应商", en: "Supplier" }, type: "text", placeholder: { zh: "请输入供应商", en: "Enter Supplier" } },
    { key: "severity", label: { zh: "严重级别", en: "Severity" }, type: "status", placeholder: { zh: "选择严重级别", en: "Select Severity" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" } },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status", placeholder: { zh: "选择状态", en: "Select Status" } }
  ],
  formFields: [
    { key: "requestNo", label: { zh: "申请单号", en: "Request No" }, type: "text", placeholder: { zh: "请输入申请单号", en: "Enter Request No" }, required: true },
    { key: "supplier", label: { zh: "供应商", en: "Supplier" }, type: "text", placeholder: { zh: "请输入供应商", en: "Enter Supplier" }, required: true },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "dateRange", label: { zh: "交付周期", en: "Delivery Window" }, type: "date-range", placeholder: { zh: "选择交付周期", en: "Select Delivery Window" } },
    { key: "totalAmount", label: { zh: "预算金额", en: "Budget Amount" }, type: "currency", placeholder: { zh: "请输入预算金额", en: "Enter Budget Amount" }, required: true },
    { key: "status", label: { zh: "流程状态", en: "Flow Status" }, type: "select", placeholder: { zh: "选择流程状态", en: "Select Flow Status" } },
    { key: "notes", label: { zh: "说明", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入说明", en: "Enter Notes" } }
  ],
});
