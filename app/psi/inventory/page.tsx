import { PsiWorkspacePage } from "@/components/psi";
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiInventoryPage() {
  const data = await getPsiInventoryWorkspacePageData();

  return (
    <PsiWorkspacePage
      title="ME PSI Inventory"
      subtitle="Read-only mock inventory workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "SKUs", value: data.pageData?.stats.totalSkus ?? 0 },
        { label: "Low Stock", value: data.pageData?.stats.lowStockSkus ?? 0 },
        { label: "Inbound Pending", value: data.pageData?.stats.inboundPending ?? 0 },
        { label: "Issue Open", value: data.pageData?.stats.issueOpenCount ?? 0 },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/inventory"
      actionShortcuts={[
        { label: "Adjust Inventory", actionKey: "psi.action.adjustInventory" },
        { label: "Transfer Stock", actionKey: "psi.action.transferStock" },
        { label: "Report Inventory Issue", actionKey: "psi.action.reportInventoryIssue" },
      ]}
    />
  );
}
