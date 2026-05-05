import type { LocalizedText } from "@/types/module";

import type {
  PsiAuditPlaceholder,
  PsiIssueSummary,
  PsiLinkedTaskPlaceholder,
  PsiMoney,
  PsiPriority,
  PsiQuantity,
  PsiRecordStatus,
  PsiSourceRef,
} from "./shared";

export interface PurchaseRequestLineDto {
  lineId: string;
  skuId: string;
  productName: string;
  requestedQty: PsiQuantity;
  expectedUnitPrice: PsiMoney;
  lineTotal: PsiMoney;
  note?: string;
}

export interface PurchaseRequestDto {
  requestId: string;
  requestNo: string;
  storeId: string;
  supplierId?: string;
  status: PsiRecordStatus;
  priority: PsiPriority;
  requestDate: string;
  neededBy?: string;
  lines: PurchaseRequestLineDto[];
  totalAmount: PsiMoney;
  sourceRef: PsiSourceRef;
  audit: PsiAuditPlaceholder;
  linkedTasks?: PsiLinkedTaskPlaceholder[];
  issues?: PsiIssueSummary[];
}

export interface PurchaseOrderLineDto {
  lineId: string;
  requestLineId?: string;
  skuId: string;
  productName: string;
  orderedQty: PsiQuantity;
  unitPrice: PsiMoney;
  lineTotal: PsiMoney;
}

export interface PurchaseOrderDto {
  orderId: string;
  orderNo: string;
  requestId?: string;
  supplierId: string;
  status: PsiRecordStatus;
  priority: PsiPriority;
  orderDate: string;
  expectedReceivingDate?: string;
  lines: PurchaseOrderLineDto[];
  totalAmount: PsiMoney;
  sourceRef: PsiSourceRef;
  audit: PsiAuditPlaceholder;
}

export interface ReceivingLineDto {
  lineId: string;
  poLineId: string;
  skuId: string;
  receivedQty: PsiQuantity;
  acceptedQty: PsiQuantity;
  disputedQty?: PsiQuantity;
}

export interface ReceivingDto {
  receivingId: string;
  receivingNo: string;
  orderId: string;
  supplierId: string;
  warehouseId: string;
  status: PsiRecordStatus;
  receivedAt: string;
  lines: ReceivingLineDto[];
  sourceRef: PsiSourceRef;
  audit: PsiAuditPlaceholder;
  issues?: PsiIssueSummary[];
}

export interface PurchaseIssueDto {
  issueId: string;
  title: LocalizedText;
  status: PsiRecordStatus;
  priority: PsiPriority;
  issueType: "delivery" | "price" | "quality" | "receiving" | "document" | "other";
  requestId?: string;
  orderId?: string;
  receivingId?: string;
  supplierId?: string;
  sourceRef: PsiSourceRef;
  linkedTask?: PsiLinkedTaskPlaceholder;
  openedAt: string;
}

export interface ProcurementStatsDto {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalOrders: number;
  receivingToday: number;
  issueOpenCount: number;
  totalAmount: PsiMoney;
}

export interface ProcurementPageData {
  purchaseRequests: PurchaseRequestDto[];
  purchaseOrders: PurchaseOrderDto[];
  receivingRecords: ReceivingDto[];
  purchaseIssues: PurchaseIssueDto[];
  stats: ProcurementStatsDto;
}
