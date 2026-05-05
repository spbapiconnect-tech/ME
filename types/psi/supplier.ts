import type { LocalizedText } from "@/types/module";

import type {
  PsiAuditPlaceholder,
  PsiLinkedTaskPlaceholder,
  PsiMoney,
  PsiPriority,
  PsiRecordStatus,
  PsiSourceRef,
} from "./shared";

export interface SupplierContactDto {
  contactId: string;
  supplierId: string;
  name: string;
  phone?: string;
  email?: string;
  role?: string;
  status: PsiRecordStatus;
}

export interface SupplierProductDto {
  productLinkId: string;
  supplierId: string;
  skuId: string;
  productName: string;
  moq: number;
  leadTimeDays: number;
  quotedPrice?: PsiMoney;
  status: PsiRecordStatus;
}

export interface SupplierQuotationDto {
  quotationId: string;
  supplierId: string;
  skuId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  unitPrice: PsiMoney;
  status: PsiRecordStatus;
  sourceRef: PsiSourceRef;
}

export interface SupplierContractPlaceholderDto {
  contractId: string;
  supplierId: string;
  contractNo: string;
  status: PsiRecordStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceRef: PsiSourceRef;
}

export interface SupplierRatingDto {
  ratingId: string;
  supplierId: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  period: string;
  status: PsiRecordStatus;
}

export interface SupplierIssueDto {
  issueId: string;
  supplierId: string;
  title: LocalizedText;
  status: PsiRecordStatus;
  priority: PsiPriority;
  sourceRef: PsiSourceRef;
  linkedTask?: PsiLinkedTaskPlaceholder;
  openedAt: string;
}

export interface SupplierDto {
  supplierId: string;
  supplierCode: string;
  name: string;
  category: string;
  status: PsiRecordStatus;
  serviceRegion: string;
  leadTimeDays: number;
  sourceRef: PsiSourceRef;
  audit: PsiAuditPlaceholder;
}

export interface SupplierStatsDto {
  totalSuppliers: number;
  activeSuppliers: number;
  reviewSuppliers: number;
  blockedSuppliers: number;
  issueOpenCount: number;
  averageScore: number;
}

export interface SupplierPageData {
  suppliers: SupplierDto[];
  contacts: SupplierContactDto[];
  products: SupplierProductDto[];
  quotations: SupplierQuotationDto[];
  contracts: SupplierContractPlaceholderDto[];
  ratings: SupplierRatingDto[];
  issues: SupplierIssueDto[];
  stats: SupplierStatsDto;
}
