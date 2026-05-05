import type { PsiQueryParams } from "@/lib/repositories/contracts";
import { getPsiSupplierRepository } from "@/lib/repositories/provider";

export async function getPsiSuppliers(params?: PsiQueryParams) {
  return getPsiSupplierRepository().listSuppliers(params);
}

export async function getPsiSupplierDetail(id: string) {
  return getPsiSupplierRepository().getSupplierById(id);
}

export async function getPsiSupplierProducts(supplierId?: string, params?: PsiQueryParams) {
  return getPsiSupplierRepository().listSupplierProducts(supplierId, params);
}

export async function getPsiSupplierIssues(params?: PsiQueryParams) {
  return getPsiSupplierRepository().listSupplierIssues(params);
}

export async function getPsiSupplierStats(params?: PsiQueryParams) {
  return getPsiSupplierRepository().getSupplierStats(params);
}

export async function getPsiSupplierPageData(params?: PsiQueryParams) {
  return getPsiSupplierRepository().getSupplierPageData(params);
}
