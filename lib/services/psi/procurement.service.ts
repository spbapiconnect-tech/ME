import type { PsiQueryParams } from "@/lib/repositories/contracts";
import { getPsiProcurementRepository } from "@/lib/repositories/provider";

export async function getPsiPurchaseRequests(params?: PsiQueryParams) {
  return getPsiProcurementRepository().listPurchaseRequests(params);
}

export async function getPsiPurchaseRequestDetail(id: string) {
  return getPsiProcurementRepository().getPurchaseRequestById(id);
}

export async function getPsiPurchaseOrders(params?: PsiQueryParams) {
  return getPsiProcurementRepository().listPurchaseOrders(params);
}

export async function getPsiReceiving(params?: PsiQueryParams) {
  return getPsiProcurementRepository().listReceiving(params);
}

export async function getPsiPurchaseIssues(params?: PsiQueryParams) {
  return getPsiProcurementRepository().listPurchaseIssues(params);
}

export async function getPsiProcurementStats(params?: PsiQueryParams) {
  return getPsiProcurementRepository().getProcurementStats(params);
}

export async function getPsiProcurementPageData(params?: PsiQueryParams) {
  return getPsiProcurementRepository().getProcurementPageData(params);
}
