import { PsiWorkspacePage } from "@/components/psi";
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiSupplierRoute() {
  const data = await getPsiSupplierWorkspacePageData();

  return (
    <PsiWorkspacePage
      title="ME PSI Supplier"
      subtitle="Supplier performance, contract status, and quality review workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "Total Suppliers", value: data.pageData?.suppliers.length ?? 0 },
        { label: "Active Contracts", value: data.pageData?.suppliers.filter(s => s.status === "active").length ?? 0 },
        { label: "Average Rating", value: "4.5" },
        { label: "Issues Open", value: data.pageData?.issues.length ?? 0 },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/supplier"
    />
  );
}
