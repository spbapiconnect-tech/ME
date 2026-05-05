import { toInventoryDisplayRecords, toInventoryIssueDisplayRecords } from "@/lib/display-adapters/psi";
import type { DataMeta } from "@/lib/data";
import { getPsiInventoryPageData, getPsiSkuDetail } from "@/lib/services/psi";
import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

interface BasePsiPageData {
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export interface PsiInventoryWorkspacePageData extends BasePsiPageData {
  pageData: Psi.InventoryPageData | null;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
}

export async function getPsiInventoryWorkspacePageData(): Promise<PsiInventoryWorkspacePageData> {
  const result = await getPsiInventoryPageData();
  if (!result.ok) {
    return { pageData: null, records: [], issueRecords: [], meta: result.meta, isMock: result.meta.source === "mock", error: result.error.message };
  }

  return {
    pageData: result.data,
    records: toInventoryDisplayRecords(result.data),
    issueRecords: toInventoryIssueDisplayRecords(result.data.issues),
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}

export interface PsiInventoryDetailPageData extends BasePsiPageData {
  sku: Psi.SkuDto | null;
  detailRows: Array<{ key: string; value: string }>;
}

export async function getPsiInventoryDetailPageData(id: string): Promise<PsiInventoryDetailPageData> {
  const result = await getPsiSkuDetail(id);
  if (!result.ok || !result.data) {
    return { sku: null, detailRows: [], meta: result.meta, isMock: result.meta.source === "mock", error: result.ok ? "Record not found" : result.error.message };
  }

  const sku = result.data;
  return {
    sku,
    detailRows: [
      { key: "SKU Code", value: sku.skuCode },
      { key: "Product", value: sku.productName },
      { key: "Unit", value: sku.unit },
      { key: "Safety Stock", value: String(sku.safetyStock) },
      { key: "Status", value: sku.status },
    ],
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}
