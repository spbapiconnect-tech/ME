import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const posreportPageSchemas = createModulePageSchemas({
  moduleCode: "pos-report",
  moduleName: { zh: "POS 报表", en: "POS Report" },
  moduleShortName: { zh: "报表", en: "POS" },
  moduleDescription: { zh: "POS 经营分析模板。", en: "POS performance reporting templates." },
  dashboardWidgets: [
    { key: "salesToday", title: { zh: "今日销售", en: "Sales Today" }, description: { zh: "今日销售占位指标", en: "Today sales placeholder metric" } },
    { key: "conversion", title: { zh: "转化关注", en: "Conversion Watch" }, description: { zh: "转化率关注项", en: "Conversion watch items" } },
    { key: "refunds", title: { zh: "退款占位", en: "Refund Watch" }, description: { zh: "退款与异常占位", en: "Refund and exception placeholders" } },
    { key: "trend", title: { zh: "趋势概览", en: "Trend Overview" }, description: { zh: "经营趋势摘要", en: "Business trend summary" } }
  ],
  listingColumns: [
    { key: "reportDate", label: { zh: "报表日期", en: "Report Date" }, emphasis: true },
    { key: "branch", label: { zh: "门店", en: "Branch" } },
    { key: "salesAmount", label: { zh: "销售额", en: "Sales Amount" } },
    { key: "transactions", label: { zh: "交易数", en: "Transactions" } },
    { key: "status", label: { zh: "状态", en: "Status" } }
  ],
  filters: [
    { key: "reportDate", label: { zh: "日期范围", en: "Date Range" }, type: "date-range" },
    { key: "branch", label: { zh: "门店", en: "Branch" }, type: "select" },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status" }
  ],
  detailSections: [
    { key: "summary", title: { zh: "报表摘要", en: "Report Summary" }, layout: "panel", fieldKeys: ["reportDate", "branch", "salesAmount", "transactions"] },
    { key: "signal", title: { zh: "经营信号", en: "Business Signals" }, layout: "panel", fieldKeys: ["status"] },
    { key: "timeline", title: { zh: "分析时间线", en: "Analysis Timeline" }, layout: "timeline" }
  ],
  issueFields: [
    { key: "issueType", label: { zh: "问题类型", en: "Issue Type" }, type: "select", placeholder: { zh: "选择问题类型", en: "Select Issue Type" } },
    { key: "branch", label: { zh: "门店", en: "Branch" }, type: "text", placeholder: { zh: "请输入门店", en: "Enter Branch" } },
    { key: "severity", label: { zh: "严重级别", en: "Severity" }, type: "status", placeholder: { zh: "选择严重级别", en: "Select Severity" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" } },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status", placeholder: { zh: "选择状态", en: "Select Status" } }
  ],
  formFields: [
    { key: "reportDate", label: { zh: "报表日期", en: "Report Date" }, type: "date", placeholder: { zh: "选择报表日期", en: "Select Report Date" }, required: true },
    { key: "branch", label: { zh: "门店", en: "Branch" }, type: "text", placeholder: { zh: "请输入门店", en: "Enter Branch" }, required: true },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "select", placeholder: { zh: "选择状态", en: "Select Status" } },
    { key: "salesAmount", label: { zh: "目标销售额", en: "Target Sales Amount" }, type: "currency", placeholder: { zh: "请输入目标销售额", en: "Enter Target Sales Amount" } },
    { key: "transactions", label: { zh: "目标交易数", en: "Target Transactions" }, type: "number", placeholder: { zh: "请输入目标交易数", en: "Enter Target Transactions" } },
    { key: "notes", label: { zh: "备注", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入备注", en: "Enter Notes" } }
  ],
});
