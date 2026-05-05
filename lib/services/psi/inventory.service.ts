import type { PsiQueryParams } from "@/lib/repositories/contracts";
import { getPsiInventoryRepository } from "@/lib/repositories/provider";

export async function getPsiSkus(params?: PsiQueryParams) {
  return getPsiInventoryRepository().listSkus(params);
}

export async function getPsiSkuDetail(id: string) {
  return getPsiInventoryRepository().getSkuById(id);
}

export async function getPsiStoreStock(params?: PsiQueryParams) {
  return getPsiInventoryRepository().listStoreStock(params);
}

export async function getPsiInventoryIssues(params?: PsiQueryParams) {
  return getPsiInventoryRepository().listInventoryIssues(params);
}

export async function getPsiReplenishmentSuggestions(params?: PsiQueryParams) {
  return getPsiInventoryRepository().listReplenishmentSuggestions(params);
}

export async function getPsiInventoryStats(params?: PsiQueryParams) {
  return getPsiInventoryRepository().getInventoryStats(params);
}

export async function getPsiInventoryPageData(params?: PsiQueryParams) {
  return getPsiInventoryRepository().getInventoryPageData(params);
}
