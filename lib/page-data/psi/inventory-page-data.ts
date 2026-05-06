import {
  toInventoryDetailPanelData,
  toInventoryDisplayRecords,
  toInventoryIssueDisplayRecords,
} from "@/lib/display-adapters/psi";
import type { DataMeta } from "@/lib/data";
import { getPsiInventoryIssues, getPsiInventoryPageData, getPsiSkuDetail } from "@/lib/services/psi";
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
    return {
      pageData: null,
      records: [],
      issueRecords: [],
      meta: result.meta,
      isMock: result.meta.source === "mock",
      error: result.error.message,
    };
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
  detailPanelData: Psi.PsiDetailPanelData | null;
  timeline: Psi.PsiTimelineEvent[];
  lifecycle: Psi.PsiIssueLifecycleStage[];
  linkedRecords: Psi.PsiLinkedRecord[];
  insights: Psi.PsiDetailInsight[];
  relatedActionDraftKeys: string[];
  relatedTaskPlaceholders: Psi.PsiLinkedTaskPlaceholder[];
  relatedIssueIds: string[];
  relatedIssueSummaries: Psi.InventoryIssueDto[];
}

export async function getPsiInventoryDetailPageData(id: string): Promise<PsiInventoryDetailPageData> {
  const result = await getPsiSkuDetail(id);
  if (!result.ok || !result.data) {
    return {
      sku: null,
      detailRows: [],
      detailPanelData: null,
      timeline: [],
      lifecycle: [],
      linkedRecords: [],
      insights: [],
      relatedActionDraftKeys: [],
      relatedTaskPlaceholders: [],
      relatedIssueIds: [],
      relatedIssueSummaries: [],
      meta: result.meta,
      isMock: result.meta.source === "mock",
      error: result.ok ? "Record not found" : result.error.message,
    };
  }

  const sku = result.data;
  const issuesResult = await getPsiInventoryIssues();
  const relatedIssueSummaries = issuesResult.ok
    ? issuesResult.data.filter((issue) => issue.skuId === sku.skuId)
    : [];

  const detailPanelData = toInventoryDetailPanelData(sku);
  detailPanelData.relatedIssueIds = relatedIssueSummaries.map((issue) => issue.issueId);
  detailPanelData.relatedTaskPlaceholders = relatedIssueSummaries
    .map((issue) => issue.linkedTask)
    .filter((task): task is Psi.PsiLinkedTaskPlaceholder => Boolean(task));

  return {
    sku,
    detailRows: [
      { key: "SKU Code", value: sku.skuCode },
      { key: "Product", value: sku.productName },
      { key: "Unit", value: sku.unit },
      { key: "Safety Stock", value: String(sku.safetyStock) },
      { key: "Status", value: sku.status },
    ],
    detailPanelData,
    timeline: detailPanelData.timeline,
    lifecycle: detailPanelData.lifecycle,
    linkedRecords: detailPanelData.linkedRecords,
    insights: detailPanelData.insights,
    relatedActionDraftKeys: detailPanelData.relatedActionDraftKeys,
    relatedTaskPlaceholders: detailPanelData.relatedTaskPlaceholders,
    relatedIssueIds: detailPanelData.relatedIssueIds,
    relatedIssueSummaries,
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}
