import { PsiWorkspacePage } from "@/components/psi";
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiInventoryRoute() {
  const data = await getPsiInventoryWorkspacePageData();

  return (
    <PsiWorkspacePage
      title="ME PSI Inventory"
      subtitle="Stock level, stock movement, and SKU status review workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "Total SKUs", value: (data.pageData?.skuList ?? []).length },
        { label: "Low Stock Alerts", value: data.pageData?.skuList.filter(s => s.status === "low-stock").length ?? 0 },
        { label: "Out of Stock", value: data.pageData?.skuList.filter(s => s.status === "out-of-stock").length ?? 0 },
        { label: "Issues Open", value: (data.pageData?.issues ?? []).length },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/inventory"
    />
  );
}
