import { getPsiMasterDataSnapshot } from "@/lib/me/master-data";

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
  const procurementMaster = getPsiMasterDataSnapshot().procurement;
  return {
    async listPurchaseRequests(params) {
      const filtered = procurementMaster.purchaseRequests.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.requestId} ${item.requestNo} ${item.storeId} ${item.supplierId ?? ""}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getPurchaseRequestById(id) {
      return okResult(procurementMaster.purchaseRequests.find((item) => item.requestId === id) ?? null, "db");
    },

    async listPurchaseOrders(params) {
      const filtered = procurementMaster.purchaseOrders.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.orderId} ${item.orderNo} ${item.supplierId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getPurchaseOrderById(id) {
      return okResult(procurementMaster.purchaseOrders.find((item) => item.orderId === id) ?? null, "db");
    },

    async listReceiving(params) {
      const filtered = procurementMaster.receivingRecords.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.receivingId} ${item.receivingNo} ${item.orderId} ${item.supplierId}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async listPurchaseIssues(params) {
      const filtered = procurementMaster.purchaseIssues.filter((item) => {
        if (params?.status && item.status !== params.status) return false;
        if (params?.sourceModule && item.sourceRef.moduleCode !== params.sourceModule) return false;
        return includesSearch(`${item.issueId} ${item.title.en} ${item.title.zh} ${item.supplierId ?? ""}`, params?.search);
      });
      return okResult(paginate(filtered, params), "db");
    },

    async getProcurementStats() {
      return okResult(procurementMaster.stats, "db");
    },

    async getProcurementPageData() {
      return okResult(procurementMaster, "db");
    },
  };
}
