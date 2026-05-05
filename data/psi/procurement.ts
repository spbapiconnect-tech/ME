import type { ProcurementPageData } from "@/types/psi";

const CNY = "CNY";

export const psiProcurementPageData: ProcurementPageData = {
  purchaseRequests: [
    {
      requestId: "PR-1001",
      requestNo: "PR-1001",
      storeId: "ST-001",
      supplierId: "SUP-1001",
      status: "pending",
      priority: "high",
      requestDate: "2026-05-01",
      neededBy: "2026-05-05",
      lines: [
        { lineId: "PR-1001-L1", skuId: "SKU-1001", productName: "Fresh Milk 1L", requestedQty: { value: 120, unit: "pcs" }, expectedUnitPrice: { amount: 7.2, currency: CNY }, lineTotal: { amount: 864, currency: CNY } },
        { lineId: "PR-1001-L2", skuId: "SKU-1002", productName: "Bakery Flour 2kg", requestedQty: { value: 40, unit: "bags" }, expectedUnitPrice: { amount: 18, currency: CNY }, lineTotal: { amount: 720, currency: CNY } },
      ],
      totalAmount: { amount: 1584, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PR-1001", recordType: "purchase-request", route: "/psi/procurement/PR-1001" },
      audit: { createdAt: "2026-05-01T08:00:00Z", updatedAt: "2026-05-01T08:30:00Z", createdBy: "Mia Chen" },
      linkedTasks: [{ taskId: "TASK-1001", title: { zh: "跟进低库存采购申请", en: "Follow low stock purchase request" }, status: "active", sourceRef: { moduleCode: "task", recordId: "TASK-1001", recordType: "task" } }],
    },
    {
      requestId: "PR-1002", requestNo: "PR-1002", storeId: "ST-002", supplierId: "SUP-1002", status: "review", priority: "medium", requestDate: "2026-05-01", neededBy: "2026-05-06",
      lines: [{ lineId: "PR-1002-L1", skuId: "SKU-1003", productName: "Mineral Water 550ml", requestedQty: { value: 200, unit: "bottles" }, expectedUnitPrice: { amount: 2.5, currency: CNY }, lineTotal: { amount: 500, currency: CNY } }],
      totalAmount: { amount: 500, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PR-1002", recordType: "purchase-request", route: "/psi/procurement/PR-1002" },
      audit: { createdAt: "2026-05-01T09:00:00Z", updatedAt: "2026-05-01T10:00:00Z", createdBy: "Leo Wong" },
    },
    {
      requestId: "PR-1003", requestNo: "PR-1003", storeId: "ST-003", supplierId: "SUP-1003", status: "approved", priority: "medium", requestDate: "2026-05-02", neededBy: "2026-05-07",
      lines: [{ lineId: "PR-1003-L1", skuId: "SKU-1004", productName: "Yogurt Cup", requestedQty: { value: 180, unit: "cups" }, expectedUnitPrice: { amount: 4.2, currency: CNY }, lineTotal: { amount: 756, currency: CNY } }],
      totalAmount: { amount: 756, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PR-1003", recordType: "purchase-request", route: "/psi/procurement/PR-1003" },
      audit: { createdAt: "2026-05-02T03:00:00Z", updatedAt: "2026-05-02T06:20:00Z", createdBy: "Avery Lin" },
    },
    {
      requestId: "PR-1004", requestNo: "PR-1004", storeId: "ST-001", supplierId: "SUP-1004", status: "rejected", priority: "low", requestDate: "2026-05-03", neededBy: "2026-05-08",
      lines: [{ lineId: "PR-1004-L1", skuId: "SKU-1005", productName: "Coffee Beans 1kg", requestedQty: { value: 20, unit: "bags" }, expectedUnitPrice: { amount: 92, currency: CNY }, lineTotal: { amount: 1840, currency: CNY } }],
      totalAmount: { amount: 1840, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PR-1004", recordType: "purchase-request", route: "/psi/procurement/PR-1004" },
      audit: { createdAt: "2026-05-03T07:00:00Z", updatedAt: "2026-05-03T09:40:00Z", createdBy: "Mia Chen" },
    },
    {
      requestId: "PR-1005", requestNo: "PR-1005", storeId: "ST-004", supplierId: "SUP-1005", status: "draft", priority: "critical", requestDate: "2026-05-03", neededBy: "2026-05-04",
      lines: [{ lineId: "PR-1005-L1", skuId: "SKU-1006", productName: "Frozen Fries 2.5kg", requestedQty: { value: 60, unit: "packs" }, expectedUnitPrice: { amount: 26, currency: CNY }, lineTotal: { amount: 1560, currency: CNY } }],
      totalAmount: { amount: 1560, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PR-1005", recordType: "purchase-request", route: "/psi/procurement/PR-1005" },
      audit: { createdAt: "2026-05-03T11:00:00Z", updatedAt: "2026-05-03T11:00:00Z", createdBy: "Store Manager" },
    },
  ],
  purchaseOrders: [
    {
      orderId: "PO-1001", orderNo: "PO-1001", requestId: "PR-1001", supplierId: "SUP-1001", status: "approved", priority: "high", orderDate: "2026-05-01", expectedReceivingDate: "2026-05-04",
      lines: [
        { lineId: "PO-1001-L1", requestLineId: "PR-1001-L1", skuId: "SKU-1001", productName: "Fresh Milk 1L", orderedQty: { value: 120, unit: "pcs" }, unitPrice: { amount: 7.1, currency: CNY }, lineTotal: { amount: 852, currency: CNY } },
        { lineId: "PO-1001-L2", requestLineId: "PR-1001-L2", skuId: "SKU-1002", productName: "Bakery Flour 2kg", orderedQty: { value: 40, unit: "bags" }, unitPrice: { amount: 17.8, currency: CNY }, lineTotal: { amount: 712, currency: CNY } },
      ],
      totalAmount: { amount: 1564, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PO-1001", recordType: "purchase-order", route: "/psi/procurement/PO-1001" },
      audit: { createdAt: "2026-05-01T12:00:00Z", updatedAt: "2026-05-01T14:00:00Z", createdBy: "Purchasing Manager" },
    },
    {
      orderId: "PO-1002", orderNo: "PO-1002", requestId: "PR-1003", supplierId: "SUP-1003", status: "pending", priority: "medium", orderDate: "2026-05-02", expectedReceivingDate: "2026-05-06",
      lines: [{ lineId: "PO-1002-L1", requestLineId: "PR-1003-L1", skuId: "SKU-1004", productName: "Yogurt Cup", orderedQty: { value: 180, unit: "cups" }, unitPrice: { amount: 4.1, currency: CNY }, lineTotal: { amount: 738, currency: CNY } }],
      totalAmount: { amount: 738, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PO-1002", recordType: "purchase-order", route: "/psi/procurement/PO-1002" },
      audit: { createdAt: "2026-05-02T08:00:00Z", updatedAt: "2026-05-02T09:00:00Z", createdBy: "Purchasing Manager" },
    },
    {
      orderId: "PO-1003", orderNo: "PO-1003", requestId: "PR-1002", supplierId: "SUP-1002", status: "completed", priority: "medium", orderDate: "2026-05-02", expectedReceivingDate: "2026-05-05",
      lines: [{ lineId: "PO-1003-L1", requestLineId: "PR-1002-L1", skuId: "SKU-1003", productName: "Mineral Water 550ml", orderedQty: { value: 200, unit: "bottles" }, unitPrice: { amount: 2.4, currency: CNY }, lineTotal: { amount: 480, currency: CNY } }],
      totalAmount: { amount: 480, currency: CNY },
      sourceRef: { moduleCode: "procurement", recordId: "PO-1003", recordType: "purchase-order", route: "/psi/procurement/PO-1003" },
      audit: { createdAt: "2026-05-02T10:00:00Z", updatedAt: "2026-05-05T08:00:00Z", createdBy: "Purchasing Manager" },
    },
  ],
  receivingRecords: [
    {
      receivingId: "RCV-1001", receivingNo: "RCV-1001", orderId: "PO-1001", supplierId: "SUP-1001", warehouseId: "WH-1001", status: "completed", receivedAt: "2026-05-04T04:00:00Z",
      lines: [
        { lineId: "RCV-1001-L1", poLineId: "PO-1001-L1", skuId: "SKU-1001", receivedQty: { value: 120, unit: "pcs" }, acceptedQty: { value: 118, unit: "pcs" }, disputedQty: { value: 2, unit: "pcs" } },
        { lineId: "RCV-1001-L2", poLineId: "PO-1001-L2", skuId: "SKU-1002", receivedQty: { value: 40, unit: "bags" }, acceptedQty: { value: 40, unit: "bags" } },
      ],
      sourceRef: { moduleCode: "procurement", recordId: "RCV-1001", recordType: "receiving", route: "/psi/procurement/RCV-1001" },
      audit: { createdAt: "2026-05-04T04:00:00Z", updatedAt: "2026-05-04T05:00:00Z" },
    },
    {
      receivingId: "RCV-1002", receivingNo: "RCV-1002", orderId: "PO-1002", supplierId: "SUP-1003", warehouseId: "WH-1002", status: "pending", receivedAt: "2026-05-06T03:00:00Z",
      lines: [{ lineId: "RCV-1002-L1", poLineId: "PO-1002-L1", skuId: "SKU-1004", receivedQty: { value: 0, unit: "cups" }, acceptedQty: { value: 0, unit: "cups" } }],
      sourceRef: { moduleCode: "procurement", recordId: "RCV-1002", recordType: "receiving", route: "/psi/procurement/RCV-1002" },
      audit: { createdAt: "2026-05-05T09:00:00Z", updatedAt: "2026-05-05T09:00:00Z" },
    },
    {
      receivingId: "RCV-1003", receivingNo: "RCV-1003", orderId: "PO-1003", supplierId: "SUP-1002", warehouseId: "WH-1001", status: "disputed", receivedAt: "2026-05-05T08:00:00Z",
      lines: [{ lineId: "RCV-1003-L1", poLineId: "PO-1003-L1", skuId: "SKU-1003", receivedQty: { value: 180, unit: "bottles" }, acceptedQty: { value: 170, unit: "bottles" }, disputedQty: { value: 10, unit: "bottles" } }],
      sourceRef: { moduleCode: "procurement", recordId: "RCV-1003", recordType: "receiving", route: "/psi/procurement/RCV-1003" },
      audit: { createdAt: "2026-05-05T08:00:00Z", updatedAt: "2026-05-05T10:30:00Z" },
    },
  ],
  purchaseIssues: [
    { issueId: "PI-1001", title: { zh: "到货数量差异", en: "Receiving quantity mismatch" }, status: "review", priority: "high", issueType: "receiving", orderId: "PO-1001", receivingId: "RCV-1001", supplierId: "SUP-1001", sourceRef: { moduleCode: "procurement", recordId: "PI-1001", recordType: "purchase-issue" }, linkedTask: { taskId: "TASK-1002", title: { zh: "复核牛奶差异", en: "Review milk variance" }, status: "active", sourceRef: { moduleCode: "task", recordId: "TASK-1002", recordType: "task" } }, openedAt: "2026-05-04T05:10:00Z" },
    { issueId: "PI-1002", title: { zh: "供应商延迟发货", en: "Supplier late dispatch" }, status: "pending", priority: "critical", issueType: "delivery", orderId: "PO-1002", supplierId: "SUP-1003", sourceRef: { moduleCode: "procurement", recordId: "PI-1002", recordType: "purchase-issue" }, openedAt: "2026-05-05T09:30:00Z" },
    { issueId: "PI-1003", title: { zh: "价格偏差待确认", en: "Price variance pending" }, status: "active", priority: "medium", issueType: "price", requestId: "PR-1004", supplierId: "SUP-1004", sourceRef: { moduleCode: "procurement", recordId: "PI-1003", recordType: "purchase-issue" }, openedAt: "2026-05-03T10:00:00Z" },
  ],
  stats: {
    totalRequests: 5,
    pendingRequests: 1,
    approvedRequests: 1,
    totalOrders: 3,
    receivingToday: 1,
    issueOpenCount: 3,
    totalAmount: { amount: 6240, currency: CNY },
  },
};
