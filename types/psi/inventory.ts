import type { LocalizedText } from "@/types/module";

import type {
  PsiAuditPlaceholder,
  PsiLinkedTaskPlaceholder,
  PsiPriority,
  PsiQuantity,
  PsiRecordStatus,
  PsiSourceRef,
} from "./shared";

export interface ProductDto {
  productId: string;
  name: string;
  category: string;
  status: PsiRecordStatus;
}

export interface SkuDto {
  skuId: string;
  skuCode: string;
  productId: string;
  productName: string;
  unit: string;
  safetyStock: number;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
  audit: PsiAuditPlaceholder;
}

export interface WarehouseDto {
  warehouseId: string;
  warehouseCode: string;
  name: string;
  type: "warehouse" | "store";
  status: PsiRecordStatus;
}

export interface StoreStockDto {
  stockId: string;
  skuId: string;
  warehouseId: string;
  availableQty: PsiQuantity;
  reservedQty: PsiQuantity;
  inboundQty: PsiQuantity;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
}

export interface StockMovementPlaceholderDto {
  movementId: string;
  skuId: string;
  warehouseId: string;
  movementType: "inbound" | "outbound" | "transfer" | "adjustment";
  quantity: PsiQuantity;
  movementAt: string;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
}

export interface StockCountPlaceholderDto {
  countId: string;
  skuId: string;
  warehouseId: string;
  expectedQty: PsiQuantity;
  countedQty: PsiQuantity;
  varianceQty: PsiQuantity;
  status: PsiRecordStatus;
  countedAt: string;
  sourceRef: PsiSourceRef;
}

export interface InventoryIssueDto {
  issueId: string;
  skuId: string;
  title: LocalizedText;
  status: PsiRecordStatus;
  priority: PsiPriority;
  sourceRef: PsiSourceRef;
  linkedTask?: PsiLinkedTaskPlaceholder;
  openedAt: string;
}

export interface ReplenishmentSuggestionDto {
  suggestionId: string;
  skuId: string;
  warehouseId: string;
  suggestedQty: PsiQuantity;
  reason: string;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
}

export interface InventoryStatsDto {
  totalSkus: number;
  lowStockSkus: number;
  inboundPending: number;
  issueOpenCount: number;
  replenishmentPending: number;
}

export interface InventoryPageData {
  skus: SkuDto[];
  products: ProductDto[];
  warehouses: WarehouseDto[];
  storeStocks: StoreStockDto[];
  stockMovements: StockMovementPlaceholderDto[];
  stockCounts: StockCountPlaceholderDto[];
  issues: InventoryIssueDto[];
  replenishmentSuggestions: ReplenishmentSuggestionDto[];
  stats: InventoryStatsDto;
}
