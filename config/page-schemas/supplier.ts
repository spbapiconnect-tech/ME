import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const supplierPageSchemas = createModulePageSchemas({
  moduleCode: "supplier",
  moduleName: { zh: "供应商", en: "Supplier" },
  moduleShortName: { zh: "供方", en: "Supplier" },
  moduleDescription: { zh: "供应商目录与协作模板。", en: "Supplier directory and collaboration templates." },
  dashboardWidgets: [
    { key: "activeSuppliers", title: { zh: "活跃供应商", en: "Active Suppliers" }, description: { zh: "当前活跃合作供方", en: "Active suppliers in collaboration" } },
    { key: "reviewItems", title: { zh: "复核事项", en: "Review Items" }, description: { zh: "待复核供方事项", en: "Supplier reviews pending" } },
    { key: "performance", title: { zh: "绩效跟踪", en: "Performance" }, description: { zh: "绩效异常关注项", en: "Performance watch items" } },
    { key: "documents", title: { zh: "资料完整率", en: "Document Coverage" }, description: { zh: "资料占位完整度", en: "Supplier document placeholder coverage" } }
  ],
  listingColumns: [
    { key: "supplierCode", label: { zh: "供应商编码", en: "Supplier Code" }, emphasis: true },
    { key: "supplier", label: { zh: "供应商", en: "Supplier" } },
    { key: "category", label: { zh: "分类", en: "Category" } },
    { key: "status", label: { zh: "状态", en: "Status" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" } },
    { key: "createdAt", label: { zh: "创建时间", en: "Created At" } }
  ],
  filters: [
    { key: "status", label: { zh: "状态", en: "Status" }, type: "status" },
    { key: "category", label: { zh: "分类", en: "Category" }, type: "select" },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "owner" }
  ],
  detailSections: [
    { key: "profile", title: { zh: "供方档案", en: "Supplier Profile" }, layout: "panel", fieldKeys: ["supplierCode", "supplier", "category", "status"] },
    { key: "contact", title: { zh: "联系信息", en: "Contact Info" }, layout: "panel", fieldKeys: ["owner", "createdAt"] },
    { key: "scorecard", title: { zh: "绩效占位", en: "Performance Placeholder" }, layout: "panel" }
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
    { key: "supplierCode", label: { zh: "供应商编码", en: "Supplier Code" }, type: "text", placeholder: { zh: "请输入供应商编码", en: "Enter Supplier Code" }, required: true },
    { key: "supplier", label: { zh: "供应商名称", en: "Supplier Name" }, type: "text", placeholder: { zh: "请输入供应商名称", en: "Enter Supplier Name" }, required: true },
    { key: "category", label: { zh: "分类", en: "Category" }, type: "select", placeholder: { zh: "选择分类", en: "Select Category" }, required: true },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "status", label: { zh: "状态", en: "Status" }, type: "select", placeholder: { zh: "选择状态", en: "Select Status" } },
    { key: "reviewCycle", label: { zh: "复核周期", en: "Review Cycle" }, type: "text", placeholder: { zh: "请输入复核周期", en: "Enter Review Cycle" } },
    { key: "notes", label: { zh: "备注", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入备注", en: "Enter Notes" } }
  ],
});
