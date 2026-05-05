import { psiProcurementPageData } from "@/data/psi";

import { okResult } from "@/lib/data";

import type { PsiProcurementRepository, PsiQueryParams } from "../../contracts";

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

export function createMockPsiProcurementRepository(): PsiProcurementRepository {
  return {
    async listPurchaseRequests(params) {
      const filtered = psiProcurementPageData.purchaseRequests.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.requestId} ${item.requestNo} ${item.storeId} ${item.supplierId ?? ""}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async getPurchaseRequestById(id) {
      return okResult(psiProcurementPageData.purchaseRequests.find((item) => item.requestId === id) ?? null, "mock");
    },

    async listPurchaseOrders(params) {
      const filtered = psiProcurementPageData.purchaseOrders.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.orderId} ${item.orderNo} ${item.supplierId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async getPurchaseOrderById(id) {
      return okResult(psiProcurementPageData.purchaseOrders.find((item) => item.orderId === id) ?? null, "mock");
    },

    async listReceiving(params) {
      const filtered = psiProcurementPageData.receivingRecords.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.receivingId} ${item.receivingNo} ${item.orderId} ${item.supplierId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async listPurchaseIssues(params) {
      const filtered = psiProcurementPageData.purchaseIssues.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.issueId} ${item.title.en} ${item.title.zh} ${item.supplierId ?? ""}`, params?.search);
      });
      return okResult(paginate(filtered, params), "mock");
    },

    async getProcurementStats() {
      return okResult(psiProcurementPageData.stats, "mock");
    },

    async getProcurementPageData() {
      return okResult(psiProcurementPageData, "mock");
    },
  };
}
