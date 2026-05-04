import { createModulePageSchemas } from "@/config/page-schemas/_shared";

export const inventoryPageSchemas = createModulePageSchemas({
  moduleCode: "inventory",
  moduleName: { zh: "库存", en: "Inventory" },
  moduleShortName: { zh: "库存", en: "Stock" },
  moduleDescription: { zh: "库存监控与调整模板。", en: "Inventory monitoring and adjustment templates." },
  dashboardWidgets: [
    { key: "stockHealth", title: { zh: "库存健康", en: "Stock Health" }, description: { zh: "库存健康与补货信号", en: "Stock health and replenishment signals" } },
    { key: "movement", title: { zh: "库存移动", en: "Inventory Movement" }, description: { zh: "库存流转动态", en: "Inventory movement activity" } },
    { key: "riskItems", title: { zh: "风险库存", en: "Risk Inventory" }, description: { zh: "库存风险关注项", en: "At-risk inventory items" } },
    { key: "cycleWatch", title: { zh: "盘点关注", en: "Cycle Watch" }, description: { zh: "盘点与差异提示", en: "Cycle count watch items" } }
  ],
  listingColumns: [
    { key: "sku", label: { zh: "SKU", en: "SKU" }, emphasis: true },
    { key: "productName", label: { zh: "商品名称", en: "Product Name" } },
    { key: "warehouse", label: { zh: "仓库", en: "Warehouse" } },
    { key: "availableQty", label: { zh: "可用库存", en: "Available Qty" } },
    { key: "stockStatus", label: { zh: "库存状态", en: "Stock Status" } }
  ],
  filters: [
    { key: "warehouse", label: { zh: "仓库", en: "Warehouse" }, type: "select" },
    { key: "stockStatus", label: { zh: "库存状态", en: "Stock Status" }, type: "status" },
    { key: "productName", label: { zh: "商品搜索", en: "Product Search" }, type: "search" }
  ],
  detailSections: [
    { key: "summary", title: { zh: "库存摘要", en: "Inventory Summary" }, layout: "panel", fieldKeys: ["sku", "productName", "warehouse", "availableQty"] },
    { key: "health", title: { zh: "库存状态", en: "Stock Health" }, layout: "panel", fieldKeys: ["stockStatus"] },
    { key: "timeline", title: { zh: "库存时间线", en: "Inventory Timeline" }, layout: "timeline" }
  ],
  issueFields: [
    { key: "issueType", label: { zh: "问题类型", en: "Issue Type" }, type: "select", placeholder: { zh: "选择问题类型", en: "Select Issue Type" } },
    { key: "sku", label: { zh: "SKU", en: "SKU" }, type: "text", placeholder: { zh: "请输入SKU", en: "Enter SKU" } },
    { key: "warehouse", label: { zh: "仓库", en: "Warehouse" }, type: "text", placeholder: { zh: "请输入仓库", en: "Enter Warehouse" } },
    { key: "severity", label: { zh: "严重级别", en: "Severity" }, type: "status", placeholder: { zh: "选择严重级别", en: "Select Severity" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" } },
    { key: "dueDate", label: { zh: "截止日期", en: "Due Date" }, type: "date", placeholder: { zh: "选择截止日期", en: "Select Due Date" } }
  ],
  formFields: [
    { key: "sku", label: { zh: "SKU", en: "SKU" }, type: "text", placeholder: { zh: "请输入SKU", en: "Enter SKU" }, required: true },
    { key: "productName", label: { zh: "商品名称", en: "Product Name" }, type: "text", placeholder: { zh: "请输入商品名称", en: "Enter Product Name" }, required: true },
    { key: "warehouse", label: { zh: "仓库", en: "Warehouse" }, type: "text", placeholder: { zh: "请输入仓库", en: "Enter Warehouse" }, required: true },
    { key: "availableQty", label: { zh: "调整数量", en: "Adjusted Qty" }, type: "number", placeholder: { zh: "请输入调整数量", en: "Enter Adjusted Qty" }, required: true },
    { key: "stockStatus", label: { zh: "库存状态", en: "Stock Status" }, type: "select", placeholder: { zh: "选择库存状态", en: "Select Stock Status" } },
    { key: "owner", label: { zh: "负责人", en: "Owner" }, type: "user", placeholder: { zh: "选择负责人", en: "Select Owner" }, required: true },
    { key: "notes", label: { zh: "说明", en: "Notes" }, type: "textarea", placeholder: { zh: "请输入说明", en: "Enter Notes" } }
  ],
});
