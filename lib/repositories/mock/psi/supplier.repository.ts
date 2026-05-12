import { getPsiMasterDataSnapshot } from "@/lib/me/master-data";

import { okResult } from "@/lib/data";

import type { PsiQueryParams, PsiSupplierRepository } from "../../contracts";

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

export function createMockPsiSupplierRepository(): PsiSupplierRepository {
  const supplierMaster = getPsiMasterDataSnapshot().supplier;
  return {
    async listSuppliers(params) {
      const filtered = supplierMaster.suppliers.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.supplierId} ${item.supplierCode} ${item.name} ${item.category}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getSupplierById(id) {
      return okResult(supplierMaster.suppliers.find((item) => item.supplierId === id) ?? null, "db");
    },

    async listSupplierProducts(supplierId, params) {
      const filtered = supplierMaster.products.filter((item) => {
        if (supplierId && item.supplierId !== supplierId) return false;
        if (params?.status && item.status !== params.status) return false;
        return includesSearch(`${item.productLinkId} ${item.skuId} ${item.productName}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async listSupplierIssues(params) {
      const filtered = supplierMaster.issues.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.issueId} ${item.title.en} ${item.title.zh} ${item.supplierId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getSupplierStats() {
      return okResult(supplierMaster.stats, "db");
    },

    async getSupplierPageData() {
      return okResult(supplierMaster, "db");
    },
  };
}
