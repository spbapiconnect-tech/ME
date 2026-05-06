import {
  toSupplierDetailPanelData,
  toSupplierDisplayRecords,
  toSupplierIssueDisplayRecords,
} from "@/lib/display-adapters/psi";
import type { DataMeta } from "@/lib/data";
import { getPsiSupplierDetail, getPsiSupplierIssues, getPsiSupplierPageData } from "@/lib/services/psi";
import type { DisplayRecord } from "@/types/display-model";
import type * as Psi from "@/types/psi";

interface BasePsiPageData {
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export interface PsiSupplierWorkspacePageData extends BasePsiPageData {
  pageData: Psi.SupplierPageData | null;
  records: DisplayRecord[];
  issueRecords: DisplayRecord[];
}

export async function getPsiSupplierWorkspacePageData(): Promise<PsiSupplierWorkspacePageData> {
  const result = await getPsiSupplierPageData();
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
    records: toSupplierDisplayRecords(result.data),
    issueRecords: toSupplierIssueDisplayRecords(result.data.issues),
    meta: result.meta,
    isMock: result.meta.source === "mock",
  };
}

export interface PsiSupplierDetailPageData extends BasePsiPageData {
  supplier: Psi.SupplierDto | null;
  detailRows: Array<{ key: string; value: string }>;
  detailPanelData: Psi.PsiDetailPanelData | null;
  timeline: Psi.PsiTimelineEvent[];
  lifecycle: Psi.PsiIssueLifecycleStage[];
  linkedRecords: Psi.PsiLinkedRecord[];
  insights: Psi.PsiDetailInsight[];
  relatedActionDraftKeys: string[];
  relatedTaskPlaceholders: Psi.PsiLinkedTaskPlaceholder[];
  relatedIssueIds: string[];
  relatedIssueSummaries: Psi.SupplierIssueDto[];
}

export async function getPsiSupplierDetailPageData(id: string): Promise<PsiSupplierDetailPageData> {
  const result = await getPsiSupplierDetail(id);
  if (!result.ok || !result.data) {
    return {
      supplier: null,
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

  const supplier = result.data;
  const issuesResult = await getPsiSupplierIssues();
  const relatedIssueSummaries = issuesResult.ok
    ? issuesResult.data.filter((issue) => issue.supplierId === supplier.supplierId)
    : [];

  const detailPanelData = toSupplierDetailPanelData(supplier);
  detailPanelData.relatedIssueIds = relatedIssueSummaries.map((issue) => issue.issueId);
  detailPanelData.relatedTaskPlaceholders = relatedIssueSummaries
    .map((issue) => issue.linkedTask)
    .filter((task): task is Psi.PsiLinkedTaskPlaceholder => Boolean(task));

  return {
    supplier,
    detailRows: [
      { key: "Supplier Code", value: supplier.supplierCode },
      { key: "Name", value: supplier.name },
      { key: "Category", value: supplier.category },
      { key: "Region", value: supplier.serviceRegion },
      { key: "Lead Time", value: `${supplier.leadTimeDays} days` },
      { key: "Status", value: supplier.status },
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
