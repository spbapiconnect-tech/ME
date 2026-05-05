import { PsiDetailPage } from "@/components/psi";
import { getPsiProcurementDetailPageData } from "@/lib/page-data/psi";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PsiProcurementDetailPage({ params }: Props) {
  const resolved = await params;
  const data = await getPsiProcurementDetailPageData(resolved.id);

  return (
    <PsiDetailPage
      title={data.request?.requestNo ?? resolved.id}
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      rows={data.detailRows}
      backHref="/psi/procurement"
      relatedActions={[
        { label: "Create Purchase Request", actionKey: "psi.action.createPurchaseRequest" },
        { label: "Record Receiving", actionKey: "psi.action.recordReceiving" },
        { label: "Report Purchase Issue", actionKey: "psi.action.reportPurchaseIssue" },
      ]}
    />
  );
}
