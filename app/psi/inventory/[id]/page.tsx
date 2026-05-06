import { PsiDetailPage } from "@/components/psi";
import { getPsiInventoryDetailPageData } from "@/lib/page-data/psi";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PsiInventoryDetailPage({ params }: Props) {
  const resolved = await params;
  const data = await getPsiInventoryDetailPageData(resolved.id);

  return (
    <PsiDetailPage
      title={data.sku?.productName ?? resolved.id}
      source={data.meta.source}
      isMock={data.isMock}
      error={data.error}
      rows={data.detailRows}
      backHref="/psi/inventory"
      detailPanelData={data.detailPanelData}
      relatedActions={[
        { label: "Adjust Inventory", actionKey: "psi.action.adjustInventory" },
        { label: "Transfer Stock", actionKey: "psi.action.transferStock" },
        { label: "Report Inventory Issue", actionKey: "psi.action.reportInventoryIssue" },
      ]}
    />
  );
}
