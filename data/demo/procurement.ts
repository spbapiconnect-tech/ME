import type { DemoModuleData } from "@/data/demo";

export const procurementDemoData: DemoModuleData = {
  moduleCode: "procurement",
  scenario: {
    zh: "以低库存补货场景演示采购申请、审批与到货跟踪。",
    en: "Demonstrates purchase request, approval, and receiving follow-up for a low-stock replenishment scenario.",
  },
  summary: {
    zh: "展示采购需求从 PR-1001 到 PO-1001 的演示流转。",
    en: "Shows a demo procurement flow from PR-1001 to PO-1001.",
  },
  kpis: [
    { label: { zh: "待处理申请", en: "Pending Requests" }, value: "18", trend: "+3", tone: "brand" },
    { label: { zh: "待审批", en: "Awaiting Approval" }, value: "6", trend: "SLA 4h", tone: "warning" },
    { label: { zh: "今日收货", en: "Receiving Today" }, value: "4", trend: "2 urgent", tone: "info" },
    { label: { zh: "采购问题", en: "Purchase Issues" }, value: "3", trend: "Watch", tone: "danger" },
  ],
  listingRows: [
    {
      requestNo: "PR-1001",
      supplier: "Northwind Supply Co.",
      totalAmount: "$4,860",
      status: "pending",
      owner: "Mia Chen",
      createdAt: "2026-05-04 08:30",
    },
    {
      requestNo: "PR-1002",
      supplier: "BlueRiver Trading",
      totalAmount: "$2,340",
      status: "active",
      owner: "Leo Wong",
      createdAt: "2026-05-04 09:45",
    },
    {
      requestNo: "PR-1003",
      supplier: "Prime Sourcing Group",
      totalAmount: "$1,980",
      status: "review",
      owner: "Avery Lin",
      createdAt: "2026-05-03 17:10",
    },
  ],
  detailRecord: {
    orderNo: "PO-1001",
    requestNo: "PR-1001",
    supplier: "Northwind Supply Co.",
    branch: "Central Flagship",
    requestedBy: "Mia Chen",
    approvalOwner: "Jason Wu",
    receivingWindow: "2026-05-05 14:00",
    paymentTerm: "Net 30",
    totalAmount: "$4,860",
    status: "Receiving Pending",
  },
  detailSections: [
    {
      title: { zh: "单据概览", en: "Order Overview" },
      rows: [
        { label: "PO", value: "PO-1001" },
        { label: "PR", value: "PR-1001" },
        { label: "Supplier", value: "Northwind Supply Co." },
        { label: "Branch", value: "Central Flagship" },
      ],
    },
    {
      title: { zh: "执行信息", en: "Execution Context" },
      rows: [
        { label: "Requested By", value: "Mia Chen" },
        { label: "Approver", value: "Jason Wu" },
        { label: "Receiving Window", value: "2026-05-05 14:00" },
        { label: "Total", value: "$4,860" },
      ],
    },
  ],
  issues: [
    {
      id: "PROC-ISS-1001",
      title: "Late delivery for PO-1001",
      severity: "High",
      status: "open",
      owner: "Leo Wong",
      dueDate: "2026-05-05",
    },
    {
      id: "PROC-ISS-1002",
      title: "Quantity mismatch on chilled milk cartons",
      severity: "Medium",
      status: "in-progress",
      owner: "Ivy Tan",
      dueDate: "2026-05-06",
    },
    {
      id: "PROC-ISS-1003",
      title: "Price variance vs last quotation",
      severity: "Medium",
      status: "review",
      owner: "Mia Chen",
      dueDate: "2026-05-07",
    },
  ],
  timeline: [
    { title: { zh: "申请已创建", en: "Request Created" }, timestamp: "2026-05-04 08:30", status: "active" },
    { title: { zh: "主管已审批", en: "Approved" }, timestamp: "2026-05-04 10:10", status: "closed" },
    { title: { zh: "采购单已生成", en: "PO Generated" }, timestamp: "2026-05-04 10:32", status: "closed" },
    { title: { zh: "待收货确认", en: "Receiving Pending" }, timestamp: "2026-05-05 14:00", status: "pending" },
  ],
  formPlaceholders: [
    {
      title: { zh: "申请信息", en: "Request Information" },
      description: { zh: "采购申请表单占位。", en: "Purchase request form placeholder." },
      fields: [
        { key: "requestNo", label: { zh: "申请单号", en: "Request No" }, type: "text", value: "PR-1001", required: true },
        { key: "supplier", label: { zh: "供应商", en: "Supplier" }, type: "select", value: "Northwind Supply Co.", required: true },
        { key: "totalAmount", label: { zh: "预计金额", en: "Expected Amount" }, type: "currency", value: "$4,860" },
      ],
    },
    {
      title: { zh: "审批与收货", en: "Approval & Receiving" },
      fields: [
        { key: "approvalOwner", label: { zh: "审批人", en: "Approval Owner" }, type: "user", value: "Jason Wu" },
        { key: "receivingWindow", label: { zh: "收货时间", en: "Receiving Window" }, type: "date", value: "2026-05-05 14:00" },
        { key: "attachment", label: { zh: "附件", en: "Attachment" }, type: "upload", value: "Quotation PDF placeholder" },
      ],
    },
  ],
  statusDistribution: [
    { label: { zh: "待审批", en: "Pending" }, value: "6", tone: "warning" },
    { label: { zh: "处理中", en: "In Progress" }, value: "9", tone: "brand" },
    { label: { zh: "待收货", en: "Receiving" }, value: "4", tone: "info" },
    { label: { zh: "异常", en: "Issues" }, value: "3", tone: "danger" },
  ],
  reportRows: [
    { bucket: "Fresh Food", amount: "$2,120", requests: "5", variance: "+4.2%" },
    { bucket: "Bakery", amount: "$1,160", requests: "3", variance: "+1.8%" },
    { bucket: "Beverage", amount: "$1,580", requests: "4", variance: "-0.6%" },
  ],
  chartSeries: [
    { label: "Mon", value: 48 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 54 },
    { label: "Thu", value: 71 },
    { label: "Fri", value: 66 },
  ],
  ctaPlaceholders: [
    { zh: "新建申请", en: "Create Request" },
    { zh: "审批", en: "Approve" },
    { zh: "导出", en: "Export" },
  ],
};
