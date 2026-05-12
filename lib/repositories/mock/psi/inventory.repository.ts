import { getPsiMasterDataSnapshot } from "@/lib/me/master-data";

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
  const inventoryMaster = getPsiMasterDataSnapshot().inventory;
  return {
    async listSkus(params) {
      const filtered = inventoryMaster.skus.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.skuId} ${item.skuCode} ${item.productName}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getSkuById(id) {
      return okResult(inventoryMaster.skus.find((item) => item.skuId === id) ?? null, "db");
    },

    async listStoreStock(params) {
      const filtered = inventoryMaster.storeStocks.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.stockId} ${item.skuId} ${item.warehouseId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async listInventoryIssues(params) {
      const filtered = inventoryMaster.issues.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.issueId} ${item.skuId} ${item.title.en} ${item.title.zh}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async listReplenishmentSuggestions(params) {
      const filtered = inventoryMaster.replenishmentSuggestions.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.suggestionId} ${item.skuId} ${item.reason}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getInventoryStats() {
      return okResult(inventoryMaster.stats, "db");
    },

    async getInventoryPageData() {
      return okResult(inventoryMaster, "db");
    },
  };
}
