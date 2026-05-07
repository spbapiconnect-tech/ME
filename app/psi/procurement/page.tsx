import { PsiWorkspacePage } from "@/components/psi";
import { getPsiProcurementWorkspacePageData } from "@/lib/page-data/psi";

export default async function PsiProcurementPage() {
  const data = await getPsiProcurementWorkspacePageData();

  return (
    <PsiWorkspacePage
      title="ME PSI Procurement"
      subtitle="Procurement requests, purchase activity, and issue review workspace"
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      stats={[
        { label: "Purchase Requests", value: data.pageData?.stats.totalRequests ?? 0 },
        { label: "Pending Requests", value: data.pageData?.stats.pendingRequests ?? 0 },
        { label: "Purchase Orders", value: data.pageData?.stats.totalOrders ?? 0 },
        { label: "Issue Open", value: data.pageData?.stats.issueOpenCount ?? 0 },
      ]}
      records={data.records}
      issueRecords={data.issueRecords}
      detailBasePath="/psi/procurement"
      actionShortcuts={[
        { label: "Create Purchase Request", actionKey: "psi.action.createPurchaseRequest" },
        { label: "Record Receiving", actionKey: "psi.action.recordReceiving" },
        { label: "Report Purchase Issue", actionKey: "psi.action.reportPurchaseIssue" },
      ]}
    />
  );
}
