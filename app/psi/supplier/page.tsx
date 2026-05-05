import { PsiWorkspacePage } from "@/components/psi";
import { getPsiSupplierWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiSupplierPage() {
  const data = await getPsiSupplierWorkspacePageData();

  return (
    <PsiWorkspacePage
      title="ME PSI Supplier"
      subtitle="Read-only mock supplier workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "Suppliers", value: data.pageData?.stats.totalSuppliers ?? 0 },
        { label: "Active", value: data.pageData?.stats.activeSuppliers ?? 0 },
        { label: "Review", value: data.pageData?.stats.reviewSuppliers ?? 0 },
        { label: "Issue Open", value: data.pageData?.stats.issueOpenCount ?? 0 },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/supplier"
      actionShortcuts={[
        { label: "Add Supplier", actionKey: "psi.action.addSupplier" },
        { label: "Review Supplier", actionKey: "psi.action.reviewSupplier" },
        { label: "Report Supplier Issue", actionKey: "psi.action.reportSupplierIssue" },
      ]}
    />
  );
}
