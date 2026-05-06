import type { DataMeta } from "@/lib/data";
import { getCurrentPsiLifecycleStage, getPsiLifecycleStagesByModule } from "@/lib/psi-lifecycle";
import { getPsiInventoryIssues, getPsiPurchaseIssues, getPsiSupplierIssues } from "@/lib/services/psi";

interface BasePsiPageData {
  meta: DataMeta;
  isMock: boolean;
  error?: string;
}

export interface PsiIssuePlaceholderRow {
  issueId: string;
  moduleCode: "procurement" | "supplier" | "inventory";
  title: string;
  priority: string;
  status: string;
  sourceRef: string;
  lifecycleStage: string;
  detailHref?: string;
  actionHref?: string;
}

export interface PsiIssuesPageData extends BasePsiPageData {
  rows: PsiIssuePlaceholderRow[];
}

export async function getPsiIssuesPageData(): Promise<PsiIssuesPageData> {
  const [purchaseIssues, supplierIssues, inventoryIssues] = await Promise.all([
    getPsiPurchaseIssues(),
    getPsiSupplierIssues(),
    getPsiInventoryIssues(),
  ]);

  const source = [purchaseIssues, supplierIssues, inventoryIssues].find((result) => result.ok)?.meta.source ?? "mock";
  const errors = [purchaseIssues, supplierIssues, inventoryIssues]
    .filter((result) => !result.ok)
    .map((result) => result.error.message);

  const procurementRows = purchaseIssues.ok
    ? purchaseIssues.data.map((item) => ({
        issueId: item.issueId,
        moduleCode: "procurement" as const,
        title: item.title.en,
        priority: item.priority,
        status: item.status,
        sourceRef: item.sourceRef.recordId,
        lifecycleStage: getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule("procurement"))?.label.en ?? "Placeholder",
        detailHref: item.sourceRef.route,
        actionHref: "/psi/actions/psi.action.reportPurchaseIssue",
      }))
    : [];

  const supplierRows = supplierIssues.ok
    ? supplierIssues.data.map((item) => ({
        issueId: item.issueId,
        moduleCode: "supplier" as const,
        title: item.title.en,
        priority: item.priority,
        status: item.status,
        sourceRef: item.sourceRef.recordId,
        lifecycleStage: getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule("supplier"))?.label.en ?? "Placeholder",
        detailHref: item.sourceRef.route,
        actionHref: "/psi/actions/psi.action.reportSupplierIssue",
      }))
    : [];

  const inventoryRows = inventoryIssues.ok
    ? inventoryIssues.data.map((item) => ({
        issueId: item.issueId,
        moduleCode: "inventory" as const,
        title: item.title.en,
        priority: item.priority,
        status: item.status,
        sourceRef: item.sourceRef.recordId,
        lifecycleStage: getCurrentPsiLifecycleStage(getPsiLifecycleStagesByModule("inventory"))?.label.en ?? "Placeholder",
        detailHref: item.sourceRef.route,
        actionHref: "/psi/actions/psi.action.reportInventoryIssue",
      }))
    : [];

  return {
    rows: [...procurementRows, ...supplierRows, ...inventoryRows],
    meta: { source, generatedAt: new Date().toISOString() },
    isMock: source === "mock",
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}
