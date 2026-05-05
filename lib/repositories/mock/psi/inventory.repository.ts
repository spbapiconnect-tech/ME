import { psiInventoryPageData } from "@/data/psi";

import { okResult } from "@/lib/data";

import type { PsiInventoryRepository, PsiQueryParams } from "../../contracts";

function paginate<T>(items: T[], params?: PsiQueryParams) {
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? (items.length || 1));
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function includesSearch(haystack: string, search?: string) {
  if (!search) return true;
  return haystack.toLowerCase().includes(search.toLowerCase());
}

export function createMockPsiInventoryRepository(): PsiInventoryRepository {
  return {
    async listSkus(params) {
      const filtered = psiInventoryPageData.skus.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.skuId} ${item.skuCode} ${item.productName}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async getSkuById(id) {
      return okResult(psiInventoryPageData.skus.find((item) => item.skuId === id) ?? null, "mock");
    },

    async listStoreStock(params) {
      const filtered = psiInventoryPageData.storeStocks.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.stockId} ${item.skuId} ${item.warehouseId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async listInventoryIssues(params) {
      const filtered = psiInventoryPageData.issues.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.issueId} ${item.skuId} ${item.title.en} ${item.title.zh}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async listReplenishmentSuggestions(params) {
      const filtered = psiInventoryPageData.replenishmentSuggestions.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.suggestionId} ${item.skuId} ${item.reason}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async getInventoryStats() {
      return okResult(psiInventoryPageData.stats, "mock");
    },

    async getInventoryPageData() {
      return okResult(psiInventoryPageData, "mock");
    },
  };
}
