import { PsiWorkspacePage } from "@/components/psi";
import { getPsiInventoryWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiInventoryRoute() {
  const data = await getPsiInventoryWorkspacePageData();

  const pageData = data.pageData as
    | {
        skuList?: Array<{ status?: string }>;
        issues?: unknown[];
      }
    | undefined;

  const skuList = pageData?.skuList ?? [];
  const issues = pageData?.issues ?? [];

  return (
    <PsiWorkspacePage
      title="ME PSI Inventory"
      subtitle="Stock level, stock movement, and SKU status review workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "Total SKUs", value: skuList.length },
        { label: "Low Stock Alerts", value: skuList.filter((item) => item.status === "low-stock").length },
        { label: "Out of Stock", value: skuList.filter((item) => item.status === "out-of-stock").length },
        { label: "Issues Open", value: issues.length },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/inventory"
    />
  );
}
