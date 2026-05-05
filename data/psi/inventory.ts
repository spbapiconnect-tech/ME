import type { InventoryPageData } from "@/types/psi";

export const psiInventoryPageData: InventoryPageData = {
  skus: [
    { skuId: "SKU-1001", skuCode: "SKU-1001", productId: "PROD-1001", productName: "Fresh Milk 1L", unit: "pcs", safetyStock: 60, status: "active", sourceRef: { moduleCode: "inventory", recordId: "SKU-1001", recordType: "sku", route: "/psi/inventory/SKU-1001" }, audit: { createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" } },
    { skuId: "SKU-1002", skuCode: "SKU-1002", productId: "PROD-1002", productName: "Bakery Flour 2kg", unit: "bags", safetyStock: 24, status: "active", sourceRef: { moduleCode: "inventory", recordId: "SKU-1002", recordType: "sku", route: "/psi/inventory/SKU-1002" }, audit: { createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" } },
    { skuId: "SKU-1003", skuCode: "SKU-1003", productId: "PROD-1003", productName: "Mineral Water 550ml", unit: "bottles", safetyStock: 120, status: "active", sourceRef: { moduleCode: "inventory", recordId: "SKU-1003", recordType: "sku", route: "/psi/inventory/SKU-1003" }, audit: { createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" } },
    { skuId: "SKU-1004", skuCode: "SKU-1004", productId: "PROD-1004", productName: "Yogurt Cup", unit: "cups", safetyStock: 80, status: "review", sourceRef: { moduleCode: "inventory", recordId: "SKU-1004", recordType: "sku", route: "/psi/inventory/SKU-1004" }, audit: { createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-05-02T00:00:00Z" } },
    { skuId: "SKU-1005", skuCode: "SKU-1005", productId: "PROD-1005", productName: "Coffee Beans 1kg", unit: "bags", safetyStock: 20, status: "active", sourceRef: { moduleCode: "inventory", recordId: "SKU-1005", recordType: "sku", route: "/psi/inventory/SKU-1005" }, audit: { createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-05-02T00:00:00Z" } },
    { skuId: "SKU-1006", skuCode: "SKU-1006", productId: "PROD-1006", productName: "Frozen Fries 2.5kg", unit: "packs", safetyStock: 50, status: "pending", sourceRef: { moduleCode: "inventory", recordId: "SKU-1006", recordType: "sku", route: "/psi/inventory/SKU-1006" }, audit: { createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z" } },
    { skuId: "SKU-1007", skuCode: "SKU-1007", productId: "PROD-1007", productName: "Tomato Sauce 500g", unit: "jars", safetyStock: 36, status: "active", sourceRef: { moduleCode: "inventory", recordId: "SKU-1007", recordType: "sku", route: "/psi/inventory/SKU-1007" }, audit: { createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z" } },
    { skuId: "SKU-1008", skuCode: "SKU-1008", productId: "PROD-1008", productName: "Paper Cup 16oz", unit: "packs", safetyStock: 40, status: "blocked", sourceRef: { moduleCode: "inventory", recordId: "SKU-1008", recordType: "sku", route: "/psi/inventory/SKU-1008" }, audit: { createdAt: "2026-01-20T00:00:00Z", updatedAt: "2026-05-03T00:00:00Z" } },
  ],
  products: [
    { productId: "PROD-1001", name: "Fresh Milk", category: "Dairy", status: "active" },
    { productId: "PROD-1002", name: "Bakery Flour", category: "Baking", status: "active" },
    { productId: "PROD-1003", name: "Mineral Water", category: "Beverage", status: "active" },
    { productId: "PROD-1004", name: "Yogurt", category: "Dairy", status: "review" },
  ],
  warehouses: [
    { warehouseId: "WH-1001", warehouseCode: "WH-1001", name: "Central DC", type: "warehouse", status: "active" },
    { warehouseId: "WH-1002", warehouseCode: "WH-1002", name: "Cold Room", type: "warehouse", status: "active" },
    { warehouseId: "ST-001", warehouseCode: "ST-001", name: "Store East", type: "store", status: "active" },
    { warehouseId: "ST-002", warehouseCode: "ST-002", name: "Store West", type: "store", status: "review" },
  ],
  storeStocks: [
    { stockId: "STOCK-1001", skuId: "SKU-1001", warehouseId: "ST-001", availableQty: { value: 18, unit: "pcs" }, reservedQty: { value: 4, unit: "pcs" }, inboundQty: { value: 120, unit: "pcs" }, status: "active", sourceRef: { moduleCode: "inventory", recordId: "STOCK-1001", recordType: "stock" } },
    { stockId: "STOCK-1002", skuId: "SKU-1002", warehouseId: "ST-001", availableQty: { value: 35, unit: "bags" }, reservedQty: { value: 3, unit: "bags" }, inboundQty: { value: 40, unit: "bags" }, status: "active", sourceRef: { moduleCode: "inventory", recordId: "STOCK-1002", recordType: "stock" } },
    { stockId: "STOCK-1003", skuId: "SKU-1003", warehouseId: "ST-002", availableQty: { value: 90, unit: "bottles" }, reservedQty: { value: 10, unit: "bottles" }, inboundQty: { value: 200, unit: "bottles" }, status: "review", sourceRef: { moduleCode: "inventory", recordId: "STOCK-1003", recordType: "stock" } },
    { stockId: "STOCK-1004", skuId: "SKU-1004", warehouseId: "ST-002", availableQty: { value: 40, unit: "cups" }, reservedQty: { value: 2, unit: "cups" }, inboundQty: { value: 180, unit: "cups" }, status: "pending", sourceRef: { moduleCode: "inventory", recordId: "STOCK-1004", recordType: "stock" } },
    { stockId: "STOCK-1005", skuId: "SKU-1006", warehouseId: "WH-1001", availableQty: { value: 22, unit: "packs" }, reservedQty: { value: 5, unit: "packs" }, inboundQty: { value: 60, unit: "packs" }, status: "active", sourceRef: { moduleCode: "inventory", recordId: "STOCK-1005", recordType: "stock" } },
  ],
  stockMovements: [
    { movementId: "MOV-1001", skuId: "SKU-1001", warehouseId: "WH-1001", movementType: "inbound", quantity: { value: 120, unit: "pcs" }, movementAt: "2026-05-04T04:10:00Z", status: "completed", sourceRef: { moduleCode: "inventory", recordId: "MOV-1001", recordType: "stock-movement" } },
    { movementId: "MOV-1002", skuId: "SKU-1003", warehouseId: "WH-1001", movementType: "inbound", quantity: { value: 170, unit: "bottles" }, movementAt: "2026-05-05T08:20:00Z", status: "review", sourceRef: { moduleCode: "inventory", recordId: "MOV-1002", recordType: "stock-movement" } },
    { movementId: "MOV-1003", skuId: "SKU-1006", warehouseId: "ST-001", movementType: "transfer", quantity: { value: 20, unit: "packs" }, movementAt: "2026-05-05T09:40:00Z", status: "pending", sourceRef: { moduleCode: "inventory", recordId: "MOV-1003", recordType: "stock-movement" } },
  ],
  stockCounts: [
    { countId: "COUNT-1001", skuId: "SKU-1001", warehouseId: "ST-001", expectedQty: { value: 22, unit: "pcs" }, countedQty: { value: 18, unit: "pcs" }, varianceQty: { value: -4, unit: "pcs" }, status: "review", countedAt: "2026-05-04T10:00:00Z", sourceRef: { moduleCode: "inventory", recordId: "COUNT-1001", recordType: "stock-count" } },
    { countId: "COUNT-1002", skuId: "SKU-1003", warehouseId: "ST-002", expectedQty: { value: 110, unit: "bottles" }, countedQty: { value: 90, unit: "bottles" }, varianceQty: { value: -20, unit: "bottles" }, status: "active", countedAt: "2026-05-04T10:20:00Z", sourceRef: { moduleCode: "inventory", recordId: "COUNT-1002", recordType: "stock-count" } },
    { countId: "COUNT-1003", skuId: "SKU-1006", warehouseId: "WH-1001", expectedQty: { value: 25, unit: "packs" }, countedQty: { value: 22, unit: "packs" }, varianceQty: { value: -3, unit: "packs" }, status: "pending", countedAt: "2026-05-04T11:00:00Z", sourceRef: { moduleCode: "inventory", recordId: "COUNT-1003", recordType: "stock-count" } },
  ],
  issues: [
    { issueId: "INVISS-1001", skuId: "SKU-1001", title: { zh: "门店低库存", en: "Store low stock" }, status: "active", priority: "critical", sourceRef: { moduleCode: "inventory", recordId: "INVISS-1001", recordType: "inventory-issue" }, linkedTask: { taskId: "TASK-3001", title: { zh: "补货优先处理", en: "Prioritize replenishment" }, status: "active", sourceRef: { moduleCode: "task", recordId: "TASK-3001", recordType: "task" } }, openedAt: "2026-05-04T09:00:00Z" },
    { issueId: "INVISS-1002", skuId: "SKU-1003", title: { zh: "盘点差异", en: "Count variance" }, status: "review", priority: "high", sourceRef: { moduleCode: "inventory", recordId: "INVISS-1002", recordType: "inventory-issue" }, openedAt: "2026-05-04T10:30:00Z" },
    { issueId: "INVISS-1003", skuId: "SKU-1008", title: { zh: "商品阻塞", en: "SKU blocked" }, status: "blocked", priority: "medium", sourceRef: { moduleCode: "inventory", recordId: "INVISS-1003", recordType: "inventory-issue" }, openedAt: "2026-05-05T08:00:00Z" },
  ],
  replenishmentSuggestions: [
    { suggestionId: "RPL-1001", skuId: "SKU-1001", warehouseId: "ST-001", suggestedQty: { value: 140, unit: "pcs" }, reason: "Below safety stock with weekend peak", status: "pending", sourceRef: { moduleCode: "inventory", recordId: "RPL-1001", recordType: "replenishment" } },
    { suggestionId: "RPL-1002", skuId: "SKU-1003", warehouseId: "ST-002", suggestedQty: { value: 220, unit: "bottles" }, reason: "Count variance and outbound trend", status: "review", sourceRef: { moduleCode: "inventory", recordId: "RPL-1002", recordType: "replenishment" } },
    { suggestionId: "RPL-1003", skuId: "SKU-1006", warehouseId: "WH-1001", suggestedQty: { value: 90, unit: "packs" }, reason: "Frozen category campaign", status: "active", sourceRef: { moduleCode: "inventory", recordId: "RPL-1003", recordType: "replenishment" } },
  ],
  stats: {
    totalSkus: 8,
    lowStockSkus: 3,
    inboundPending: 3,
    issueOpenCount: 3,
    replenishmentPending: 3,
  },
};
