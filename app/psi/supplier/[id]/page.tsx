import { PsiDetailPage } from "@/components/psi";
import { getPsiSupplierDetailPageData } from "@/lib/page-data/psi";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PsiSupplierDetailPage({ params }: Props) {
  const resolved = await params;
  const data = await getPsiSupplierDetailPageData(resolved.id);

  return (
    <PsiDetailPage
      title={data.supplier?.name ?? resolved.id}
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      rows={data.detailRows}
      backHref="/psi/supplier"
      detailPanelData={data.detailPanelData}
      relatedActions={[
        { label: "Add Supplier", actionKey: "psi.action.addSupplier" },
        { label: "Review Supplier", actionKey: "psi.action.reviewSupplier" },
        { label: "Report Supplier Issue", actionKey: "psi.action.reportSupplierIssue" },
      ]}
    />
  );
}
