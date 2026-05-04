import type { DemoModuleData } from "@/data/demo";

export const posReportDemoData: DemoModuleData = {
  moduleCode: "pos-report",
  scenario: {
    zh: "通过 POS-1001 与 TXN-1001 演示销售趋势、退款预警与补货信号。",
    en: "Uses POS-1001 and TXN-1001 to demonstrate sales trends, refund alerts, and reorder signals.",
  },
  summary: {
    zh: "把门店销售表现直接连接到库存与采购演示流程。",
    en: "Connects store sales performance directly into the inventory and procurement demo flow.",
  },
  kpis: [
    { label: { zh: "今日销售额", en: "Sales Today" }, value: "$26,840", trend: "+9.4%", tone: "success" },
    { label: { zh: "交易数", en: "Transactions" }, value: "1,284", trend: "+86", tone: "brand" },
    { label: { zh: "退款预警", en: "Refund Alerts" }, value: "4", trend: "2 urgent", tone: "warning" },
    { label: { zh: "补货信号", en: "Reorder Signals" }, value: "7", trend: "SKU-1001", tone: "danger" },
  ],
  listingRows: [
    {
      reportDate: "2026-05-04",
      branch: "Central Flagship",
      salesAmount: "$26,840",
      transactions: "1,284",
      status: "reorder-signal",
    },
    {
      reportDate: "2026-05-03",
      branch: "North Branch",
      salesAmount: "$21,460",
      transactions: "1,102",
      status: "refund-watch",
    },
    {
      reportDate: "2026-05-02",
      branch: "West Branch",
      salesAmount: "$19,980",
      transactions: "986",
      status: "active",
    },
  ],
  detailRecord: {
    salesId: "TXN-1001",
    branch: "Central Flagship",
    cashier: "Amy Zhao",
    transactionCount: "42",
    refundRate: "6.8%",
    voidRate: "3.1%",
    topSku: "SKU-1001",
    reorderSignal: "Triggered",
    syncedAt: "2026-05-04 18:35",
    status: "Refund Watch",
  },
  detailSections: [
    {
      title: { zh: "交易概览", en: "Transaction Overview" },
      rows: [
        { label: "ID", value: "TXN-1001" },
        { label: "Branch", value: "Central Flagship" },
        { label: "Cashier", value: "Amy Zhao" },
        { label: "Transactions", value: "42" },
      ],
    },
    {
      title: { zh: "风险信号", en: "Risk Signals" },
      rows: [
        { label: "Refund Rate", value: "6.8%" },
        { label: "Void Rate", value: "3.1%" },
        { label: "Top SKU", value: "SKU-1001" },
        { label: "Reorder Signal", value: "Triggered" },
      ],
    },
  ],
  issues: [
    {
      id: "POS-ISS-1001",
      title: "Abnormal refund spike in TXN-1001",
      severity: "High",
      status: "open",
      owner: "Nina Xu",
      dueDate: "2026-05-05",
    },
    {
      id: "POS-ISS-1002",
      title: "High void rate during evening shift",
      severity: "Medium",
      status: "review",
      owner: "Ray Chen",
      dueDate: "2026-05-06",
    },
    {
      id: "POS-ISS-1003",
      title: "Fast moving low stock item needs reorder",
      severity: "High",
      status: "in-progress",
      owner: "Mia Chen",
      dueDate: "2026-05-05",
    },
  ],
  timeline: [
    { title: { zh: "销售数据已同步", en: "Sales Synced" }, timestamp: "2026-05-04 18:35", status: "closed" },
    { title: { zh: "退款预警已标记", en: "Refund Flagged" }, timestamp: "2026-05-04 18:40", status: "active" },
    { title: { zh: "补货信号已创建", en: "Reorder Signal Created" }, timestamp: "2026-05-04 18:42", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "报表查询", en: "Report Query" },
      fields: [
        { key: "branch", label: { zh: "门店", en: "Branch" }, type: "select", value: "Central Flagship", required: true },
        { key: "dateRange", label: { zh: "日期范围", en: "Date Range" }, type: "date-range", value: "2026-05-01 ~ 2026-05-04" },
        { key: "metric", label: { zh: "分析维度", en: "Metric" }, type: "select", value: "Sales / Refund" },
      ],
    },
    {
      title: { zh: "审计备注", en: "Audit Notes" },
      fields: [
        { key: "owner", label: { zh: "审计人", en: "Audit Owner" }, type: "user", value: "Nina Xu" },
        { key: "note", label: { zh: "说明", en: "Note" }, type: "textarea", value: "Refund spike review placeholder" },
        { key: "attachment", label: { zh: "导出附件", en: "Export Attachment" }, type: "upload", value: "Report export placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "正常销售", en: "Healthy Sales" }, value: "24", tone: "success" },
    { label: { zh: "退款关注", en: "Refund Watch" }, value: "4", tone: "warning" },
    { label: { zh: "补货信号", en: "Reorder" }, value: "7", tone: "danger" },
    { label: { zh: "审计中", en: "Under Audit" }, value: "3", tone: "brand" },
  ],
  reportRows: [
    { bucket: "Fresh Food", sales: "$10,420", transactions: "412", refundRate: "1.8%" },
    { bucket: "Bakery", sales: "$6,180", transactions: "298", refundRate: "2.4%" },
    { bucket: "Beverage", sales: "$5,940", transactions: "326", refundRate: "1.2%" },
  ],
  chartSeries: [
    { label: "10:00", value: 24 },
    { label: "12:00", value: 52 },
    { label: "14:00", value: 76 },
    { label: "16:00", value: 68 },
    { label: "18:00", value: 88 },
  ],
  ctaPlaceholders: [
    { zh: "查看报表", en: "View Report" },
    { zh: "审计", en: "Audit" },
    { zh: "导出", en: "Export" },
  ],
};
