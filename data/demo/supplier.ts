import type { DemoModuleData } from "@/data/demo";

export const supplierDemoData: DemoModuleData = {
  moduleCode: "supplier",
  scenario: {
    zh: "围绕 SUP-1001 演示供应商档案、履约表现与价格风险。",
    en: "Centers on SUP-1001 to demonstrate supplier profile, delivery performance, and price risk.",
  },
  summary: {
    zh: "从供应商评分、合同到期到价格波动形成协同演示。",
    en: "Builds a collaboration demo around supplier ratings, contract timing, and price movement.",
  },
  kpis: [
    { label: { zh: "活跃供应商", en: "Active Suppliers" }, value: "42", trend: "+2", tone: "brand" },
    { label: { zh: "高评分供应商", en: "High Rating" }, value: "18", trend: "4.7 avg", tone: "success" },
    { label: { zh: "合同将到期", en: "Contract Expiring" }, value: "5", trend: "30 days", tone: "warning" },
    { label: { zh: "供应商问题", en: "Supplier Issues" }, value: "3", trend: "Watch", tone: "danger" },
  ],
  listingRows: [
    {
      supplierCode: "SUP-1001",
      supplier: "Northwind Supply Co.",
      category: "Fresh Food / Dairy",
      status: "preferred",
      owner: "Leo Wong",
      createdAt: "2026-03-12",
    },
    {
      supplierCode: "SUP-1002",
      supplier: "BlueRiver Trading",
      category: "Bakery Ingredients",
      status: "review",
      owner: "Mia Chen",
      createdAt: "2026-02-20",
    },
    {
      supplierCode: "SUP-1003",
      supplier: "Prime Sourcing Group",
      category: "Dry Goods",
      status: "watch",
      owner: "Avery Lin",
      createdAt: "2026-01-28",
    },
  ],
  detailRecord: {
    supplierCode: "SUP-1001",
    supplier: "Northwind Supply Co.",
    category: "Fresh Food / Dairy",
    serviceRegion: "East China",
    accountOwner: "Leo Wong",
    leadTime: "2 days",
    rating: "4.8 / 5",
    contractExpiry: "2026-06-01",
    priceTrend: "+2.4% vs last month",
    status: "Preferred",
  },
  detailSections: [
    {
      title: { zh: "档案信息", en: "Profile" },
      rows: [
        { label: "Code", value: "SUP-1001" },
        { label: "Supplier", value: "Northwind Supply Co." },
        { label: "Category", value: "Fresh Food / Dairy" },
        { label: "Region", value: "East China" },
      ],
    },
    {
      title: { zh: "协作状态", en: "Collaboration Health" },
      rows: [
        { label: "Owner", value: "Leo Wong" },
        { label: "Lead Time", value: "2 days" },
        { label: "Rating", value: "4.8 / 5" },
        { label: "Contract Expiry", value: "2026-06-01" },
      ],
    },
  ],
  issues: [
    {
      id: "SUP-ISS-1001",
      title: "Late delivery on chilled items",
      severity: "High",
      status: "open",
      owner: "Leo Wong",
      dueDate: "2026-05-05",
    },
    {
      id: "SUP-ISS-1002",
      title: "Quality complaint for bakery flour",
      severity: "Medium",
      status: "review",
      owner: "Mia Chen",
      dueDate: "2026-05-06",
    },
    {
      id: "SUP-ISS-1003",
      title: "Price change pending confirmation",
      severity: "Medium",
      status: "in-progress",
      owner: "Avery Lin",
      dueDate: "2026-05-07",
    },
  ],
  timeline: [
    { title: { zh: "报价已更新", en: "Quotation Updated" }, timestamp: "2026-05-03 11:20", status: "closed" },
    { title: { zh: "合同已复核", en: "Contract Reviewed" }, timestamp: "2026-05-03 16:40", status: "active" },
    { title: { zh: "评分已调整", en: "Rating Changed" }, timestamp: "2026-05-04 09:05", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "供应商资料", en: "Supplier Profile" },
      fields: [
        { key: "supplierCode", label: { zh: "供应商编码", en: "Supplier Code" }, type: "text", value: "SUP-1001", required: true },
        { key: "supplier", label: { zh: "供应商名称", en: "Supplier Name" }, type: "text", value: "Northwind Supply Co.", required: true },
        { key: "category", label: { zh: "品类", en: "Category" }, type: "select", value: "Fresh Food / Dairy" },
      ],
    },
    {
      title: { zh: "合同与评分", en: "Contract & Rating" },
      fields: [
        { key: "contractExpiry", label: { zh: "合同到期", en: "Contract Expiry" }, type: "date", value: "2026-06-01" },
        { key: "rating", label: { zh: "评分", en: "Rating" }, type: "number", value: "4.8 / 5" },
        { key: "attachment", label: { zh: "合同附件", en: "Contract Attachment" }, type: "upload", value: "Contract PDF placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "优选", en: "Preferred" }, value: "18", tone: "success" },
    { label: { zh: "观察", en: "Watch" }, value: "7", tone: "warning" },
    { label: { zh: "复核中", en: "Under Review" }, value: "5", tone: "brand" },
    { label: { zh: "问题", en: "Issues" }, value: "3", tone: "danger" },
  ],
  reportRows: [
    { segment: "Fresh Food", onTime: "96%", rating: "4.8", priceTrend: "+2.4%" },
    { segment: "Bakery", onTime: "92%", rating: "4.5", priceTrend: "+1.2%" },
    { segment: "Dry Goods", onTime: "94%", rating: "4.6", priceTrend: "0.0%" },
  ],
  chartSeries: [
    { label: "Jan", value: 76 },
    { label: "Feb", value: 81 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 89 },
    { label: "May", value: 83 },
  ],
  ctaPlaceholders: [
    { zh: "新增供应商", en: "Add Supplier" },
    { zh: "复核", en: "Review" },
    { zh: "导出", en: "Export" },
  ],
};
