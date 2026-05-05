import { toProcurementDisplayRecords, toProcurementIssueDisplayRecords } from "@/lib/display-adapters/psi";
import type { DataMeta } from "@/lib/data";
import { getPsiProcurementPageData, getPsiPurchaseRequestDetail } from "@/lib/services/psi";
import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

interface BasePsiPageData {
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export interface PsiProcurementWorkspacePageData extends BasePsiPageData {
  pageData: Psi.ProcurementPageData | null;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
}

export async function getPsiProcurementWorkspacePageData(): Promise<PsiProcurementWorkspacePageData> {
  const result = await getPsiProcurementPageData();
  if (!result.ok) {
    return { pageData: null, records: [], issueRecords: [], meta: result.meta, isMock: result.meta.source === "mock", error: result.error.message };
  }

  return {
    pageData: result.data,
    records: toProcurementDisplayRecords(result.data),
    issueRecords: toProcurementIssueDisplayRecords(result.data.purchaseIssues),
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}

export interface PsiProcurementDetailPageData extends BasePsiPageData {
  request: Psi.PurchaseRequestDto | null;
  detailRows: Array<{ key: string; value: string }>;
}

export async function getPsiProcurementDetailPageData(id: string): Promise<PsiProcurementDetailPageData> {
  const result = await getPsiPurchaseRequestDetail(id);
  if (!result.ok || !result.data) {
    return { request: null, detailRows: [], meta: result.meta, isMock: result.meta.source === "mock", error: result.ok ? "Record not found" : result.error.message };
  }

  const request = result.data;
  return {
    request,
    detailRows: [
      { key: "Request No", value: request.requestNo },
      { key: "Store", value: request.storeId },
      { key: "Supplier", value: request.supplierId ?? "N/A" },
      { key: "Status", value: request.status },
      { key: "Priority", value: request.priority },
      { key: "Total", value: `${request.totalAmount.currency} ${request.totalAmount.amount.toFixed(2)}` },
    ],
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}
