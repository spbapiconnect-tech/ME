import type { DemoModuleData } from "@/data/demo";

export const inventoryDemoData: DemoModuleData = {
  moduleCode: "inventory",
  scenario: {
    zh: "以 SKU-1001 的低库存与在途状态演示库存风险与调拨判断。",
    en: "Uses low stock and pending inbound data for SKU-1001 to demonstrate inventory risk and transfer decisions.",
  },
  summary: {
    zh: "展示库存价值、补货风险、调拨与盘点差异的演示流。",
    en: "Shows a demo flow across stock value, replenishment risk, transfers, and count variance.",
  },
  kpis: [
    { label: { zh: "库存价值", en: "Stock Value" }, value: "$182,600", trend: "+4.3%", tone: "brand" },
    { label: { zh: "低库存 SKU", en: "Low Stock SKUs" }, value: "12", trend: "3 urgent", tone: "warning" },
    { label: { zh: "待入库", en: "Pending Inbound" }, value: "8", trend: "2 today", tone: "info" },
    { label: { zh: "库存问题", en: "Stock Issues" }, value: "3", trend: "Watch", tone: "danger" },
  ],
  listingRows: [
    {
      sku: "SKU-1001",
      productName: "Fresh Milk 1L",
      warehouse: "Central DC",
      availableQty: "18",
      stockStatus: "risk",
    },
    {
      sku: "SKU-1002",
      productName: "Bakery Mix 2kg",
      warehouse: "Transit Hub",
      availableQty: "64",
      stockStatus: "active",
    },
    {
      sku: "SKU-1003",
      productName: "Seasonal Combo Box",
      warehouse: "Cold Room",
      availableQty: "26",
      stockStatus: "watch",
    },
  ],
  detailRecord: {
    sku: "SKU-1001",
    productName: "Fresh Milk 1L",
    warehouse: "Central DC",
    availableQty: "18",
    safetyStock: "36",
    inboundQty: "48",
    transferPlan: "West Branch -> Central DC",
    lastCount: "2026-05-03 22:15",
    variance: "-4 units",
    status: "Low Stock",
  },
  detailSections: [
    {
      title: { zh: "SKU 概览", en: "SKU Overview" },
      rows: [
        { label: "SKU", value: "SKU-1001" },
        { label: "Product", value: "Fresh Milk 1L" },
        { label: "Warehouse", value: "Central DC" },
        { label: "Available Qty", value: "18" },
      ],
    },
    {
      title: { zh: "风险上下文", en: "Risk Context" },
      rows: [
        { label: "Safety Stock", value: "36" },
        { label: "Inbound Qty", value: "48" },
        { label: "Transfer Plan", value: "West Branch -> Central DC" },
        { label: "Variance", value: "-4 units" },
      ],
    },
  ],
  issues: [
    {
      id: "INV-ISS-1001",
      title: "Low stock on Fresh Milk 1L",
      severity: "High",
      status: "open",
      owner: "Ivy Tan",
      dueDate: "2026-05-05",
    },
    {
      id: "INV-ISS-1002",
      title: "Stock count difference in Central DC",
      severity: "Medium",
      status: "review",
      owner: "Mia Chen",
      dueDate: "2026-05-06",
    },
    {
      id: "INV-ISS-1003",
      title: "Damaged item batch pending write-off",
      severity: "Medium",
      status: "in-progress",
      owner: "Leo Wong",
      dueDate: "2026-05-07",
    },
  ],
  timeline: [
    { title: { zh: "入库单已创建", en: "Inbound Created" }, timestamp: "2026-05-04 07:40", status: "closed" },
    { title: { zh: "调拨已完成", en: "Transfer Completed" }, timestamp: "2026-05-04 12:15", status: "active" },
    { title: { zh: "盘点差异已上报", en: "Count Variance Reported" }, timestamp: "2026-05-04 16:50", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "库存调整", en: "Stock Adjustment" },
      fields: [
        { key: "sku", label: { zh: "SKU", en: "SKU" }, type: "text", value: "SKU-1001", required: true },
        { key: "warehouse", label: { zh: "仓库", en: "Warehouse" }, type: "select", value: "Central DC", required: true },
        { key: "adjustQty", label: { zh: "调整数量", en: "Adjustment Qty" }, type: "number", value: "-4" },
      ],
    },
    {
      title: { zh: "调拨与说明", en: "Transfer & Notes" },
      fields: [
        { key: "transferPlan", label: { zh: "调拨计划", en: "Transfer Plan" }, type: "text", value: "West Branch -> Central DC" },
        { key: "effectiveDate", label: { zh: "生效时间", en: "Effective Date" }, type: "date", value: "2026-05-05" },
        { key: "evidence", label: { zh: "凭证", en: "Evidence" }, type: "upload", value: "Count sheet placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "正常", en: "Healthy" }, value: "132", tone: "success" },
    { label: { zh: "观察", en: "Watch" }, value: "24", tone: "warning" },
    { label: { zh: "低库存", en: "Low Stock" }, value: "12", tone: "danger" },
    { label: { zh: "在途", en: "Inbound" }, value: "8", tone: "info" },
  ],
  reportRows: [
    { warehouse: "Central DC", stockValue: "$92,400", riskSkus: "5", varianceRate: "1.2%" },
    { warehouse: "Transit Hub", stockValue: "$51,800", riskSkus: "3", varianceRate: "0.8%" },
    { warehouse: "Cold Room", stockValue: "$38,400", riskSkus: "4", varianceRate: "1.6%" },
  ],
  chartSeries: [
    { label: "Mon", value: 68 },
    { label: "Tue", value: 58 },
    { label: "Wed", value: 73 },
    { label: "Thu", value: 61 },
    { label: "Fri", value: 79 },
  ],
  ctaPlaceholders: [
    { zh: "调整库存", en: "Adjust Stock" },
    { zh: "发起调拨", en: "Transfer" },
    { zh: "导出", en: "Export" },
  ],
};
